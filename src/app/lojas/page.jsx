"use client";

import Header from "@/components/Header/header";
import Image from "next/image";
import styles from "./lojas.module.css";

const banners = [
  "/image/banner1.png",
  "/image/banner2.png",
  "/image/banner3.png",
];
function getRandomBanner() {
  return banners[Math.floor(Math.random() * banners.length)];
}

const endereco = `Smile Pet E-Commerce LTDA\nEstrada Rio D'ouro 00801 Blc 1 Arm 1\nParque Columbia\nRio de Janeiro RJ\n21535-030`;
const enderecoGoogleMaps =
  "Estrada Rio D'ouro 801, Parque Columbia, Rio de Janeiro, RJ, 21535-030";

export default function LojasPage() {
  return (
    <>
      <Header />
      <section
        style={{
          width: "100%",
          height: 320,
          position: "relative",
        }}
      >
        <Image
          src={getRandomBanner()}
          alt="Banner Hero"
          fill
          style={{ objectFit: "cover" }}
        />
      </section>
      <div className={`${styles.container} ${styles.flexContainer}`}>
        <h2 className={styles.titulo}>Nossa Loja</h2>
        <div className={styles.enderecoBox}>
          <h3 className={styles.enderecoTitulo}>Endereço</h3>
          <pre className={styles.enderecoTexto}>{endereco}</pre>
        </div>
        <div className={styles.mapaBox}>
          <iframe
            title="Mapa Smile Pet"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              enderecoGoogleMaps
            )}&output=embed`}
            width="100%"
            height="320"
            style={{ border: 0, borderRadius: "12px" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <footer className={styles.footer}>
        <span>Smile Pet &copy; {new Date().getFullYear()}</span>
      </footer>
    </>
  );
}
