"use client";
import styles from "./promocoes.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Promocoes() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/bling/products?limit=6")
      .then((res) => res.json())
      .then((data) => {
        let arr = [];
        if (Array.isArray(data.data)) arr = data.data;
        else if (Array.isArray(data.retorno)) arr = data.retorno;
        else if (Array.isArray(data.retorno?.produtos))
          arr = data.retorno.produtos;
        else if (Array.isArray(data.produtos)) arr = data.produtos;
        setProdutos(arr.filter((p) => p && p.id));
        setLoading(false);
      })
      .catch(() => {
        setError("Erro ao carregar promoções");
        setLoading(false);
      });
  }, []);

  return (
    <section className={styles.promocoesSection}>
      <h2 className={styles.promocoesTitle}>Promoções</h2>
      {loading && <p>Carregando promoções...</p>}
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.promocoesGrid}>
        {produtos.slice(0, 6).map((prod, i) => {
          const nome =
            prod.nome || prod.descricao || prod.codigo || prod.id || "Produto";
          let preco = prod.preco || prod.precoVenda || prod.valor || "-";
          if (preco !== "-") {
            const num = Number(preco);
            preco = isNaN(num) ? preco : num.toFixed(2);
          }
          const img =
            prod.imagemURL ||
            prod.imagem ||
            prod.imagemThumbnail ||
            "/logo.jpeg";
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
