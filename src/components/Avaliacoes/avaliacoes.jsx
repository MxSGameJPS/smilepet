"use client";
import { useState, useEffect } from "react";
import styles from "./avaliacoes.module.css";

export default function Avaliacoes() {
  const reviews = [
    {
      id: 1,
      name: "Mariana S.",
      text: "Comprei para meu dog e ele amou! Entrega rápida e ótimo atendimento.",
      rating: 5,
    },
    {
      id: 2,
      name: "Carlos M.",
      text: "Produtos de qualidade e preço justo. Recomendo a loja.",
      rating: 5,
    },
    {
      id: 3,
      name: "Ana P.",
      text: "Suporte eficiente e envio dentro do prazo. Voltarei a comprar.",
      rating: 4,
    },
    {
      id: 4,
      name: "Bruno L.",
      text: "Meu gato adorou os petiscos. Ótima variedade de marcas.",
      rating: 5,
    },
    {
      id: 5,
      name: "Patrícia R.",
      text: "Site fácil de navegar e preços competitivos. Parabéns!",
      rating: 4,
    },
    {
      id: 6,
      name: "Fábio T.",
      text: "Atendimento cordial e entrega bem embalada. Produto conforme descrito.",
      rating: 5,
    },
  ];

  const perPage = 2;
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + perPage) % reviews.length);
  const prev = () =>
    setIndex((i) => (i - perPage + reviews.length) % reviews.length);

  useEffect(() => {
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, []);

  // calcula quais avaliações mostrar
  const visible = [];
  for (let i = 0; i < perPage; i++) {
    visible.push(reviews[(index + i) % reviews.length]);
  }

  return (
    <section className={styles.container} aria-label="Avaliações de clientes">
      <div className={styles.header}>
        <h3>O que nossos clientes dizem</h3>
        <div className={styles.controls}>
          <button aria-label="Anterior" onClick={prev} className={styles.ctrl}>
            ‹
          </button>
          <button aria-label="Próximo" onClick={next} className={styles.ctrl}>
            ›
          </button>
        </div>
      </div>

      <div className={styles.carousel}>
        {visible.map((r) => (
          <article key={r.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.avatar} aria-hidden>
                {r.name.charAt(0)}
              </div>
              <div>
                <div className={styles.name}>{r.name}</div>
                <div className={styles.rating}>{"★".repeat(r.rating)}</div>
              </div>
            </div>
            <p className={styles.text}>{r.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
