"use client";

import { useState } from "react";
import LojasIntro from "./components/LojasIntro";
import LoginEmpresa from "./components/LoginEmpresa";
import RegistroEmpresa from "./components/RegistroEmpresa";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";

export default function LojasPage() {
  const [tela, setTela] = useState("intro");

  return (
    <>
    <Header />
      {tela === "intro" && (
        <LojasIntro
          onLogin={() => setTela("login")}
          onRegister={() => setTela("registro")}
        />
      )}
      {tela === "login" && <LoginEmpresa onVoltar={() => setTela("intro")} />}
      {tela === "registro" && (
        <RegistroEmpresa onVoltar={() => setTela("intro")} />
      )}
      <Footer />
    </>
  );
}
