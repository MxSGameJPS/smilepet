"use client";
import Header from "@/components/Header/header";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./caes.module.css";

const banners = [
  "/image/banner1.png",
  "/image/banner2.png",
  "/image/banner3.png",
];

function getRandomBanner() {
  return banners[Math.floor(Math.random() * banners.length)];
}

export default function CaesPage() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const res = await fetch("/api/bling/products?idCategoria=10908028");
        const data = await res.json();
        setProdutos(data?.data || []);
      } catch (e) {
        setProdutos([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProdutos();
  }, []);

  return (
    <>
      <Header />
      <section
        style={{
          width: "100%",
          height: 320,
          position: "relative",
        }}
      >
        <Image
          src={getRandomBanner()}
          alt="Banner Hero"
          fill
          style={{ objectFit: "cover" }}
        />
      </section>
      <div className={styles.container}>
        <h2 className={styles.titulo}>Ração para Cães</h2>
        {loading ? (
          <p>Carregando produtos...</p>
        ) : produtos.length === 0 ? (
          <p>Nenhum produto encontrado.</p>
        ) : (
          <ul className={styles.grid}>
            {produtos
              .filter((p) => !!p.imagemURL)
              .map((p) => {
                const imgSrc = p.imagemURL;
                const precoFormatado = p.preco
                  ? `R$ ${Number(p.preco).toFixed(2).replace(".", ",")}`
                  : "Preço indisponível";
                return (
                  <li key={p.id} className={styles.card}>
                    <Image
                      src={imgSrc}
                      alt={p.nome}
                      width={120}
                      height={120}
                      className={styles.produtoImg}
                    />
                    <span className={styles.nome}>{p.nome}</span>
                    <span className={styles.marca}>{p.marca}</span>
                    <span className={styles.preco}>{precoFormatado}</span>
                  </li>
                );
              })}
          </ul>
        )}
      </div>
    </>
  );
}
