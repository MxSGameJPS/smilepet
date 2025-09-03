// Utilitário para cache global de produtos
export async function getProdutosCache(force = false) {
  const cache = localStorage.getItem("produtosCache");
  const cacheTime = localStorage.getItem("produtosCacheTime");
  const now = Date.now();
  let produtos = [];
  let cacheArray = [];
  if (cache) {
    try {
      cacheArray = JSON.parse(cache);
    } catch {
      cacheArray = [];
    }
  }
  if (
    cache &&
    cacheTime &&
    !force &&
    now - Number(cacheTime) < 3600000 &&
    Array.isArray(cacheArray) &&
    cacheArray.length > 0
  ) {
    return cacheArray;
  } else {
    try {
      const res = await fetch("https://apismilepet.vercel.app/api/produtos");
      const data = await res.json();
      produtos = Array.isArray(data.data) ? data.data : [];
      localStorage.setItem("produtosCache", JSON.stringify(produtos));
      localStorage.setItem("produtosCacheTime", String(now));
      return produtos;
    } catch {
      return [];
    }
  }
}
