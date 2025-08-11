import { useEffect, useState } from "react";
import styles from "./CadastrarVariacoes.module.css";

export default function CadastrarVariacoes() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [produtoPaiId, setProdutoPaiId] = useState(null);
  const [form, setForm] = useState({
    nome: "",
    sku: "",
    ncm: "",
    preco: "",
    descricao_curta: "",
    descricao_completa: "",
    imagem_url: "",
    imagens_secundarias: [],
    estoque: "",
    promocao: false,
    desconto_promocao: "",
    criado_em: new Date().toISOString(),
    categoria_id: "",
  });
  const [msgForm, setMsgForm] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);

  useEffect(() => {
    setLoading(true);
    setMsg("");
    fetch("https://apismilepet.vercel.app/api/produtos")
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          if (Array.isArray(data.data)) {
            setProdutos(data.data);
          } else {
            setProdutos([]);
            setMsg("Nenhum produto encontrado ou formato inesperado.");
          }
        } else {
          setMsg("Erro ao buscar produtos.");
        }
      })
      .catch(() => setMsg("Erro de conexão com a API."))
      .finally(() => setLoading(false));
  }, []);

  function handleProdutoClick(id) {
    setProdutoPaiId(id);
    setMsgForm("");
    // Herdar o campo 'categoria' do produto pai e usar como categoria_id
    const produtoPai = produtos.find((p) => p.id === id);
    setForm((prev) => ({
      ...prev,
      categoria: produtoPai?.categoria || "",
      categoria_id: produtoPai?.categoria ? Number(produtoPai.categoria) : "",
    }));
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoadingForm(true);
    setMsgForm("");
    const payload = {
      ...form,
      preco: Number(form.preco) || 0,
      estoque: Number(form.estoque) || 0,
      desconto_promocao: Number(form.desconto_promocao) || 0,
      produto_pai_id: produtoPaiId,
      id: 0,
      categoria_id: form.categoria_id,
    };
    fetch(
      `https://apismilepet.vercel.app/api/produtos/variacoes/${produtoPaiId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )
      .then(async (res) => {
        if (!res.ok) throw new Error("Erro ao cadastrar variação");
        await res.json();
        setMsgForm("Variação cadastrada com sucesso!");
        setForm({
          nome: "",
          sku: "",
          ncm: "",
          preco: "",
          categoria: "",
          descricao_curta: "",
          descricao_completa: "",
          imagem_url: "",
          imagens_secundarias: [],
          estoque: "",
          promocao: false,
          desconto_promocao: "",
          criado_em: new Date().toISOString(),
        });
      })
      .catch(() => setMsgForm("Erro ao cadastrar variação"))
      .finally(() => setLoadingForm(false));
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Cadastrar Variações</h2>
      {!produtoPaiId ? (
        <>
          <p className={styles.msg}>
            Selecione um produto para cadastrar variações:
          </p>
          {loading && <p className={styles.msg}>Carregando...</p>}
          {msg && <p className={styles.msg}>{msg}</p>}
          <ul className={styles.listaProdutos}>
            {Array.isArray(produtos) && produtos.length > 0 ? (
              produtos.map((produto) => (
                <li
                  key={produto.id}
                  className={styles.itemProduto}
                  onClick={() => handleProdutoClick(produto.id)}
                  tabIndex={0}
                  style={{ cursor: "pointer" }}
                >
                  {produto.nome}
                </li>
              ))
            ) : (
              <li className={styles.itemProduto}>Nenhum produto cadastrado.</li>
            )}
          </ul>
        </>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <p className={styles.msg}>
            Cadastrando variação para produto ID: <b>{produtoPaiId}</b>
          </p>
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
          {/* Categoria herdada do produto pai, não exibida no formulário */}
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
            rows={3}
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
          <button
            className={styles.button}
            type="submit"
            disabled={loadingForm}
          >
            {loadingForm ? "Cadastrando..." : "Cadastrar Variação"}
          </button>
          {msgForm && <p className={styles.msg}>{msgForm}</p>}
          <button
            type="button"
            className={styles.button}
            style={{ marginTop: 8, background: "#eee", color: "#333" }}
            onClick={() => setProdutoPaiId(null)}
          >
            Voltar para lista de produtos
          </button>
        </form>
      )}
    </div>
  );
}
