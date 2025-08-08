"use client";
import { useState } from "react";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import styles from "./login.module.css";
import PlanoAssinatura from "@/components/PlanoAssinatura/planoAssinatura";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // Mock de login
    if (email === "testesite@teste.com" && senha === "teste123") {
      alert("Login realizado! Bem-vindo à área do cliente.");
      window.location.href = "/cliente";
    } else {
      alert("Email ou senha inválidos!");
    }
  }

  return (
    <div>
      <Header />
      <PlanoAssinatura />
      <main className={styles.loginContainer}>
        <h1 className={styles.loginTitulo}>Login</h1>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
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
          <button className={styles.loginBtn} type="submit">
            Entrar
          </button>
        </form>
        <div className={styles.loginLinks}>
          <span>
            <a href="#">Esqueceu a senha?</a>
          </span>
          <span>
            Ainda não tem cadastro? <a href="/register">Cadastre-se!</a>
          </span>
        </div>
      </main>
      <Footer />
    </div>
  );
}
