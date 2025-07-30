// src/lib/blingAuth.js

const CLIENT_ID = process.env.BLING_CLIENT_ID;
const REDIRECT_URI = process.env.BLING_REDIRECT_URI;
const AUTH_URL = "https://www.bling.com.br/Api/v3/oauth/authorize";

/**
 * Gera a URL de autorização OAuth 2.0 do Bling
 * @returns {string} URL para redirecionar o usuário
 */
export function getBlingAuthUrl() {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: "produtos", // ajuste o escopo conforme necessário
    state: "smilepet", // pode ser um valor dinâmico para segurança
  });
  return `${AUTH_URL}?${params.toString()}`;
}
