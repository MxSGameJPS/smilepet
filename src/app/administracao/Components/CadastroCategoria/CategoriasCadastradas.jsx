import { useEffect, useState } from "react";
import styles from "./CadastroCategoria.module.css";

export default function CategoriasCadastradas() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [formCategoria, setFormCategoria] = useState({
    nome: "",
    descricao: "",
  });
  const [loadingForm, setLoadingForm] = useState(false);

  useEffect(() => {
    fetchCategorias();
  }, []);

  async function fetchCategorias() {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(
        "https://apismilepet.vercel.app/api/categorias/produtos"
      );
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setCategorias(data);
      } else if (res.ok && Array.isArray(data.data)) {
        setCategorias(data.data);
      } else {
        setCategorias([]);
        setMsg("Nenhuma categoria encontrada.");
      }
    } catch {
      setMsg("Erro ao buscar categorias.");
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    setMsg("");
    try {
      const res = await fetch(
        `https://apismilepet.vercel.app/api/categorias/produtos/${id}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setMsg("Categoria apagada com sucesso!");
        setCategorias(categorias.filter((c) => c.id !== id));
      } else {
        setMsg("Erro ao apagar categoria.");
      }
    } catch {
      setMsg("Erro de conexão ao apagar.");
    }
  }

  async function handleEditar(id) {
    setMsg("");
    setEditandoId(id);
    setLoadingForm(true);
    try {
      const res = await fetch(
        `https://apismilepet.vercel.app/api/categorias/produtos/${id}`
      );
      const data = await res.json();
      let categoria = null;
      if (res.ok && data) {
        // Se vier como objeto direto
        if (data.id && data.nome) {
          categoria = data;
        } else if (data.data && data.data.id && data.data.nome) {
          categoria = data.data;
        }
      }
      if (categoria) {
        setFormCategoria({
          nome: categoria.nome || "",
          descricao: categoria.descricao || "",
        });
        setLoadingForm(false);
      } else {
        setMsg("Erro ao buscar categoria.");
        setLoadingForm(false);
      }
    } catch {
      setMsg("Erro de conexão ao buscar categoria.");
      setLoadingForm(false);
    }
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setMsg("");
    setLoadingForm(true);
    try {
      const res = await fetch(
        `https://apismilepet.vercel.app/api/categorias/produtos/${editandoId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formCategoria),
        }
      );
      if (res.ok) {
        setMsg("Categoria atualizada com sucesso!");
        setCategorias(
          categorias.map((c) =>
            c.id === editandoId ? { ...c, ...formCategoria } : c
          )
        );
        setEditandoId(null);
      } else {
        setMsg("Erro ao atualizar categoria.");
      }
    } catch {
      setMsg("Erro de conexão ao atualizar.");
    }
    setLoadingForm(false);
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Categorias Cadastradas</h2>
      {loading && <p className={styles.msg}>Carregando...</p>}
      {msg && <p className={styles.msg}>{msg}</p>}
      <ul className={styles.listaCategorias}>
        {categorias.map((cat) => (
          <li key={cat.id} className={styles.item}>
            <span className={styles.nomeCategoria}>{cat.nome}</span>
            <div className={styles.botoesCategoria}>
              <button
                className={`${styles.button} ${styles.apagar}`}
                onClick={() => handleDelete(cat.id)}
              >
                Apagar
              </button>
              <button
                className={`${styles.button} ${styles.editar}`}
                onClick={() => handleEditar(cat.id)}
              >
                Editar
              </button>
            </div>
          </li>
        ))}
      </ul>
      {editandoId && (
        <form
          className={styles.form}
          onSubmit={handleSalvar}
          style={{ marginTop: 24 }}
        >
          <h3 className={styles.titulo}>Editar Categoria</h3>
          <label className={styles.label}>
            Nome
            <input
              className={styles.input}
              type="text"
              value={formCategoria.nome}
              onChange={(e) =>
                setFormCategoria((f) => ({ ...f, nome: e.target.value }))
              }
              required
            />
          </label>
          <label className={styles.label}>
            Descrição
            <textarea
              className={styles.textarea}
              value={formCategoria.descricao}
              onChange={(e) =>
                setFormCategoria((f) => ({ ...f, descricao: e.target.value }))
              }
              required
            />
          </label>
          <button
            className={styles.button}
            type="submit"
            disabled={loadingForm}
          >
            {loadingForm ? "Salvando..." : "Salvar"}
          </button>
          <button
            className={styles.button}
            type="button"
            style={{ background: "#aaa", marginLeft: 8 }}
            onClick={() => setEditandoId(null)}
          >
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
}
