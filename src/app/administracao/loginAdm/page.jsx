"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./loginAdm.module.css";

export default function LoginAdm() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    try {
      const res = await fetch(
        "https://apismilepet.vercel.app/api/usuarios/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ login, senha }),
        }
      );
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("adm_token", data.token);
        router.push("/administracao");
      } else {
        setErro(data.message || "Login inválido");
      }
    } catch (err) {
      setErro("Erro ao conectar à API");
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Painel Administrativo - Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuário"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Entrar
        </button>
        {erro && <p className={styles.error}>{erro}</p>}
      </form>
    </div>
  );
}
