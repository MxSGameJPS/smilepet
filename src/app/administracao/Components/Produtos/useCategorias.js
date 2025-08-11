import { useState, useEffect } from "react";

export default function useCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategorias() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          "https://apismilepet.vercel.app/api/categorias/produtos"
        );
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          // Garante que cada categoria tem id e nome
          setCategorias(
            data.map((cat) => ({
              id: cat.id,
              nome: cat.nome || cat.descricao || "Categoria",
            }))
          );
        } else {
          setCategorias([]);
          setError(data.message || "Erro ao buscar categorias");
        }
      } catch (err) {
        setCategorias([]);
        setError("Erro de conexão com a API");
      }
      setLoading(false);
    }
    fetchCategorias();
  }, []);

  return { categorias, loading, error };
}
