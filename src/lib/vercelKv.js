// src/lib/vercelKv.js
// Utilitário para acessar o Upstash Redis usando ioredis

import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export async function kvGet(key) {
  return await redis.get(key);
}

export async function kvSet(key, value) {
  // Salva como string (caso value seja objeto, converta antes de usar)
  if (typeof value === "object") {
    value = JSON.stringify(value);
  }
  return await redis.set(key, value);
}
