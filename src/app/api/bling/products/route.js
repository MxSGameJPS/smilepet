import { NextResponse } from "next/server";
import { kvGet } from "@/lib/vercelKv";

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

export async function GET() {
  let accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: "Token de acesso não encontrado." },
      { status: 401 }
    );
  }

  let res = await fetch(
    "https://www.bling.com.br/Api/v3/produtos?page=1&limit=4",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  // Se o token for inválido, tenta renovar automaticamente
  if (res.status === 401) {
    // Tenta renovar o token
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://smilepet-loja.vercel.app";
    const refreshRes = await fetch(`${baseUrl}/api/bling/refresh`, {
      method: "POST",
    });
    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();
      accessToken = refreshData.access_token;
      // Tenta novamente a requisição de produtos
      res = await fetch(
        "https://www.bling.com.br/Api/v3/produtos?page=1&limit=4",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );
    } else {
      const err = await refreshRes.text();
      return NextResponse.json(
        { error: "Falha ao renovar token", details: err },
        { status: 401 }
      );
    }
  }

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: res.status });
  }
  const data = await res.json();
  return NextResponse.json(data);
}
