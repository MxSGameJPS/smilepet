"use client";
import { useEffect, useState } from "react";

export default function SplashVideo({ duration = 7000 }) {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFade(true), duration - 800);
    const hideTimer = setTimeout(() => setShow(false), duration);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [duration]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        background: "#ffffff09",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <video
        src="/videos/Vídeo_Animado_de_Cão_e_Gato.mp4"
        autoPlay
        muted
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform:
            "translate(-50%, -50%) scale(" + (fade ? "0.7" : "1") + ")",
          width: "100vw",
          height: "100vh",
          objectFit: "contain",
          background: "#fff",
          opacity: fade ? 0 : 1,
          transition:
            "opacity 0.8s ease, transform 0.8s cubic-bezier(.4,2,.3,1)",
        }}
      />
    </div>
  );
}
