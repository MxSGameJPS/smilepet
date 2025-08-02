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
    if (idCategoria) {
      let produtosTemp = [];
      let cacheKey = `bling_produtos_categoria_${idCategoria}`;
      let cached;
      if (process.env.VERCEL || process.env.NODE_ENV === "production") {
        cached = await kvGet(cacheKey);
      } else {
        const fs = require("fs");
        const path = `./produtos_categoria_${idCategoria}.json`;
        if (fs.existsSync(path)) {
          cached = JSON.parse(fs.readFileSync(path, "utf-8"));
        }
      }
      if (cached && Array.isArray(cached)) {
        return NextResponse.json({ data: cached });
      }
      let page = 1;
      while (true) {
        const res = await fetch(
          `https://developer.bling.com.br/api/bling/produtos?pagina=${page}&limite=100&criterio=1&tipo=T&idCategoria=${idCategoria}&nome=%20`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
            },
            cache: "no-store",
          }
        );
        if (!res.ok) {
          const errText = await res.text();
          console.error(
            "[Bling Products] Erro na resposta:",
            res.status,
            errText
          );
          return NextResponse.json(
            { error: `Erro Bling: ${res.status}`, details: errText },
            { status: res.status }
          );
        }
        const json = await res.json();
        const arr = Array.isArray(json.data) ? json.data : [];
        if (arr.length === 0) break;
        produtosTemp = produtosTemp.concat(arr);
        if (arr.length < 100) break;
        page++;
      }
      if (process.env.VERCEL || process.env.NODE_ENV === "production") {
        await kvSet(cacheKey, produtosTemp);
      } else {
        const fs = require("fs");
        const path = `./produtos_categoria_${idCategoria}.json`;
        fs.writeFileSync(path, JSON.stringify(produtosTemp, null, 2));
      }
      return NextResponse.json({ data: produtosTemp });
    }

    // Se não veio idCategoria, busca todos os produtos
    let produtosTemp = [];
    let cacheKey = `bling_produtos_todos`;
    let cached;
    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      cached = await kvGet(cacheKey);
    } else {
      const fs = require("fs");
      const path = `./produtos_todos.json`;
      if (fs.existsSync(path)) {
        cached = JSON.parse(fs.readFileSync(path, "utf-8"));
      }
    }
    if (cached && Array.isArray(cached)) {
      return NextResponse.json({ data: cached });
    }
    let page = 1;
    while (true) {
      const res = await fetch(
        `https://developer.bling.com.br/api/bling/produtos?pagina=${page}&limite=100&criterio=1&tipo=T&nome=%20`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );
      if (!res.ok) {
        const errText = await res.text();
        console.error(
          "[Bling Products] Erro na resposta:",
          res.status,
          errText
        );
        return NextResponse.json(
          { error: `Erro Bling: ${res.status}`, details: errText },
          { status: res.status }
        );
      }
      const json = await res.json();
      const arr = Array.isArray(json.data) ? json.data : [];
      if (arr.length === 0) break;
      produtosTemp = produtosTemp.concat(arr);
      if (arr.length < 100) break;
      page++;
    }
    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      await kvSet(cacheKey, produtosTemp);
    } else {
      const fs = require("fs");
      const path = `./produtos_todos.json`;
      fs.writeFileSync(path, JSON.stringify(produtosTemp, null, 2));
    }
    return NextResponse.json({ data: produtosTemp });
  } catch (e) {
    console.error("[Bling Products] Erro inesperado:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
