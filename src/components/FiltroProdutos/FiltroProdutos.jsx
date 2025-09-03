"use client";
import React, { useEffect, useState } from "react";
import styles from "./FiltroProdutos.module.css";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const categoriasCaes = [
  "Ração para Cachorro",
  "Ração Úmida para Cães",
  "Petiscos Dog",
  "Higiene e Cuidados para Cães",
];
const marcasCaes = [
  "Pro Plan",
  "ONE",
  "Kanina",
  "DentaLife",
  "Dog Chow",
  "Doguitos",
  "Special Croc",
  "Allcanis",
  "Nutribene",
  "PetCare",
  "Qualiday",
  "Prohealth",
];
const categoriasGatos = [
  "Ração para Gatos",
  "Ração Úmida para Gatos",
  "Petiscos Cat",
  "Higiene e Cuidados para Gatos",
];
const marcasGatos = [
  "Pro Plan",
  "ONE",
  "Fancy Feast",
  "Cat Chow",
  "Friskies",
  "DentaLife",
  "Gatsy",
  "Special Croc",
  "Allcanis",
  "PetCare",
  "Qualiday",
  "Prohealth",
  "Tidy Cat",
  "Mandiocat",
  "Praticat",
  "Pellets",
];

function FiltroProdutos() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [selectedCategorias, setSelectedCategorias] = useState([]);
  const [selectedMarcas, setSelectedMarcas] = useState([]);

  useEffect(() => {
    // Define categorias e marcas fixas conforme rota
    if (pathname.includes("caes")) {
      setCategorias(categoriasCaes);
      setMarcas(marcasCaes);
    } else if (pathname.includes("gatos")) {
      setCategorias(categoriasGatos);
      setMarcas(marcasGatos);
    } else {
      setCategorias([]);
      setMarcas([]);
    }
  }, [pathname]);

  const handleCategoriaChange = (cat) => {
    setSelectedCategorias((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };
  const handleMarcaChange = (marca) => {
    setSelectedMarcas((prev) =>
      prev.includes(marca) ? prev.filter((m) => m !== marca) : [...prev, marca]
    );
  };
  const limparFiltros = () => {
    setSelectedCategorias([]);
    setSelectedMarcas([]);
    router.replace(pathname);
  };
  const aplicarFiltros = () => {
    const params = new URLSearchParams();
    if (selectedCategorias.length)
      params.set("categoria", selectedCategorias.join(","));
    if (selectedMarcas.length) params.set("marca", selectedMarcas.join(","));
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <aside className={styles.filtroContainer}>
      <div className={styles.titulo}>Filtrar Produtos:</div>
      <button className={styles.limparBtn} onClick={limparFiltros}>
        Limpar filtros
      </button>
      <hr />
      <div className={styles.section}>
        <div className={styles.subtitulo}>Categorias:</div>
        {categorias.map((cat) => (
          <label key={cat} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={selectedCategorias.includes(cat)}
              onChange={() => handleCategoriaChange(cat)}
            />
            {cat}
          </label>
        ))}
      </div>
      <hr />
      <div className={styles.section}>
        <div className={styles.subtitulo}>Marcas:</div>
        {marcas.map((marca) => (
          <label key={marca} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={selectedMarcas.includes(marca)}
              onChange={() => handleMarcaChange(marca)}
            />
            {marca}
          </label>
        ))}
      </div>
      <hr />
      <button className={styles.filtrarBtn} onClick={aplicarFiltros}>
        Filtrar
      </button>
    </aside>
  );
}

export default FiltroProdutos;
