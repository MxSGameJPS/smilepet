import { useState } from "react";
import styles from "./LoginEmpresa.module.css";

export default function LoginEmpresa({ onVoltar }) {
  const [cnpj, setCnpj] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    // Aqui você pode integrar com a API de login de empresas
    setTimeout(() => {
      setLoading(false);
      setMsg("Login de empresa não implementado (exemplo)");
    }, 1200);
  }

  return (
    <form className={styles.container} onSubmit={handleLogin}>
      <h2 className={styles.titulo}>Login para Empresas (CNPJ)</h2>
      <label className={styles.label}>
        CNPJ
        <input
          className={styles.input}
          type="text"
          value={cnpj}
          onChange={(e) => setCnpj(e.target.value)}
          required
        />
      </label>
      <label className={styles.label}>
        Senha
        <input
          className={styles.input}
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
      </label>
      <button className={styles.button} type="submit" disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </button>
      <button
        className={styles.button}
        type="button"
        style={{ background: "#aaa", marginLeft: 8 }}
        onClick={onVoltar}
      >
        Voltar
      </button>
      {msg && <p className={styles.msg}>{msg}</p>}
    </form>
  );
}
