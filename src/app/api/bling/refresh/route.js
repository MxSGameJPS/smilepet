// src/app/api/bling/refresh/route.js
import { NextResponse } from "next/server";

// Utilitário para ler e salvar o token localmente (apenas em dev)
const fs = typeof require !== "undefined" ? require("fs") : null;
const path = "./bling_token.json";
import { kvGet, kvSet } from "@/lib/vercelKv";

async function getRefreshToken() {
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return await kvGet("bling_refresh_token");
  }
  try {
    if (!fs.existsSync(path)) return null;
    const data = JSON.parse(fs.readFileSync(path, "utf-8"));
    return data.refresh_token;
  } catch (e) {
    return null;
  }
}

async function saveToken({ access_token, refresh_token }) {
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    // Em produção, salva no Vercel KV
    await kvSet("bling_access_token", access_token);
    await kvSet("bling_refresh_token", refresh_token);
    return;
  }
  fs.writeFileSync(
    path,
    JSON.stringify(
      {
        access_token,
        refresh_token,
        created_at: Date.now(),
      },
      null,
      2
    )
  );
}

export async function POST() {
  const client_id = process.env.BLING_CLIENT_ID;
  const client_secret = process.env.BLING_CLIENT_SECRET;
  const refresh_token = await getRefreshToken();
  const basicAuth = Buffer.from(`${client_id}:${client_secret}`).toString(
    "base64"
  );

  if (!refresh_token) {
    return NextResponse.json(
      { error: "Refresh token não encontrado." },
      { status: 401 }
    );
  }

  try {
    const res = await fetch("https://www.bling.com.br/Api/v3/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token,
      }),
    });
    const data = await res.json();
    if (data.access_token) {
      await saveToken({
        access_token: data.access_token,
        refresh_token: data.refresh_token || refresh_token,
      });
      return NextResponse.json({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });
    } else {
      // ALERTA: log detalhado do erro de renovação
      console.error("[Bling Refresh] Falha ao renovar token:", {
        status: res.status,
        response: data,
        sent_refresh_token: refresh_token,
        client_id,
      });
      return NextResponse.json({ error: data }, { status: 400 });
    }
  } catch (e) {
    // ALERTA: log de erro inesperado
    console.error("[Bling Refresh] Erro inesperado:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
