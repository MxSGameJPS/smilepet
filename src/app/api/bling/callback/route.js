// src/app/api/bling/callback/route.js

export async function GET(req) {
  console.log("GET /api/bling/callback chamada");
  return new Response("Callback GET recebido", { status: 200 });
}

export async function POST(req) {
  console.log("POST /api/bling/callback chamada");
  return new Response("Callback POST recebido", { status: 200 });
}
