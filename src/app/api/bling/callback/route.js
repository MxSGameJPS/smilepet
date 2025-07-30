// src/app/api/bling/callback/route.js

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) {
    return new Response("Code não encontrado na URL", { status: 400 });
  }

  // Troca o code pelo access_token
  const client_id = process.env.BLING_CLIENT_ID;
  const client_secret = process.env.BLING_CLIENT_SECRET;
  const redirect_uri = process.env.BLING_REDIRECT_URI;

  // Monta o header Authorization: Basic base64(client_id:client_secret)
  const basicAuth = Buffer.from(`${client_id}:${client_secret}`).toString(
    "base64"
  );

  try {
    const tokenRes = await fetch(
      "https://www.bling.com.br/Api/v3/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basicAuth}`,
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri,
        }),
      }
    );
    const tokenData = await tokenRes.json();
    if (tokenData.access_token) {
      // Salva o access_token em um arquivo local (bling_token.json)
      const fs = require("fs");
      const path = "./bling_token.json";
      fs.writeFileSync(
        path,
        JSON.stringify(
          {
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token || null,
            created_at: Date.now(),
          },
          null,
          2
        )
      );

      return new Response(
        `Access Token salvo em bling_token.json!\nAccess Token: ${
          tokenData.access_token
        }\nRefresh Token: ${tokenData.refresh_token || "-"}`,
        { status: 200 }
      );
    } else {
      return new Response(`Erro ao obter token: ${JSON.stringify(tokenData)}`, {
        status: 400,
      });
    }
  } catch (err) {
    return new Response(`Erro na requisição: ${err.message}`, { status: 500 });
  }
}

export async function POST(req) {
  console.log("POST /api/bling/callback chamada");
  return new Response("Callback POST recebido", { status: 200 });
}
