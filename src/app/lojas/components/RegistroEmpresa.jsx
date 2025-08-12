import { useState } from "react";
import styles from "./RegistroEmpresa.module.css";

export default function RegistroEmpresa({ onVoltar }) {
  const [cnpj, setCnpj] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegistro(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    // Aqui você pode integrar com a API de registro de empresas
    setTimeout(() => {
      setLoading(false);
      setMsg("Registro de empresa não implementado (exemplo)");
    }, 1200);
  }

  return (
    <form className={styles.container} onSubmit={handleRegistro}>
      <h2 className={styles.titulo}>Cadastro de Empresa (CNPJ)</h2>
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
        Razão Social
        <input
          className={styles.input}
          type="text"
          value={razaoSocial}
          onChange={(e) => setRazaoSocial(e.target.value)}
          required
        />
      </label>
      <label className={styles.label}>
        E-mail
        <input
          className={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        {loading ? "Cadastrando..." : "Cadastrar"}
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
