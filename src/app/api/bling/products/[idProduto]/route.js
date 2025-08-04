import { NextResponse } from "next/server";

// Função utilitária para obter o access_token salvo (igual ao route.js principal)
async function getAccessToken() {
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    const { kvGet } = await import("@/lib/vercelKv");
    return await kvGet("bling_access_token");
  }
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

export async function GET(request, { params }) {
  const awaitedParams = await params;
  const idProduto = awaitedParams.idProduto;
  if (!idProduto) {
    return NextResponse.json(
      { error: "idProduto não informado" },
      { status: 400 }
    );
  }
  let accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: "Token não encontrado" },
      { status: 401 }
    );
  }
  try {
    const url = `https://developer.bling.com.br/api/bling/produtos/${idProduto}`;
    let res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `Erro Bling: ${res.status}`, details: errText },
        { status: res.status }
      );
    }
    const json = await res.json();
    // O campo correto é json.data.midia.imagens.internas[0].link
    const produto = json?.data || {};
    const imagemOriginal = produto?.midia?.imagens?.internas?.[0]?.link || null;
    return NextResponse.json({ data: produto, imagemOriginal });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
