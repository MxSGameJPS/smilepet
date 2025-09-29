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
      {/* circular wrapper */}
      <div
        style={{
          width: 620,
          height: 620,
          borderRadius: "50%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
          transform: "scale(" + (fade ? "0.7" : "1") + ")",
          opacity: fade ? 0 : 1,
          transition:
            "opacity 0.8s ease, transform 0.8s cubic-bezier(.4,2,.3,1)",
        }}
      >
        <video
          src="/videos/Vídeo_Animado_de_Cão_e_Gato.mp4"
          autoPlay
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}
