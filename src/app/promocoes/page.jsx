"use client";

import Header from "@/components/Header/header";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./promocoes.module.css";

const banners = [
  "/image/banner1.png",
  "/image/banner2.png",
  "/image/banner3.png",
];
function getRandomBanner() {
  return banners[Math.floor(Math.random() * banners.length)];
}

export default function PromocoesPage() {
  const router = useRouter();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);
  const produtosPorPagina = 9;

  useEffect(() => {
    setLoading(true);
    fetch("/mocks/produtos.json")
      .then((res) => res.json())
      .then((data) => {
        const filtrados = Array.isArray(data)
          ? data.filter((p) => p.promocao === true)
          : [];
        setProdutos(filtrados);
      })
      .catch(() => setProdutos([]))
      .finally(() => setLoading(false));
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
      <div className={`${styles.container} ${styles.flexContainer}`}>
        <h2 className={styles.titulo}>Produtos em Promoção</h2>
        {loading ? (
          <p>Carregando produtos...</p>
        ) : produtos.length === 0 ? (
          <p>Nenhum produto em promoção encontrado.</p>
        ) : (
          <>
            <ul className={styles.grid}>
              {produtos
                .slice(0, pagina * produtosPorPagina)
                .map((produto, idx) => {
                  const imgSrc = produto.imagem_url || "/mocks/produtos.png";
                  const precoFormatado = produto.preco
                    ? `R$ ${Number(produto.preco).toFixed(2).replace(".", ",")}`
                    : "Preço indisponível";
                  return (
                    <li
                      key={produto.id || idx}
                      className={styles.card}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        produto.id && router.push(`/produto/${produto.id}`)
                      }
                    >
                      <img
                        src={imgSrc}
                        alt={produto.nome}
                        className={styles.produtoImg}
                        loading="lazy"
                      />
                      <span className={styles.nome}>{produto.nome}</span>
                      <span className={styles.preco}>{precoFormatado}</span>
                    </li>
                  );
                })}
            </ul>
            {produtos.length > pagina * produtosPorPagina ? (
              <button
                className={styles.verMaisBtn}
                onClick={() => setPagina((p) => p + 1)}
                style={{ margin: "32px auto", display: "block" }}
              >
                Ver mais
              </button>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  margin: "32px auto",
                  color: "#888",
                }}
              >
                <span>Você chegou ao fim da lista de produtos.</span>
              </div>
            )}
          </>
        )}
      </div>
      <footer className={styles.footer}>
        <span>Smile Pet &copy; {new Date().getFullYear()}</span>
      </footer>
    </>
  );
}
