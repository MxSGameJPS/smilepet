// src/app/api/bling/auth/route.js
import { getBlingAuthUrl } from "@/lib/blingAuth";

export async function GET(req) {
  // Redireciona o usuário para a URL de autorização do Bling
  const url = getBlingAuthUrl();
  return Response.redirect(url, 302);
}
