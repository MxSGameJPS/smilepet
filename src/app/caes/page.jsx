"use client";
import Header from "@/components/Header/header";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./caes.module.css";

const banners = [
  "/image/banner1.png",
  "/image/banner2.png",
  "/image/banner3.png",
];

function getRandomBanner() {
  return banners[Math.floor(Math.random() * banners.length)];
}

export default function CaesPage() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todas");
  const [pagina, setPagina] = useState(1);
  const produtosPorPagina = 9;

  // IDs das categorias de cães: principal + subcategorias
  const categoriasCao = {
    todas: [10908028, 11977575, 11977846],
    racoes: [10908028],
    umida: [11977846],
    snaks: [11977575],
  };

  async function fetchProdutosPorFiltro(tipo, force = false) {
    setLoading(true);
    setPagina(1);
    const ids = categoriasCao[tipo];
    try {
      const cacheKey = `caesCache_${tipo}`;
      const cacheTimeKey = `caesCacheTime_${tipo}`;
      const cache = localStorage.getItem(cacheKey);
      const cacheTime = localStorage.getItem(cacheTimeKey);
      const now = Date.now();
      let produtosUnicos;
      if (cache && cacheTime && !force && now - Number(cacheTime) < 3600000) {
        produtosUnicos = JSON.parse(cache);
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
        // Junta todos os produtos e remove duplicados por id
        const todosProdutos = resultados.flat();
        // Filtra apenas produtos pai (sem idProdutoPai)
        const produtosPai = todosProdutos.filter((prod) => !prod.idProdutoPai);
        produtosUnicos = Object.values(
          produtosPai.reduce((acc, prod) => {
            acc[prod.id] = prod;
            return acc;
          }, {})
        );
        localStorage.setItem(cacheKey, JSON.stringify(produtosUnicos));
        localStorage.setItem(cacheTimeKey, String(now));
      }
      // Ao trocar o filtro, só carrega os dados básicos dos produtos
      setProdutos(produtosUnicos);
    } catch (e) {
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  }

  // Função para carregar imagens detalhadas apenas dos produtos visíveis
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
    // Mantém os produtos restantes sem imagem detalhada
    return [...produtosComImagem, ...produtosBase.slice(fim)];
  }
  useEffect(() => {
    fetchProdutosPorFiltro(filtro);
    const interval = setInterval(
      () => fetchProdutosPorFiltro(filtro, true),
      3600000
    );
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
          <button
            className={`${styles.filtroBtn} ${
              filtro === "racoes" ? styles.filtroBtnAtivo : ""
            }`}
            onClick={() => setFiltro("racoes")}
          >
            Rações
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
              filtro === "snaks" ? styles.filtroBtnAtivo : ""
            }`}
            onClick={() => setFiltro("snaks")}
          >
            Snaks
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
          <h2 className={styles.titulo}>Ração para Cães</h2>
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
                    // Carrega imagens dos próximos produtos
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
