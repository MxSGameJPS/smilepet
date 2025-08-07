"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header/header";
import Footer from "../../../components/Footer/footer";
import styles from "./produto.module.css";

export default function Page({ params }) {
  const router = useRouter();
  const awaitedParams = use(params);
  const id = awaitedParams?.id;
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchProduto() {
      setLoading(true);
      try {
        const res = await fetch("/mocks/produtos.json");
        const produtos = await res.json();
        const encontrado = produtos.find((p) => p.id === id);
        setProduto(encontrado || null);
      } catch {
        setProduto(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduto();
  }, [id]);

  if (loading) return <div>Carregando...</div>;
  if (!produto) return <div>Produto não encontrado.</div>;

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
            <h1 className={styles.produtoTitulo}>{produto.nome}</h1>
            <p className={styles.produtoPreco}>
              R$ {produto.preco?.toFixed(2)}
            </p>
            {produto.promocao && (
              <span className={styles.produtoPromocao}>Promoção!</span>
            )}
            <button className={styles.produtoBtn}>Adicionar ao carrinho</button>
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
            {produto.descricao_completa && (
              <div className={styles.produtoDescricao}>
                <h2 className={styles.produtoSubtitulo}>Mais detalhes</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: produto.descricao_completa,
                  }}
                    className={styles.produtoDescricaoTexto}
                />
              </div>
            )}
            <div className={styles.produtoSku}>
              <h2 className={styles.produtoSubtitulo}>SKU</h2>
              <p>{produto.sku}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
