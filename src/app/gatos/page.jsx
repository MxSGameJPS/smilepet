"use client";

import Header from "@/components/Header/header";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./gatos.module.css";

const banners = [
  "/image/banner1.png",
  "/image/banner2.png",
  "/image/banner3.png",
];
function getRandomBanner() {
  return banners[Math.floor(Math.random() * banners.length)];
}

const categoriasGato = {
  racao: [10958635],
  umida: [11974560],
  snak: [11977784],
  todas: [10958635, 11974560, 11977784],
};
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

  async function fetchProdutosPorFiltro(tipo, force = false) {
    setLoading(true);
    setPagina(1);
    const ids = categoriasGato[tipo];
    try {
      const cacheKey = `gatosCache_${tipo}`;
      const cacheTimeKey = `gatosCacheTime_${tipo}`;
      const cache = localStorage.getItem(cacheKey);
      const cacheTime = localStorage.getItem(cacheTimeKey);
      const now = Date.now();
      let produtosUnicos;
      let cacheArray = [];
      if (cache) {
        try {
          cacheArray = JSON.parse(cache);
        } catch {
          cacheArray = [];
        }
      }
      if (
        cache &&
        cacheTime &&
        !force &&
        now - Number(cacheTime) < 3600000 &&
        Array.isArray(cacheArray) &&
        cacheArray.length > 0
      ) {
        produtosUnicos = cacheArray;
      } else {
        const resultados = await Promise.all(
          ids.map(async (id) => {
            const res = await fetch(
              `/api/bling/products-category?idCategoria=${id}`
            );
            const data = await res.json();
            return Array.isArray(data?.data) ? data.data : [];
          })
        );
        const todosProdutos = resultados.flat();
        const produtosPai = todosProdutos.filter((prod) => !prod.idProdutoPai);
        console.log(
          `[GATOS] Quantidade de produtos encontrados na API: ${produtosPai.length}`
        );
        produtosUnicos = Object.values(
          produtosPai.reduce((acc, prod) => {
            acc[prod.id] = prod;
            return acc;
          }, {})
        );
        localStorage.setItem(cacheKey, JSON.stringify(produtosUnicos));
        localStorage.setItem(cacheTimeKey, String(now));
      }
      setProdutos(produtosUnicos);
    } catch (e) {
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  }

  async function carregarImagensPorPagina(produtosBase, paginaAtual) {
    const produtosPorPagina = 9;
    const inicio = 0;
    const fim = paginaAtual * produtosPorPagina;
    const produtosVisiveis = produtosBase.slice(inicio, fim);
    const produtosComImagem = [];
    for (let i = 0; i < produtosVisiveis.length; i++) {
      if (i > 0 && i % 3 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      try {
        const res = await fetch(
          `/api/bling/products/${produtosVisiveis[i].id}`
        );
        const data = await res.json();
        const imgOriginal =
          data?.imagemOriginal ||
          data?.data?.midia?.imagens?.internas?.[0]?.link;
        produtosComImagem.push({
          ...produtosVisiveis[i],
          imagemURL: imgOriginal || produtosVisiveis[i].imagemURL,
        });
      } catch {
        produtosComImagem.push(produtosVisiveis[i]);
      }
    }
    return [...produtosComImagem, ...produtosBase.slice(fim)];
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchProdutosPorFiltro(filtro);
      const cacheKey = `gatosCache_${filtro}`;
      const cache = localStorage.getItem(cacheKey);
      let produtosBase = produtos;
      if (cache) {
        produtosBase = JSON.parse(cache);
      }
      const produtosComImagem = await carregarImagensPorPagina(produtosBase, 1);
      setProdutos(produtosComImagem);
      setLoading(false);
    })();
    const interval = setInterval(async () => {
      setLoading(true);
      await fetchProdutosPorFiltro(filtro, true);
      const cacheKey = `gatosCache_${filtro}`;
      const cache = localStorage.getItem(cacheKey);
      let produtosBase = produtos;
      if (cache) {
        produtosBase = JSON.parse(cache);
      }
      const produtosComImagem = await carregarImagensPorPagina(produtosBase, 1);
      setProdutos(produtosComImagem);
      setLoading(false);
    }, 3600000);
    return () => clearInterval(interval);
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
                  const imgSrc =
                    p.imagemURL || "/image/produto-indisponivel.png";
                  const precoFormatado = p.preco
                    ? `R$ ${Number(p.preco).toFixed(2).replace(".", ",")}`
                    : "Preço indisponível";
                  return (
                    <li key={p.id} className={styles.card}>
                      <img
                        src={imgSrc}
                        alt={p.nome}
                        className={styles.produtoImg}
                        loading="lazy"
                      />
                      <span className={styles.nome}>{p.nome}</span>
                      <span className={styles.marca}>{p.marca}</span>
                      <span className={styles.preco}>{precoFormatado}</span>
                    </li>
                  );
                })}
              </ul>
              {produtos.length > pagina * produtosPorPagina && (
                <button
                  className={styles.verMaisBtn}
                  onClick={async () => {
                    setLoading(true);
                    const novaPagina = pagina + 1;
                    const produtosAtualizados = await carregarImagensPorPagina(
                      produtos,
                      novaPagina
                    );
                    setProdutos(produtosAtualizados);
                    setPagina(novaPagina);
                    setLoading(false);
                  }}
                  style={{ margin: "32px auto", display: "block" }}
                >
                  Ver mais
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
