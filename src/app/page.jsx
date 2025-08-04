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
    fetch("/api/bling/products")
      .then((res) => res.json())
      .then((data) => {
        let arr = [];
        if (Array.isArray(data.data)) arr = data.data;
        else if (Array.isArray(data.retorno)) arr = data.retorno;
        else if (Array.isArray(data.retorno?.produtos))
          arr = data.retorno.produtos;
        else if (Array.isArray(data.produtos)) arr = data.produtos;
        setProdutos(arr.filter((p) => p && p.id));
      })
      .catch(() => setError("Erro ao buscar produtos."))
      .finally(() => setLoading(false));
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
