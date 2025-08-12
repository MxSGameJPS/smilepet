"use client";
import VariacoesProduto from "../Components/Produtos/VariacoesProduto";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function VariacoesContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [finalizado, setFinalizado] = useState(false);

  if (finalizado) {
    return (
      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
          padding: 32,
          textAlign: "center",
        }}
      >
        <h2>Produto e variações cadastrados com sucesso!</h2>
        <p>
          Você pode visualizar ou editar o produto e suas variações no painel
          administrativo.
        </p>
      </div>
    );
  }

  return (
    <VariacoesProduto
      produtoPai={{ id }}
      imagensPai={{ imagem_url: "", imagens_secundarias: [] }}
      onFinalizar={() => setFinalizado(true)}
    />
  );
}

export default function VariacoesPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <VariacoesContent />
    </Suspense>
  );
}
