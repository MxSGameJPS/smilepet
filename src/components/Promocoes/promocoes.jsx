"use client";
import styles from "./promocoes.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Promocoes({ loading, error }) {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    async function fetchPromocoes() {
      try {
        const res = await fetch("https://apismilepet.vercel.app/api/produtos");
        if (!res.ok) throw new Error("Erro ao buscar produtos");
        const json = await res.json();
        console.log("Retorno da API:", json);
        const produtosArray = Array.isArray(json.data) ? json.data : [];
        // Filtra apenas produtos em promoção
        const promocoes = produtosArray.filter((p) => p.promocao === true);
        setProdutos(promocoes);
      } catch {
        setProdutos([]);
      }
    }
    fetchPromocoes();
  }, []);

  return (
    <section className={styles.promocoesSection}>
      <h2 className={styles.promocoesTitle}>Promoções</h2>
      {loading && <p>Carregando promoções...</p>}
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.promocoesGrid}>
        {produtos.slice(0, 8).map((prod, i) => {
          const nome =
            prod.nome || prod.descricao || prod.codigo || prod.id || "Produto";
          let preco = prod.preco || prod.precoVenda || prod.valor || "-";
          if (preco !== "-") {
            const num = Number(preco);
            preco = isNaN(num) ? preco : num.toFixed(2).replace(".", ",");
          }
          const img =
            prod.imagem_url && prod.imagem_url.length > 0
              ? prod.imagem_url
              : "/mocks/produtos.png";
          return (
            <div className={styles.promocaoCard} key={prod.id || i}>
              <Image
                src={img}
                alt={nome}
                width={90}
                height={90}
                className={styles.promocaoImg}
              />
              <div className={styles.promocaoNome}>{nome}</div>
              <div className={styles.promocaoPreco}>R$ {preco}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
