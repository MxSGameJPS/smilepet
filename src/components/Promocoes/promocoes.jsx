"use client";
import styles from "./promocoes.module.css";
import Image from "next/image";

export default function Promocoes({ produtos = [], loading, error }) {
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
