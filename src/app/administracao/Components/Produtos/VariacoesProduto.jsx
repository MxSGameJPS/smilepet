"use client"
import { useState } from "react";
import styles from "./VariacoesProduto.module.css";

export default function VariacoesProduto({
  produtoPai,
  imagensPai,
  onFinalizar,
}) {
  const [form, setForm] = useState({
    nome: "",
    sku: "",
    ncm: "",
    preco: "",
    categoria: "",
    descricao_curta: "",
    descricao_completa: "",
    estoque: "",
    promocao: false,
    desconto_promocao: "",
    categoria_id: produtoPai.categoria_id || "",
  });
  const [msg, setMsg] = useState("");
  const [cadastrando, setCadastrando] = useState(false);
  const [pergunta, setPergunta] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setCadastrando(true);
    setMsg("");
    try {
      const res = await fetch(
        `https://apismilepet.vercel.app/api/produtos/variacoes/${produtoPai.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            preco: Number(form.preco),
            estoque: Number(form.estoque),
            desconto_promocao: Number(form.desconto_promocao),
            categoria_id: Number(form.categoria_id),
            imagem_url: imagensPai.imagem_url,
            imagens_secundarias: imagensPai.imagens_secundarias,
            criado_em: new Date().toISOString(),
          }),
        }
      );
      const data = await res.json();
      if (res.ok && data.id) {
        setMsg("Variação cadastrada com sucesso!");
        setPergunta(true);
      } else {
        setMsg(data.message || "Erro ao cadastrar variação.");
      }
    } catch {
      setMsg("Erro de conexão com a API.");
    }
    setCadastrando(false);
  }

  function handleNovaVariacao() {
    setForm({
      nome: "",
      sku: "",
      ncm: "",
      preco: "",
      categoria: "",
      descricao_curta: "",
      descricao_completa: "",
      estoque: "",
      promocao: false,
      desconto_promocao: "",
      categoria_id: produtoPai.categoria_id || "",
    });
    setMsg("");
    setPergunta(false);
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Cadastrar Variação do Produto</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          name="nome"
          type="text"
          placeholder="Nome da Variação"
          value={form.nome}
          onChange={handleChange}
          required
        />
        <input
          className={styles.input}
          name="sku"
          type="text"
          placeholder="SKU"
          value={form.sku}
          onChange={handleChange}
          required
        />
        <input
          className={styles.input}
          name="ncm"
          type="text"
          placeholder="NCM"
          value={form.ncm}
          onChange={handleChange}
          required
        />
        <input
          className={styles.input}
          name="preco"
          type="number"
          placeholder="Preço"
          value={form.preco}
          onChange={handleChange}
          required
        />
        <input
          className={styles.input}
          name="estoque"
          type="number"
          placeholder="Estoque"
          value={form.estoque}
          onChange={handleChange}
          required
        />
        <input
          className={styles.input}
          name="descricao_curta"
          type="text"
          placeholder="Descrição Curta"
          value={form.descricao_curta}
          onChange={handleChange}
        />
        <textarea
          className={styles.input}
          name="descricao_completa"
          placeholder="Descrição Completa"
          rows={4}
          value={form.descricao_completa}
          onChange={handleChange}
        />
        <label className={styles.label}>
          <input
            name="promocao"
            type="checkbox"
            checked={form.promocao}
            onChange={handleChange}
          />{" "}
          Produto em promoção?
        </label>
        {form.promocao && (
          <input
            className={styles.input}
            name="desconto_promocao"
            type="number"
            placeholder="Desconto da Promoção (%)"
            value={form.desconto_promocao}
            onChange={handleChange}
          />
        )}
        <button className={styles.button} type="submit" disabled={cadastrando}>
          {cadastrando ? "Cadastrando..." : "Cadastrar"}
        </button>
        {msg && <p className={styles.msg}>{msg}</p>}
      </form>
      {pergunta && (
        <div className={styles.perguntaBox}>
          <p>Gostaria de cadastrar mais uma variação?</p>
          <button className={styles.button} onClick={handleNovaVariacao}>
            SIM
          </button>
          <button className={styles.button} onClick={onFinalizar}>
            NÃO
          </button>
        </div>
      )}
    </div>
  );
}
