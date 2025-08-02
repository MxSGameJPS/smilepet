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
  const categoria = searchParams.get("categoria");
  const idCategoria = searchParams.get("idCategoria");
  let accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json(
      { error: "Token não encontrado" },
      { status: 401 }
    );
  }

  try {
    // Se veio idCategoria, busca por categoria
    let produtosTemp = [];
    let cacheKey = idCategoria
      ? `bling_produtos_categoria_${idCategoria}`
      : `bling_produtos_todos`;
    let cached;
    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      cached = await kvGet(cacheKey);
    } else {
      const fs = require("fs");
      const path = idCategoria
        ? `./produtos_categoria_${idCategoria}.json`
        : `./produtos_todos.json`;
      if (fs.existsSync(path)) {
        cached = JSON.parse(fs.readFileSync(path, "utf-8"));
      }
    }
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return NextResponse.json({ data: cached });
    } else if (
      cached &&
      typeof cached === "object" &&
      Array.isArray(cached.data) &&
      cached.data.length > 0
    ) {
      return NextResponse.json({ data: cached.data });
    }
    // Se não tem cache ou está vazio, busca da API Bling
    let page = 1;
    let erro429 = false;
    // Função para delay entre páginas
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    while (true) {
      const url = idCategoria
        ? `https://developer.bling.com.br/api/bling/produtos?pagina=${page}&limite=100&criterio=1&tipo=T&idCategoria=${idCategoria}&nome=%20`
        : `https://developer.bling.com.br/api/bling/produtos?pagina=${page}&limite=100&criterio=1&tipo=T&nome=%20`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        cache: "no-store",
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error(
          "[Bling Products] Erro na resposta:",
          res.status,
          errText
        );
        if (res.status === 429) {
          erro429 = true;
          break;
        }
        return NextResponse.json(
          { error: `Erro Bling: ${res.status}`, details: errText },
          { status: res.status }
        );
      }
      let arr = [];
      const json = await res.json();
      if (Array.isArray(json.data)) arr = json.data;
      else if (Array.isArray(json.retorno)) arr = json.retorno;
      else if (Array.isArray(json.retorno?.produtos))
        arr = json.retorno.produtos;
      else if (Array.isArray(json.produtos)) arr = json.produtos;
      if (arr.length === 0) break;
      produtosTemp = produtosTemp.concat(arr);
      if (arr.length < 100) break;
      page++;
      await sleep(400); // Delay de 400ms entre cada página
    }
    if (erro429) {
      if (cached && Array.isArray(cached) && cached.length > 0) {
        return NextResponse.json({ data: cached });
      } else if (
        cached &&
        typeof cached === "object" &&
        Array.isArray(cached.data) &&
        cached.data.length > 0
      ) {
        return NextResponse.json({ data: cached.data });
      } else {
        return NextResponse.json({ data: [] });
      }
    }
    if (produtosTemp.length > 0) {
      if (process.env.VERCEL || process.env.NODE_ENV === "production") {
        await kvSet(cacheKey, produtosTemp);
      } else {
        const fs = require("fs");
        const path = idCategoria
          ? `./produtos_categoria_${idCategoria}.json`
          : `./produtos_todos.json`;
        fs.writeFileSync(path, JSON.stringify(produtosTemp, null, 2));
      }
    }
    return NextResponse.json({ data: produtosTemp });
  } catch (e) {
    console.error("[Bling Products] Erro inesperado:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
