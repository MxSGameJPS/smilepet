"use client";
import { useState } from "react";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import styles from "./register.module.css";
import PlanoAssinatura from "@/components/PlanoAssinatura/planoAssinatura";

export default function RegisterPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [aceite, setAceite] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!aceite) {
      alert("Você precisa aceitar os termos para se cadastrar.");
      return;
    }
    // Simulação de cadastro
    alert("Cadastro realizado com sucesso!");
  }

  return (
    <div>
      <Header />
      <PlanoAssinatura />
      <main className={styles.registerContainer}>
        <h1 className={styles.registerTitulo}>Cadastro</h1>
        <form className={styles.registerForm} onSubmit={handleSubmit}>
          <label>
            Nome
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Senha
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </label>
          <label className={styles.termosLabel}>
            <input
              type="checkbox"
              checked={aceite}
              onChange={(e) => setAceite(e.target.checked)}
            />
            Aceito os termos de uso
          </label>
          <button className={styles.registerBtn} type="submit">
            Cadastrar
          </button>
        </form>
        <div className={styles.registerLinks}>
          <span>
            Já é nosso cliente? <a href="/login">Faça o Login</a>
          </span>
        </div>
      </main>
      <Footer />
    </div>
  );
}
