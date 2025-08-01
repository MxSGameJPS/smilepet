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

  // Se veio idCategoria, busca direto por ele
  if (idCategoria) {
    const fs = require("fs");
    const path = `./produtos_categoria_${idCategoria}.json`;
    if (fs.existsSync(path)) {
      const cached = JSON.parse(fs.readFileSync(path, "utf-8"));
      return NextResponse.json({ data: cached });
    }
    let page = 1;
    let produtosTemp = [];
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
        console.log("Erro na resposta da API Bling:", res.status);
        break;
      }
      const json = await res.json();
      const arr = Array.isArray(json.data) ? json.data : [];
      console.log("Produtos extraídos:", arr);
      if (arr.length === 0) break;
      produtosTemp = produtosTemp.concat(arr);
      if (arr.length < 100) break;
      page++;
    }
    fs.writeFileSync(path, JSON.stringify(produtosTemp, null, 2));
    return NextResponse.json({ data: produtosTemp });
  }
  // ...existing code...

  // Se não veio categoria, retorna erro
  return NextResponse.json({ error: "Categoria obrigatória" }, { status: 400 });
}
