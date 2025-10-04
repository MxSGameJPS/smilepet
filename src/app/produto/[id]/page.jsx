"use client";
import { useEffect, useState, use } from "react";
import { getProdutosCache } from "../../../lib/produtosCache";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header/header";
import Footer from "../../../components/Footer/footer";
import ChatFloat from "../../../components/ChatFloat/ChatFloat";
import styles from "./produto.module.css";

export default function Page({ params }) {
  const router = useRouter();
  const awaitedParams = use(params);
  const id = awaitedParams?.id;
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [variacoes, setVariacoes] = useState([]);
  const [variacaoSelecionada, setVariacaoSelecionada] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [showDetalhes, setShowDetalhes] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function fetchProduto() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://apismilepet.vercel.app/api/produtos/${id}`
        );
        if (!res.ok) throw new Error("Produto não encontrado");
        const produtoApi = await res.json();
        setProduto(produtoApi || null);
        // Buscar variações
        const resVar = await fetch(
          `https://apismilepet.vercel.app/api/produtos/variacoes/${id}`
        );
        if (resVar.ok) {
          const dataVar = await resVar.json();
          if (
            dataVar.data &&
            Array.isArray(dataVar.data.variacoes) &&
            dataVar.data.variacoes.length > 0
          ) {
            setVariacoes(dataVar.data.variacoes);
          } else {
            setVariacoes([]);
          }
        } else {
          setVariacoes([]);
        }
        // Buscar produtos relacionados: mesma categoria do produto atual (quando disponível), preço até R$60, exceto o atual
        const todosProdutos = await getProdutosCache();
        const categoriaAtual = produtoApi.categoria || null;
        const relacionadosFiltrados = todosProdutos
          .filter((p) => {
            if (p.id === produtoApi.id) return false;
            if (!p.imagem_url || !p.nome) return false;
            if (Number(p.preco) > 60) return false;
            if (categoriaAtual) {
              // compara categorias normalizadas
              const a = (p.categoria || "").toString().trim().toLowerCase();
              const b = (categoriaAtual || "").toString().trim().toLowerCase();
              return a === b;
            }
            return true;
          })
          .slice(0, 4);
        setRelacionados(relacionadosFiltrados);
      } catch {
        setProduto(null);
        setVariacoes([]);
        setRelacionados([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProduto();
  }, [id]);

  if (loading) return <div>Carregando...</div>;
  if (!produto) return <div>Produto não encontrado.</div>;

  // Função para adicionar ao carrinho
  function handleAddCarrinho() {
    if (!produto) return;
    // Recupera carrinho atual
    const carrinhoAtual = JSON.parse(localStorage.getItem("carrinho") || "[]");
    // Adiciona produto (se variação selecionada, adiciona ela)
    const produtoParaCarrinho = { ...(variacaoSelecionada || produto) };
    // Garante que preco seja número
    produtoParaCarrinho.preco = Number(produtoParaCarrinho.preco);
    carrinhoAtual.push(produtoParaCarrinho);
    localStorage.setItem("carrinho", JSON.stringify(carrinhoAtual));
    // Redireciona para página do carrinho
    router.push("/carrinho");
  }

  return (
    <div>
      <Header />
      <main className={styles.produtoContainer}>
        <div className={styles.produtoFlex}>
          <div>
            <img
              src={produto.imagem_url || "/vercel.svg"}
              alt={produto.nome}
              className={styles.produtoImagem}
            />
          </div>
          <div className={styles.produtoInfo}>
            <h1 className={styles.produtoTitulo}>
              {variacaoSelecionada ? variacaoSelecionada.nome : produto.nome}
            </h1>
            <div className={styles.infoRow}>
              <p className={styles.produtoPreco}>
                R${" "}
                {variacaoSelecionada
                  ? Number(variacaoSelecionada.preco)
                      .toFixed(2)
                      .replace(".", ",")
                  : produto.preco
                  ? Number(produto.preco).toFixed(2).replace(".", ",")
                  : "-"}
              </p>
              {produto.marca && (
                <div className={styles.marca}>
                  <strong>Marca:</strong> <span>{produto.marca}</span>
                </div>
              )}
              {produto.promocao && (
                <span className={styles.produtoPromocao}>Promoção!</span>
              )}
            </div>
            {variacoes.length > 0 && (
              <div className={styles.variacoesContainer}>
                <span>Variações:</span>
                <button
                  key={produto.id}
                  className={styles.variacaoBtn}
                  type="button"
                  onClick={() => setVariacaoSelecionada(null)}
                  style={{
                    margin: "0 4px",
                    background: !variacaoSelecionada ? "#0070f3" : "#eee",
                    color: !variacaoSelecionada ? "#fff" : "#333",
                  }}
                >
                  {produto.nome}
                </button>
                {variacoes.map((v) => (
                  <button
                    key={v.id}
                    className={styles.variacaoBtn}
                    type="button"
                    onClick={() => setVariacaoSelecionada(v)}
                    style={{
                      margin: "0 4px",
                      background:
                        variacaoSelecionada?.id === v.id ? "#0070f3" : "#eee",
                      color: variacaoSelecionada?.id === v.id ? "#fff" : "#333",
                    }}
                  >
                    {v.nome}
                  </button>
                ))}
              </div>
            )}
            <button className={styles.produtoBtn} onClick={handleAddCarrinho}>
              Adicionar ao carrinho
            </button>
            <div className={styles.produtoDescricao}>
              <h2 className={styles.produtoSubtitulo}>Descrição</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    produto.descricao_curta ||
                    "<p>Sem descrição disponível.</p>",
                }}
                className={styles.produtoDescricaoTexto}
              />
            </div>
            {/* Marca */}
            {produto.marca && (
              <div className={styles.marca}>
                <strong>Marca:</strong> <span>{produto.marca}</span>
              </div>
            )}

            {/* Mais detalhes: botão expansível */}
            {produto.descricao_completa && (
              <div className={styles.produtoDescricao}>
                <button
                  type="button"
                  className={styles.detalhesBtn}
                  onClick={() => setShowDetalhes((v) => !v)}
                  aria-expanded={showDetalhes}
                >
                  {showDetalhes ? "Ocultar detalhes" : "Mais detalhes"}
                </button>
                {showDetalhes && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: produto.descricao_completa,
                    }}
                    className={styles.detalhesConteudo}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        {/* Produtos relacionados */}
        {relacionados.length > 0 && (
          <section className={styles.relacionadosSection}>
            <h2 className={styles.relacionadosTitulo}>Produtos relacionados</h2>
            <div className={styles.relacionadosLista}>
              {relacionados.map((rel) => (
                <div key={rel.id} className={styles.relacionadoCard}>
                  <img
                    src={rel.imagem_url || "/vercel.svg"}
                    alt={rel.nome}
                    className={styles.relacionadoImagem}
                  />
                  <span className={styles.relacionadoNome}>{rel.nome}</span>
                  <span className={styles.relacionadoPreco}>
                    R$ {Number(rel.preco).toFixed(2).replace(".", ",")}
                  </span>
                  <button
                    className={`${styles.produtoBtn} ${styles.relacionadoBtn}`}
                    onClick={() => {
                      // Adiciona ao carrinho
                      const carrinhoAtual = JSON.parse(
                        localStorage.getItem("carrinho") || "[]"
                      );
                      carrinhoAtual.push({ ...rel, quantidade: 1 });
                      localStorage.setItem(
                        "carrinho",
                        JSON.stringify(carrinhoAtual)
                      );
                      router.push("/carrinho");
                    }}
                  >
                    Adicionar ao carrinho
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
      <ChatFloat produto={produto} />
    </div>
  );
}
