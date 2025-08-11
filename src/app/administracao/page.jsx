"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./administracao.module.css";
import CadastrarProduto from "./Components/Produtos/CadastrarProduto";
import ProdutosCadastrados from "./Components/Produtos/ProdutosCadastrados/ProdutosCadastrados";
import ProdutoDetalhe from "./Components/Produtos/ProdutosCadastrados/ProdutoDetalhe";
import CadastrarVariacoes from "./Components/Produtos/CadastrarVariacoes";

export default function PainelAdm() {
  const [autenticado, setAutenticado] = useState(false);
  const [tela, setTela] = useState("principal");
  const [produtoId, setProdutoId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adm_token");
    if (!token) {
      router.push("/administracao/loginAdm");
    } else {
      setAutenticado(true);
    }
  }, [router]);

  if (!autenticado) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <aside className={styles.aside}>
        <nav>
          <ul className={styles.menuList}>
            <li>
              <button className={styles.menuButton}>Vendas Realizadas</button>
            </li>
            <li>
              <button className={styles.menuButton}>Cadastro de Cliente</button>
            </li>
            <li>
              <button
                className={styles.menuButton}
                onClick={() => setTela("cadastroProduto")}
              >
                Cadastro de Produto
              </button>
            </li>
            <li>
              <button className={styles.menuButton}>
                Cadastro de Categoria
              </button>
            </li>
            <li>
              <button className={styles.menuButton}>Relatórios</button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className={styles.container}>
        {tela === "principal" && (
          <>
            <h1 className={styles.title}>Painel Administrativo</h1>
            <p className={styles.text}>Bem-vindo ao painel!</p>
          </>
        )}
        {tela === "cadastroProduto" &&
          tela !== "cadastrarProduto" &&
          tela !== "produtosCadastrados" &&
          tela !== "cadastrarVariacoes" && (
            <div className={styles.cardsContainer}>
              <div
                className={styles.card}
                onClick={() => setTela("cadastrarProduto")}
              >
                <h2>Cadastrar Produtos</h2>
              </div>
              <div
                className={styles.card}
                onClick={() => setTela("produtosCadastrados")}
              >
                <h2>Produtos Cadastrados</h2>
              </div>
              <div
                className={styles.card}
                onClick={() => setTela("cadastrarVariacoes")}
              >
                <h2>Cadastrar Variações</h2>
              </div>
            </div>
          )}
        {tela === "cadastrarVariacoes" && <CadastrarVariacoes />}
        {tela === "cadastrarProduto" && <CadastrarProduto />}
        {tela === "produtosCadastrados" && (
          <ProdutosCadastrados
            onVerProduto={(id) => {
              setProdutoId(id);
              setTela("detalheProduto");
            }}
          />
        )}
        {tela === "detalheProduto" && produtoId && (
          <ProdutoDetalhe
            produtoId={produtoId}
            onVoltar={() => setTela("produtosCadastrados")}
          />
        )}
      </main>
    </div>
  );
}
