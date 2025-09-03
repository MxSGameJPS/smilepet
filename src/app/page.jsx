"use client";
import Header from "../components/Header/header";
import Hero from "../components/Hero/hero";
import FeaturedProducts from "../components/FeaturedProducts/featuredProducts";
import PlanoAssinatura from "../components/PlanoAssinatura/planoAssinatura";
import Promocoes from "../components/Promocoes/promocoes";
import Footer from "../components/Footer/footer";
import SplashVideo from "../components/SplashVideo";
import { getProdutosCache } from "../lib/produtosCache";
import { useEffect, useState } from "react";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function fetchProdutos(force = false) {
      setLoading(true);
      const produtos = await getProdutosCache(force);
      setProdutos(produtos);
      setLoading(false);
    }
    fetchProdutos();
    const interval = setInterval(() => fetchProdutos(true), 3600000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashVideo duration={7000} />;
  }

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
