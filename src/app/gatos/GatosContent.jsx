"use client";
import Header from "@/components/Header/header";
import Image from "next/image";
import FiltroProdutos from "@/components/FiltroProdutos/FiltroProdutos";
import styles from "./gatos.module.css";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const banners = [
  "/image/banner1.png",
  "/image/banner2.png",
  "/image/banner3.png",
];
function getRandomBanner() {
  return banners[Math.floor(Math.random() * banners.length)];
}

export default function GatosContent() {
  const searchParams = useSearchParams();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todas");
  const [marcaSelecionada, setMarcaSelecionada] = useState("");
  const [pagina, setPagina] = useState(1);
  const produtosPorPagina = 9;
  const router = useRouter();

  useEffect(() => {
    const categoriaParam = searchParams.get("categoria");
    const marcaParam = searchParams.get("marca");
    setFiltro(categoriaParam || "todas");
    setMarcaSelecionada(marcaParam || "");
    setLoading(true);
    fetch("https://apismilepet.vercel.app/api/produtos")
      .then((res) => res.json())
      .then((data) => {
        let filtrados = [];
        const produtosApi = Array.isArray(data.data) ? data.data : [];
        // Filtra por categoria (suporta múltiplas)
        let categoriasSelecionadas = [];
        if (categoriaParam && categoriaParam !== "todas") {
          categoriasSelecionadas = categoriaParam.split(",");
        }
        if (!categoriaParam || categoriaParam === "todas") {
          filtrados = produtosApi.filter(
            (p) => p.categoria && p.categoria.includes("Gatos")
          );
        } else {
          filtrados = produtosApi.filter((p) =>
            categoriasSelecionadas.includes(p.categoria)
          );
        }
        // Filtra por marca (suporta múltiplas)
        let marcasSelecionadas = [];
        if (marcaParam) {
          marcasSelecionadas = marcaParam.split(",");
          filtrados = filtrados.filter((p) =>
            marcasSelecionadas.includes(p.marca)
          );
        }
        setProdutos(filtrados);
      })
      .catch(() => setProdutos([]))
      .finally(() => setLoading(false));
  }, [searchParams]);

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
          <FiltroProdutos />
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
