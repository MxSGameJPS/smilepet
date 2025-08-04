import styles from "./marcas.module.css";
import Image from "next/image";

const marcas = [
  { nome: "PremieRpet", src: "/marcas/premierpet.png" },
  { nome: "Mars Petcare", src: "/marcas/mars.png" },
  { nome: "Gran Plus", src: "/marcas/granplus.png" },
  { nome: "Purina", src: "/marcas/purina.png" },
  { nome: "Adimax", src: "/marcas/adimax.png" },
  { nome: "Bravecto", src: "/marcas/bravecto.png" },
  { nome: "Royal Canin", src: "/marcas/royalcanin.png" },
  { nome: "Farmina", src: "/marcas/farmina.png" },
  { nome: "Frontline", src: "/marcas/frontline.png" },
];

export default function Marcas() {
  return (
    <section className={styles.marcasSection}>
      <h2 className={styles.marcasTitle}>NAVEGUE PELAS MARCAS</h2>
      <div className={styles.marcasGrid}>
        {marcas.map((marca) => (
          <Image
            key={marca.nome}
            src={marca.src}
            alt={marca.nome}
            height={54}
            width={160}
            className={styles.marcaLogo}
          />
        ))}
      </div>
    </section>
  );
}
