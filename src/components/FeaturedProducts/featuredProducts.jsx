"use client";
import styles from "./featuredProducts.module.css";

export default function FeaturedProducts({ produtos = [], loading, error }) {
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
