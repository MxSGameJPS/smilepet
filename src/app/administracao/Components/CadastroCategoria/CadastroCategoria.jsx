import { useState } from "react";
import styles from "./CadastroCategoria.module.css";

export default function CadastroCategoria() {
  const [formCategoria, setFormCategoria] = useState({
    nome: "",
    descricao: "",
  });
  const [msgCategoria, setMsgCategoria] = useState("");
  const [loadingCategoria, setLoadingCategoria] = useState(false);

  async function handleCadastrarCategoria(e) {
    e.preventDefault();
    setMsgCategoria("");
    setLoadingCategoria(true);
    try {
      const res = await fetch(
        "https://apismilepet.vercel.app/api/categorias/produtos",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formCategoria),
        }
      );
      if (res.ok) {
        setMsgCategoria("Categoria cadastrada com sucesso!");
        setFormCategoria({ nome: "", descricao: "" });
      } else {
        setMsgCategoria("Erro ao cadastrar categoria.");
      }
    } catch {
      setMsgCategoria("Erro de conexão com a API.");
    }
    setLoadingCategoria(false);
  }

  return (
    <form className={styles.container} onSubmit={handleCadastrarCategoria}>
      <h2 className={styles.titulo}>Cadastrar Categoria</h2>
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
        disabled={loadingCategoria}
      >
        {loadingCategoria ? "Cadastrando..." : "CADASTRAR"}
      </button>
      {msgCategoria && (
        <p
          className={`${styles.msg} ${
            msgCategoria.includes("sucesso") ? styles.sucesso : styles.erro
          }`}
        >
          {msgCategoria}
        </p>
      )}
    </form>
  );
}
