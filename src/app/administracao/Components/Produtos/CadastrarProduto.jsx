import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./CadastrarProduto.module.css";
import useCategorias from "./useCategorias";

export default function CadastrarProduto() {
  const [form, setForm] = useState({
    nome: "",
    sku: "",
    ncm: "",
    preco: "",
    categoria_id: "",
    estoque: "",
    descricao_curta: "",
    descricao_completa: "",
    promocao: false,
    desconto_promocao: "",
  });
  const [msg, setMsg] = useState("");
  const [formFechado, setFormFechado] = useState(false);
  const [imagemUrl, setImagemUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { categorias, loadingCategorias, errorCategorias } = useCategorias();
  const router = useRouter();

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Removido lógica de upload e preview de imagens

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      // Monta o payload conforme o schema da API
      const payload = {
        id: 0,
        nome: form.nome,
        sku: form.sku,
        ncm: form.ncm,
        preco: Number(form.preco) || 0,
        categoria: String(form.categoria_id),
        descricao_curta: form.descricao_curta,
        descricao_completa: form.descricao_completa,
        imagem_url: imagemUrl,
        imagens_secundarias: [], // pode ser preenchido depois
        estoque: Number(form.estoque) || 0,
        promocao: Boolean(form.promocao),
        desconto_promocao: Number(form.desconto_promocao) || 0,
        produto_pai_id: 0, // será preenchido pelo backend
        criado_em: new Date().toISOString(),
        categoria_id: Number(form.categoria_id) || 0,
      };
      fetch("https://apismilepet.vercel.app/api/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Erro ao cadastrar produto");
          await res.json();
          setMsg("Produto cadastrado com sucesso!");
          setFormFechado(true);
        })
        .catch(() => {
          setMsg("Erro ao cadastrar produto");
        })
        .finally(() => setLoading(false));
    } catch (err) {
      setMsg("Erro ao cadastrar produto");
      setLoading(false);
    }
  }
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Cadastrar Produto</h2>
      {formFechado ? (
        <p className={styles.msg}>{msg}</p>
      ) : (
        <form
          className={styles.form}
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          {/* ...existing code... */}
          <input
            className={styles.input}
            name="nome"
            type="text"
            placeholder="Nome do Produto"
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
          <select
            className={styles.input}
            name="categoria_id"
            value={form.categoria_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecione a categoria</option>
            {loadingCategorias && <option disabled>Carregando...</option>}
            {errorCategorias && <option disabled>{errorCategorias}</option>}
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
          <input
            className={styles.input}
            name="imagem_url"
            type="text"
            placeholder="URL da imagem principal"
            value={imagemUrl}
            onChange={(e) => setImagemUrl(e.target.value)}
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
          ></textarea>
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
          {/* Removido campo produto_pai_id conforme solicitado */}
          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
          {msg && <p className={styles.msg}>{msg}</p>}
          {imagemUrl && (
            <p className={styles.msg}>
              URL da imagem cadastrada:{" "}
              <a href={imagemUrl} target="_blank" rel="noopener noreferrer">
                {imagemUrl}
              </a>
            </p>
          )}
        </form>
      )}
    </div>
  );
}
