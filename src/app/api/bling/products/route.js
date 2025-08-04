import { NextResponse } from "next/server";
import { kvGet, kvSet } from "@/lib/vercelKv";

// Função utilitária para obter o access_token salvo (ajuste conforme seu fluxo real)
async function getAccessToken() {
  // Em produção (Vercel), use o Vercel KV
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return await kvGet("bling_access_token");
  }
  // Em dev/local, use arquivo
  try {
    const fs = require("fs");
    const path = "./bling_token.json";
    if (!fs.existsSync(path)) return null;
    const data = JSON.parse(fs.readFileSync(path, "utf-8"));
    return data.access_token;
  } catch (e) {
    return null;
  }
}
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const idCategoria = searchParams.get("idCategoria");
  let accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: "Token não encontrado" },
      { status: 401 }
    );
  }
  try {
    let produtosTemp = [];
    const url = idCategoria
      ? `https://developer.bling.com.br/api/bling/produtos?pagina=1&limite=10&criterio=1&tipo=T&idCategoria=${idCategoria}&nome=%20`
      : `https://developer.bling.com.br/api/bling/produtos?pagina=1&limite=10&criterio=1&tipo=T&nome=%20`;
    let res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });
    let arr = [];
    let json;
    if (!res.ok) {
      const errText = await res.text();
      try {
        json = JSON.parse(errText);
      } catch {
        json = {};
      }
      console.log(`[Bling API] Status: ${res.status} | Body:`, errText);
      console.error("[Bling Products] Erro na resposta:", res.status, errText);
      if (
        json?.error?.type === "invalid_token" ||
        json?.error?.message === "invalid_token" ||
        errText.includes("invalid_token")
      ) {
        console.warn("[Bling API] Token expirado detectado. Renovando...");
        const novoToken = await renovarToken();
        if (novoToken) {
          accessToken = novoToken;
          res = await fetch(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
            },
            cache: "no-store",
          });
          if (!res.ok) {
            const errText2 = await res.text();
            console.log(
              `[Bling API] Status após renovação: ${res.status} | Body:`,
              errText2
            );
            return NextResponse.json(
              {
                error: `Erro Bling após renovação: ${res.status}`,
                details: errText2,
              },
              { status: res.status }
            );
          }
        } else {
          return NextResponse.json(
            { error: "Falha ao renovar token Bling." },
            { status: 401 }
          );
        }
      } else if (res.status === 429) {
        console.log(
          "[Bling API] Erro 429: Limite de requisições atingido. Retornando array vazio."
        );
        return NextResponse.json({ data: [] });
      } else {
        return NextResponse.json(
          { error: `Erro Bling: ${res.status}`, details: errText },
          { status: res.status }
        );
      }
    }
    json = json || (await res.json());
    if (Array.isArray(json.data)) arr = json.data;
    else if (Array.isArray(json.retorno)) arr = json.retorno;
    else if (Array.isArray(json.retorno?.produtos)) arr = json.retorno.produtos;
    else if (Array.isArray(json.produtos)) arr = json.produtos;
    produtosTemp = arr;
    return NextResponse.json({ data: produtosTemp });
  } catch (e) {
    console.error("[Bling Products] Erro inesperado:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// Função para renovar token
async function renovarToken() {
  try {
    const res = await fetch("/api/bling/refresh", { method: "POST" });
    const data = await res.json();
    if (data.access_token) {
      console.log(
        "[Bling API] Token renovado:",
        data.access_token.slice(0, 8) + "..."
      );
      return data.access_token;
    } else {
      console.error("[Bling API] Falha ao renovar token:", data);
      return null;
    }
  } catch (e) {
    console.error("[Bling API] Erro ao renovar token:", e);
    return null;
  }
}

// ...existing code...
