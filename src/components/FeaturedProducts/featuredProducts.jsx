"use client";
import styles from "./featuredProducts.module.css";
import { useEffect, useState } from "react";
import { getProdutosCache } from "@/lib/produtosCache";
import { useRouter } from "next/navigation";

export default function FeaturedProducts({ loading, error }) {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    async function fetchProdutos() {
      const produtos = await getProdutosCache();
      setProdutos(produtos);
    }
    fetchProdutos();
  }, []);

  const router = useRouter();
  return (
    <section className={styles.featuredSection}>
      <h2 className={styles.title}>Destaques para seu Pet</h2>
      {loading && <p>Carregando produtos...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && produtos.length === 0 && (
        <p className={styles.error}>Nenhum produto encontrado.</p>
      )}
      <div className={styles.productsGrid}>
        {produtos.slice(0, 4).map((prod, i) => {
          const nome =
            prod.nome || prod.descricao || prod.codigo || prod.id || "Produto";
          let preco = prod.preco || prod.precoVenda || prod.valor || "-";
          if (preco !== "-") {
            const num = Number(preco);
            preco = isNaN(num) ? preco : num.toFixed(2).replace(".", ",");
          }
          // Usa imagem do produto ou um placeholder
          const img =
            prod.imagem_url && prod.imagem_url.length > 0
              ? prod.imagem_url
              : "/mocks/produtos.png";
          return (
            <div
              className={styles.productCard}
              key={prod.id || i}
              style={{ cursor: "pointer" }}
              onClick={() => prod.id && router.push(`/produto/${prod.id}`)}
            >
              <img src={img} alt={nome} className={styles.productImg} />
              <div className={styles.productInfo}>
                <span className={styles.productName}>{nome}</span>
                <span className={styles.productPrice}>R$ {preco}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
