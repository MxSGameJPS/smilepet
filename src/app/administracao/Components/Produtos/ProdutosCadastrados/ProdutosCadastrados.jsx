import { useEffect, useState } from "react";
import styles from "./ProdutosCadastrados.module.css";

export default function ProdutosCadastrados() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [expandido, setExpandido] = useState({}); // { [id]: true/false }
  const [variacoes, setVariacoes] = useState({}); // { [idProdutoPai]: [variacoes] }
  const [editandoProduto, setEditandoProduto] = useState(null);
  const [formProduto, setFormProduto] = useState({});
  const [loadingForm, setLoadingForm] = useState(false);
  const [categorias, setCategorias] = useState([]);

  async function handleDeleteProduto(id) {
    setMsg("");
    try {
      const res = await fetch(
        `https://apismilepet.vercel.app/api/produtos/${id}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setMsg("Produto apagado com sucesso!");
        setProdutos((prev) => prev.filter((p) => p.id !== id));
      } else {
        setMsg("Erro ao apagar produto.");
      }
    } catch {
      setMsg("Erro de conexão com a API.");
    }
  }

  useEffect(() => {
    async function fetchProdutos() {
      setLoading(true);
      setMsg("");
      try {
        const res = await fetch("https://apismilepet.vercel.app/api/produtos");
        const data = await res.json();
        if (res.ok && Array.isArray(data.data)) {
          setProdutos(data.data);
        } else {
          setProdutos([]);
          setMsg("Nenhum produto encontrado ou formato inesperado.");
        }
      } catch {
        setMsg("Erro de conexão com a API.");
      }
      setLoading(false);
    }
    async function fetchCategorias() {
      try {
        const res = await fetch(
          "https://apismilepet.vercel.app/api/categorias/produtos"
        );
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setCategorias(data);
        } else {
          setCategorias([]);
        }
      } catch {
        setCategorias([]);
      }
    }
    fetchProdutos();
    fetchCategorias();
  }, []);

  async function handleExpand(id) {
    setExpandido((prev) => ({ ...prev, [id]: !prev[id] }));
    // Se já buscou, não busca de novo
    if (variacoes[id]) return;
    try {
      const res = await fetch(
        `https://apismilepet.vercel.app/api/produtos/variacoes/${id}`
      );
      const data = await res.json();
      if (res.ok && Array.isArray(data.data)) {
        setVariacoes((prev) => ({ ...prev, [id]: data.data }));
      } else {
        setVariacoes((prev) => ({ ...prev, [id]: [] }));
      }
    } catch {
      setVariacoes((prev) => ({ ...prev, [id]: [] }));
    }
  }

  function handleEditarProduto(produto) {
    setEditandoProduto(produto.id);
    setFormProduto(produto);
  }

  function handleChangeProduto(e) {
    const { name, value, type, checked } = e.target;
    setFormProduto((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSalvarProduto() {
    setLoadingForm(true);
    setMsg("");
    try {
      const res = await fetch(
        `https://apismilepet.vercel.app/api/produtos/${formProduto.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formProduto),
        }
      );
      if (res.ok) {
        setMsg("Produto atualizado com sucesso!");
        setEditandoProduto(null);
        setProdutos((prev) =>
          prev.map((p) => (p.id === formProduto.id ? formProduto : p))
        );
      } else {
        setMsg("Erro ao atualizar produto.");
      }
    } catch {
      setMsg("Erro de conexão com a API.");
    }
    setLoadingForm(false);
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Produtos Cadastrados</h2>
      {loading && <p className={styles.msg}>Carregando...</p>}
      {msg && <p className={styles.msg}>{msg}</p>}
      <ul className={styles.lista}>
        {Array.isArray(produtos) && produtos.length > 0 ? (
          produtos.map((produto) => (
            <li key={produto.id} className={styles.item}>
              <div className={styles.linhaProduto}>
                <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  {produto.temVariacoes && (
                    <button
                      className={styles.expandir}
                      onClick={() => handleExpand(produto.id)}
                    >
                      {expandido[produto.id] ? "▼" : "▶"}
                    </button>
                  )}
                  <span
                    className={styles.nome}
                    onClick={() => handleEditarProduto(produto)}
                  >
                    {produto.nome}
                  </span>
                </div>
                <button
                  className={styles.apagar}
                  onClick={() => handleDeleteProduto(produto.id)}
                >
                  Apagar
                </button>
              </div>
              {/* Formulário de edição do produto */}
              {editandoProduto === produto.id && (
                <form
                  style={{
                    marginTop: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSalvarProduto();
                  }}
                >
                  <label className={styles.label}>
                    Nome do Produto
                    <input
                      className={styles.input}
                      name="nome"
                      type="text"
                      value={formProduto.nome || ""}
                      onChange={handleChangeProduto}
                    />
                  </label>
                  <label className={styles.label}>
                    SKU
                    <input
                      className={styles.input}
                      name="sku"
                      type="text"
                      value={formProduto.sku || ""}
                      onChange={handleChangeProduto}
                    />
                  </label>
                  <label className={styles.label}>
                    Categoria
                    <select
                      className={styles.input}
                      name="categoria"
                      value={formProduto.categoria || ""}
                      onChange={handleChangeProduto}
                    >
                      <option value="">Selecione uma categoria</option>
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.nome}>
                          {cat.nome}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={styles.label}>
                    Preço
                    <input
                      className={styles.input}
                      name="preco"
                      type="number"
                      value={formProduto.preco || ""}
                      onChange={handleChangeProduto}
                    />
                  </label>
                  <label className={styles.label}>
                    Estoque
                    <input
                      className={styles.input}
                      name="estoque"
                      type="number"
                      value={formProduto.estoque || ""}
                      onChange={handleChangeProduto}
                    />
                  </label>
                  <label className={styles.label}>
                    Descrição Curta
                    <input
                      className={styles.input}
                      name="descricao_curta"
                      type="text"
                      value={formProduto.descricao_curta || ""}
                      onChange={handleChangeProduto}
                      placeholder="Breve descrição do produto"
                    />
                  </label>
                  <label className={styles.label}>
                    Descrição Completa
                    <textarea
                      className={styles.input}
                      name="descricao_completa"
                      value={formProduto.descricao_completa || ""}
                      onChange={handleChangeProduto}
                      placeholder="Descrição detalhada do produto"
                      rows={4}
                    />
                  </label>
                  <label className={styles.label}>
                    Imagem do Produto
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      {formProduto.imagem_url &&
                        formProduto.imagem_url.length > 0 && (
                          <img
                            src={formProduto.imagem_url}
                            alt="Imagem atual"
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: "cover",
                              borderRadius: 8,
                              border: "1px solid #ccc",
                            }}
                          />
                        )}
                      <input
                        className={styles.input}
                        name="imagem_url"
                        type="text"
                        value={formProduto.imagem_url || ""}
                        onChange={handleChangeProduto}
                        placeholder="URL da imagem"
                      />
                      {/* Para upload real, seria necessário backend que aceite arquivo */}
                    </div>
                  </label>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button
                      className={styles.apagar}
                      style={{ background: "#0070f3" }}
                      type="submit"
                      disabled={loadingForm}
                    >
                      Salvar
                    </button>
                    <button
                      className={styles.apagar}
                      style={{ background: "#eee", color: "#333" }}
                      type="button"
                      onClick={() => setEditandoProduto(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
              {/* Variações expandida */}
              {expandido[produto.id] && variacoes[produto.id] && (
                <ul className={styles.listaVariacoes}>
                  {variacoes[produto.id].length > 0 ? (
                    variacoes[produto.id].map((variacao) => (
                      <li key={variacao.id} className={styles.itemVariacao}>
                        {variacao.nome}
                      </li>
                    ))
                  ) : (
                    <li className={styles.itemVariacao}>
                      Nenhuma variação cadastrada.
                    </li>
                  )}
                </ul>
              )}
            </li>
          ))
        ) : (
          <li className={styles.item}>Nenhum produto cadastrado.</li>
        )}
      </ul>
    </div>
  );
}
