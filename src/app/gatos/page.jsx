"use client";

import Header from "@/components/Header/header";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./gatos.module.css";

const banners = [
  "/image/banner1.png",
  "/image/banner2.png",
  "/image/banner3.png",
];
function getRandomBanner() {
  return banners[Math.floor(Math.random() * banners.length)];
}

const categoriasLabels = {
  racao: "Ração para Gatos",
  umida: "Ração Úmida para Gatos",
  snak: "Snak para Gatos",
  todas: "Todas",
};

export default function GatosPage() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todas");
  const [pagina, setPagina] = useState(1);
  const produtosPorPagina = 9;
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetch("/mocks/produtos.json")
      .then((res) => res.json())
      .then((data) => {
        let filtrados = [];
        if (Array.isArray(data)) {
          if (filtro === "todas") {
            filtrados = data.filter(
              (p) => p.categoria && p.categoria.includes("Gatos")
            );
          } else if (filtro === "racao") {
            filtrados = data.filter((p) => p.categoria === "Ração para Gatos");
          } else if (filtro === "umida") {
            filtrados = data.filter(
              (p) =>
                p.categoria &&
                p.categoria.toLowerCase().includes("úmida") &&
                p.categoria.includes("Gatos")
            );
            if (filtrados.length === 0) {
              filtrados = data.filter(
                (p) =>
                  p.categoria === "Ração para Gatos" &&
                  p.nome.toLowerCase().includes("úmida")
              );
            }
          } else if (filtro === "snak") {
            filtrados = data.filter(
              (p) =>
                p.categoria &&
                p.categoria.toLowerCase().includes("snak") &&
                p.categoria.includes("Gatos")
            );
            if (filtrados.length === 0) {
              filtrados = data.filter(
                (p) =>
                  p.categoria === "Ração para Gatos" &&
                  p.nome.toLowerCase().includes("snak")
              );
            }
          }
        }
        setProdutos(filtrados);
      })
      .catch(() => setProdutos([]))
      .finally(() => setLoading(false));
  }, [filtro]);

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
        <aside className={styles.filtrosAside}>
          <div style={{ width: "100%", textAlign: "center", margin: " 0 0 " }}>
            <a
              href="/"
              style={{
                color: "#0099ff",
                textDecoration: "underline",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              ← Home
            </a>
          </div>
          <button
            className={`${styles.filtroBtn} ${
              filtro === "racao" ? styles.filtroBtnAtivo : ""
            }`}
            onClick={() => setFiltro("racao")}
          >
            Ração
          </button>
          <button
            className={`${styles.filtroBtn} ${
              filtro === "umida" ? styles.filtroBtnAtivo : ""
            }`}
            onClick={() => setFiltro("umida")}
          >
            Ração úmida
          </button>
          <button
            className={`${styles.filtroBtn} ${
              filtro === "snak" ? styles.filtroBtnAtivo : ""
            }`}
            onClick={() => setFiltro("snak")}
          >
            Snak
          </button>
          <button
            className={`${styles.filtroBtn} ${
              filtro === "todas" ? styles.filtroBtnAtivo : ""
            }`}
            onClick={() => setFiltro("todas")}
          >
            Todas
          </button>
        </aside>
        <div className={styles.produtosArea}>
          <h2 className={styles.titulo}>Produtos para Gatos</h2>
          {loading ? (
            <p>Carregando produtos...</p>
          ) : produtos.length === 0 ? (
            <p>Nenhum produto encontrado.</p>
          ) : (
            <>
              <ul className={styles.grid}>
                {produtos.slice(0, pagina * produtosPorPagina).map((p, idx) => {
                  const imgSrc = p.imagem_url || "/mocks/produtos.png";
                  const precoFormatado = p.preco
                    ? `R$ ${Number(p.preco).toFixed(2).replace(".", ",")}`
                    : "Preço indisponível";
                  return (
                    <li
                      key={p.id || idx}
                      className={styles.card}
                      style={{ cursor: "pointer" }}
                      onClick={() => p.id && router.push(`/produto/${p.id}`)}
                    >
                      <img
                        src={imgSrc}
                        alt={p.nome}
                        className={styles.produtoImg}
                        loading="lazy"
                      />
                      <span className={styles.nome}>{p.nome}</span>
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
      </div>
    </>
  );
}
