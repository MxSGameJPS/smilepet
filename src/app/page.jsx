"use client";
import Header from "../components/Header/header";
import Hero from "../components/Hero/hero";
import FeaturedProducts from "../components/FeaturedProducts/featuredProducts";
import PlanoAssinatura from "../components/PlanoAssinatura/planoAssinatura";
import Promocoes from "../components/Promocoes/promocoes";
import Footer from "../components/Footer/footer";
import { useEffect, useState } from "react";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProdutos(force = false) {
      setLoading(true);
      try {
        const cache = localStorage.getItem("produtosCache");
        const cacheTime = localStorage.getItem("produtosCacheTime");
        const now = Date.now();
        let produtosPai = [];
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
          console.log("[HOME] Usando cache localStorage");
          produtosPai = cacheArray;
        } else {
          console.log("[HOME] Buscando produtos da API /api/bling/products");
          const res = await fetch("/api/bling/products");
          const data = await res.json();
          const produtos = Array.isArray(data?.data) ? data.data : [];
          produtosPai = produtos.filter((prod) => !prod.idProdutoPai);
          console.log(
            `[HOME] Quantidade de produtos encontrados na API: ${produtosPai.length}`
          );
          localStorage.setItem("produtosCache", JSON.stringify(produtosPai));
          localStorage.setItem("produtosCacheTime", String(now));
        }
        setProdutos(produtosPai);
        // Após atualizar o estado, carrega as imagens detalhadas dos produtos
        if (produtosPai.length > 0) {
          const produtosComImagem = await Promise.all(
            produtosPai.map(async (prod) => {
              try {
                const res = await fetch(`/api/bling/products/${prod.id}`);
                const data = await res.json();
                const imgOriginal =
                  data?.imagemOriginal ||
                  data?.data?.midia?.imagens?.internas?.[0]?.link;
                return { ...prod, imagemURL: imgOriginal || prod.imagemURL };
              } catch {
                return prod;
              }
            })
          );
          setProdutos(produtosComImagem);
        }
      } catch (e) {
        setProdutos([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProdutos();
    const interval = setInterval(() => fetchProdutos(true), 3600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Header />
      <Hero />
      <FeaturedProducts produtos={produtos} loading={loading} error={error} />
      <PlanoAssinatura />
      <Promocoes produtos={produtos} loading={loading} error={error} />
      <Footer />
    </div>
  );
}
