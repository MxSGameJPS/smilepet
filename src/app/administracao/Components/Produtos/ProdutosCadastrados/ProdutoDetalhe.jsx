import { useEffect, useState } from "react";
import styles from "./ProdutoDetalhe.module.css";

export default function ProdutoDetalhe({ produtoId, onVoltar }) {
  const [produto, setProduto] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");
  const [imagem, setImagem] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProduto() {
      setLoading(true);
      setMsg("");
      try {
        const res = await fetch(
          `https://apismilepet.vercel.app/api/produtos/${produtoId}`
        );
        const data = await res.json();
        if (res.ok) {
          setProduto(data);
          setForm(data);
        } else {
          setMsg("Erro ao buscar produto.");
        }
      } catch {
        setMsg("Erro de conexão com a API.");
      }
      setLoading(false);
    }
    fetchProduto();
  }, [produtoId]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handlePatch() {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(
        `https://apismilepet.vercel.app/api/produtos/${produtoId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (res.ok) {
        setMsg("Produto atualizado com sucesso!");
        setEditando(false);
      } else {
        setMsg("Erro ao atualizar produto.");
      }
    } catch {
      setMsg("Erro de conexão com a API.");
    }
    setLoading(false);
  }

  async function handleImagemPatch() {
    if (!imagem) return;
    setLoading(true);
    setMsg("");
    try {
      const formData = new FormData();
      formData.append("imagem", imagem);
      const res = await fetch(
        `https://apismilepet.vercel.app/api/produtos/${produtoId}/imagem`,
        {
          method: "PATCH",
          body: formData,
        }
      );
      const data = await res.json();
      if (res.ok && data.url) {
        setMsg("Imagem atualizada!");
        setProduto((prev) => ({ ...prev, imagem_url: data.url }));
      } else {
        setMsg("Erro ao atualizar imagem.");
      }
    } catch {
      setMsg("Erro de conexão com a API.");
    }
    setLoading(false);
  }

  async function handleImagemDelete() {
    if (!window.confirm("Deseja apagar a imagem do produto?")) return;
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(
        `https://apismilepet.vercel.app/api/produtos/${produtoId}/imagem`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setMsg("Imagem apagada!");
        setProduto((prev) => ({ ...prev, imagem_url: "" }));
      } else {
        setMsg("Erro ao apagar imagem.");
      }
    } catch {
      setMsg("Erro de conexão com a API.");
    }
    setLoading(false);
  }

  if (!produto)
    return (
      <div className={styles.container}>
        <p>Carregando...</p>
      </div>
    );

  return (
    <div className={styles.container}>
      <button className={styles.voltar} onClick={onVoltar}>
        Voltar
      </button>
      <h2 className={styles.title}>Detalhes do Produto</h2>
      {msg && <p className={styles.msg}>{msg}</p>}
      <div className={styles.info}>
        <img
          src={produto.imagem_url}
          alt={produto.nome}
          className={styles.imagem}
        />
        <div>
          <p>
            <strong>Nome:</strong> {produto.nome}
          </p>
          <p>
            <strong>SKU:</strong> {produto.sku}
          </p>
          <p>
            <strong>Categoria:</strong> {produto.categoria}
          </p>
          <p>
            <strong>Preço:</strong> R$ {produto.preco}
          </p>
          <p>
            <strong>Estoque:</strong> {produto.estoque}
          </p>
        </div>
      </div>
      {editando ? (
        <div className={styles.formEdit}>
          <input
            className={styles.input}
            name="nome"
            type="text"
            value={form.nome}
            onChange={handleChange}
          />
          <input
            className={styles.input}
            name="sku"
            type="text"
            value={form.sku}
            onChange={handleChange}
          />
          <input
            className={styles.input}
            name="categoria"
            type="text"
            value={form.categoria}
            onChange={handleChange}
          />
          <input
            className={styles.input}
            name="preco"
            type="number"
            value={form.preco}
            onChange={handleChange}
          />
          <input
            className={styles.input}
            name="estoque"
            type="number"
            value={form.estoque}
            onChange={handleChange}
          />
          <button
            className={styles.button}
            onClick={handlePatch}
            disabled={loading}
          >
            Salvar
          </button>
        </div>
      ) : (
        <button className={styles.button} onClick={() => setEditando(true)}>
          Editar Produto
        </button>
      )}
      <div className={styles.imagemActions}>
        <input
          className={styles.input}
          type="file"
          accept="image/*"
          onChange={(e) => setImagem(e.target.files[0])}
        />
        <button
          className={styles.button}
          onClick={handleImagemPatch}
          disabled={loading}
        >
          Alterar Imagem
        </button>
        <button
          className={styles.button}
          onClick={handleImagemDelete}
          disabled={loading}
        >
          Apagar Imagem
        </button>
      </div>
    </div>
  );
}
