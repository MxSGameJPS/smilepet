"use client";
import { useEffect, useState } from "react";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import styles from "./carrinho.module.css";

export default function CarrinhoPage() {
  const [carrinho, setCarrinho] = useState([]);

  // Atualiza quantidade de um item
  function alterarQuantidade(idx, delta) {
    const novoCarrinho = carrinho.map((item, i) => {
      if (i === idx) {
        const novaQtd = (item.quantidade || 1) + delta;
        return { ...item, quantidade: novaQtd < 1 ? 1 : novaQtd };
      }
      return item;
    });
    setCarrinho(novoCarrinho);
    localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
  }

  // Calcula o valor total dos itens
  const valorTotal = carrinho.reduce(
    (acc, produto) => acc + (produto.preco || 0) * (produto.quantidade || 1),
    0
  );

  // Remove item do carrinho
  function removerItem(idx) {
    const novoCarrinho = carrinho.filter((_, i) => i !== idx);
    setCarrinho(novoCarrinho);
    localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
  }

  useEffect(() => {
    const itens = localStorage.getItem("carrinho");
    if (itens) {
      setCarrinho(JSON.parse(itens));
    }
  }, []);

  return (
    <div>
      <Header />
      <main className={styles.carrinhoContainer}>
        <h1 className={styles.carrinhoTitulo}>Meu Carrinho</h1>
        {carrinho.length === 0 ? (
          <p className={styles.carrinhoVazio}>Seu carrinho está vazio.</p>
        ) : (
          <>
            <ul className={styles.carrinhoLista}>
              {carrinho.map((produto, idx) => (
                <li key={idx} className={styles.carrinhoItem}>
                  <img
                    src={produto.imagem_url || "/vercel.svg"}
                    alt={produto.nome}
                    className={styles.carrinhoImagem}
                  />
                  <div>
                    <h2>{produto.nome}</h2>
                    <p className={styles.carrinhoPreco}>
                      R$ {produto.preco ? Number(produto.preco).toFixed(2) : "-"}
                    </p>
                    <p>SKU: {produto.sku}</p>
                    <div className={styles.carrinhoQtdWrap}>
                      <button
                        className={styles.carrinhoQtdBtn}
                        onClick={() => alterarQuantidade(idx, -1)}
                        aria-label="Diminuir quantidade"
                      >
                        -
                      </button>
                      <span className={styles.carrinhoQtdValor}>
                        {produto.quantidade || 1}
                      </span>
                      <button
                        className={styles.carrinhoQtdBtn}
                        onClick={() => alterarQuantidade(idx, 1)}
                        aria-label="Aumentar quantidade"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className={styles.carrinhoRemoverBtn}
                    onClick={() => removerItem(idx)}
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
            <div className={styles.carrinhoResumo}>
              <span className={styles.carrinhoTotalLabel}>Total:</span>
              <span className={styles.carrinhoTotalValor}>
                R$ {Number(valorTotal).toFixed(2)}
              </span>
            </div>
            <div className={styles.carrinhoAcoes}>
              <button
                className={styles.carrinhoBtn}
                onClick={() => (window.location.href = "/")}
              >
                Adicionar mais itens
              </button>
              <button
                className={styles.carrinhoBtnFinalizar}
                onClick={() =>
                  alert("Funcionalidade de finalizar compra em breve!")
                }
              >
                Finalizar compra
              </button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
