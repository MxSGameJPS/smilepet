"use client";
import { useState } from "react";
import styles from "./chatFloat.module.css";

export default function ChatFloat({ produto }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const assistantName = "Smilezinho";

  // Perguntas pré-definidas com respostas que usam dados do produto quando possível
  const questions = [
    {
      id: "validade",
      label: "Qual a validade do produto?",
      answer: () =>
        produto?.validade
          ? `A validade informada é: ${produto.validade}. Verifique a embalagem para a data do lote.`
          : `A validade pode variar por lote — verifique a embalagem. Caso precise eu posso checar com o estoque.`,
    },
    {
      id: "entrega",
      label: "Quanto tempo de entrega?",
      answer: () =>
        `O prazo de entrega depende da sua região e do método de envio. Normalmente entregamos em 2–7 dias úteis.`,
    },
    {
      id: "original",
      label: "O produto é original?",
      answer: () =>
        produto?.marca
          ? `Sim — trabalhamos com marcas oficiais. Este produto é da marca ${produto.marca}.`
          : `Sim — trabalhamos com fornecedores e marcas oficiais.`,
    },
    {
      id: "conservacao",
      label: "Como conservar o produto?",
      answer: () =>
        `Armazene em local seco e ao abrigo da luz. Siga as instruções do rótulo para melhores resultados.`,
    },
    {
      id: "info",
      label: "Mais informações técnicas",
      answer: () =>
        produto?.descricao_curta
          ? produto.descricao_curta
          : `Você pode ver a descrição completa na página do produto.`,
    },
  ];

  function openChat() {
    setOpen(true);
    // apresentação inicial se ainda não houver mensagens
    if (messages.length === 0) {
      setMessages([
        {
          from: "bot",
          text: `Olá! Eu sou ${assistantName}, seu assistente virtual. Posso ajudar com perguntas sobre este produto. Escolha uma das opções abaixo para ver a resposta.`,
        },
      ]);
    }
  }

  function handleQuestion(q) {
    // adiciona pergunta (simulada como user) e resposta do assistente
    setMessages((m) => [
      ...m,
      { from: "user", text: q.label },
      { from: "bot", text: q.answer() },
    ]);
  }

  function clearChat() {
    setMessages([]);
    setOpen(false);
  }

  return (
    <div>
      <button
        className={styles.fab}
        aria-label="Abrir chat com Smilezinho"
        onClick={() => (open ? setOpen(false) : openChat())}
      >
        💬
      </button>

      {open && (
        <div className={styles.chatBox} role="dialog" aria-modal="true">
          <header className={styles.chatHeader}>
            <div>
              <strong>{assistantName}</strong>
              <div className={styles.chatSubtitle}>Assistente virtual</div>
            </div>
            <div className={styles.chatHeaderBtns}>
              <button
                aria-label="Limpar conversa"
                className={styles.iconBtn}
                onClick={() => setMessages([])}
              >
                ♻
              </button>
              <button
                aria-label="Fechar chat"
                className={styles.iconBtn}
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>
          </header>

          <div className={styles.messages}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={m.from === "bot" ? styles.msgBot : styles.msgUser}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className={styles.qnaArea}>
            <div className={styles.qnaTitle}>Perguntas rápidas</div>
            <div className={styles.qnaList}>
              {questions.map((q) => (
                <button
                  key={q.id}
                  className={styles.qBtn}
                  onClick={() => handleQuestion(q)}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
