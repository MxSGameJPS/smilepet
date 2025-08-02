"use client";
import { useEffect, useState } from "react";
import styles from "./featuredProducts.module.css";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/bling/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else {
          // Aceita data como array ou objeto
          let arr = Array.isArray(data.data) ? data.data : [];
          // Se vier objeto, tenta pegar produtos
          if (!arr.length && Array.isArray(data.retorno?.produtos)) {
            arr = data.retorno.produtos;
          }
          setProducts(arr.filter((p) => p && p.id));
        }
      })
      .catch((err) => setError("Erro ao buscar produtos."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className={styles.featuredSection}>
      <h2 className={styles.title}>Destaques para seu Pet</h2>
      {loading && <p>Carregando produtos...</p>}
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.productsGrid}>
        {products.slice(0, 4).map((prod, i) => {
          // Ajuste conforme estrutura real do retorno da API do Bling
          const nome =
            prod.nome || prod.descricao || prod.codigo || prod.id || "Produto";
          let preco = prod.preco || prod.precoVenda || prod.valor || "-";
          if (preco !== "-") {
            const num = Number(preco);
            preco = isNaN(num) ? preco : num.toFixed(2).replace(".", ",");
          }
          const img = prod.imagemURL || "/logo.jpeg";
          return (
            <div className={styles.productCard} key={prod.id || i}>
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
