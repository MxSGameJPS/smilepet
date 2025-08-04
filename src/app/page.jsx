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
        if (cache && cacheTime && !force && now - Number(cacheTime) < 3600000) {
          setProdutos(JSON.parse(cache));
          setLoading(false);
          return;
        }
        const res = await fetch("/api/bling/products");
        const data = await res.json();
        const produtos = Array.isArray(data?.data) ? data.data : [];
        // Filtra apenas produtos pai (sem idProdutoPai)
        const produtosPai = produtos.filter((prod) => !prod.idProdutoPai);
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
        localStorage.setItem(
          "produtosCache",
          JSON.stringify(produtosComImagem)
        );
        localStorage.setItem("produtosCacheTime", String(now));
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
