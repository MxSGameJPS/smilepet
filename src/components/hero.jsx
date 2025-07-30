"use client";
import React from "react";
import Image from "next/image";
import styles from "../app/page.module.css";

const banners = [
  { src: "/image/banner1.png", alt: "Banner 1" },
  { src: "/image/banner2.png", alt: "Banner 2" },
  { src: "/image/banner3.png", alt: "Banner 3" },
  { src: "/image/banner4.png", alt: "Banner 4" },
];

export default function Hero() {
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={styles.heroFullBanner}>
      <Image
        src={banners[index].src}
        alt={banners[index].alt}
        fill
        style={{ objectFit: "cover" }}
        className={styles.heroBannerImg}
        priority
      />
      {/* Indicadores do carrossel */}
      <div className={styles.heroIndicators}>
        {banners.map((_, i) => (
          <span
            key={i}
            className={i === index ? styles.heroDotActive : styles.heroDot}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
