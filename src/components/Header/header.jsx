"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaStore,
  FaHeart,
  FaUser,
  FaShoppingCart,
  FaRegCreditCard,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import styles from "./header.module.css";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  // Atualiza o número do carrinho ao montar e quando localStorage muda
  useEffect(() => {
    function updateCartCount() {
      const itens = localStorage.getItem("carrinho");
      if (itens) {
        const arr = JSON.parse(itens);
        const total = arr.reduce(
          (acc, item) => acc + (item.quantidade || 1),
          0
        );
        setCartCount(total);
      } else {
        setCartCount(0);
      }
    }
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    // Atualiza também quando a página do carrinho faz alterações
    const interval = setInterval(updateCartCount, 500);
    return () => {
      window.removeEventListener("storage", updateCartCount);
      clearInterval(interval);
    };
  }, []);
  return (
    <header className={styles.headerV2}>
      <div className={styles.headerRow}>
        <div className={styles.logoArea}>
          {/* Botão hambúrguer só aparece em telas pequenas via CSS */}
          <button
            className={styles.hamburger}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuOpen((v) => !v)}
            type="button"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
          <Image
            src="/mocks/produtos.png"
            alt="Logo SmilePet"
            width={100}
            height={100}
            className={styles.logoHeaderV2}
            onClick={() => router.push("/")}
          />
        </div>
        <div className={styles.centerArea}>
          <input
            className={styles.headerSearch}
            type="text"
            placeholder="O que seu Pet precisa?"
          />
          <nav className={styles.menuV2}>
            <Link href="/assinaturas">Planos de Assinatura</Link>
            <div className={styles.menuDropdown}>
              <Link href="/caes" className={styles.menuDropdownTrigger}>
                Cachorros
              </Link>
              <div className={styles.menuDropdownContent}>
                <Link href="/caes?categoria=racao-umida">Ração úmida</Link>
                <Link href="/caes?categoria=snacks">Snacks</Link>
                <Link href="/caes?categoria=higiene">Higiene</Link>
              </div>
            </div>
            <div className={styles.menuDropdown}>
              <Link href="/gatos" className={styles.menuDropdownTrigger}>
                Gatos
              </Link>
              <div className={styles.menuDropdownContent}>
                <Link href="/gatos?categoria=racao-umida">Ração úmida</Link>
                <Link href="/gatos?categoria=snacks">Snacks</Link>
                <Link href="/gatos?categoria=higiene">Higiene</Link>
              </div>
            </div>
            <Link href="/promocoes">Promoções</Link>
            <Link href="/lojas">Nossas Lojas</Link>
          </nav>
          {/* Menu mobile, aparece só se menuOpen=true */}
          {menuOpen && (
            <nav className={styles.mobileMenu}>
              <Link href="#assinaturas" onClick={() => setMenuOpen(false)}>
                Planos de Assinatura
              </Link>
              <Link href="/caes" onClick={() => setMenuOpen(false)}>
                Cachorros
              </Link>
              <Link href="/gatos" onClick={() => setMenuOpen(false)}>
                Gatos
              </Link>
              <Link href="/promocoes" onClick={() => setMenuOpen(false)}>
                Promoções
              </Link>
              <Link href="/lojas" onClick={() => setMenuOpen(false)}>
                Nossas Lojas
              </Link>
            </nav>
          )}
        </div>
        <div className={styles.headerIcons}>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => router.push("/lojas")}
          >
            <FaStore title="Lojas" />
          </span>
          <FaHeart title="Favoritos" />
          <span
            style={{ cursor: "pointer" }}
            onClick={() => router.push("/assinaturas")}
          >
            <FaRegCreditCard title="Planos" />
          </span>
          <div
            className={styles.cartIconWrap}
            style={{ cursor: "pointer" }}
            onClick={() => router.push("/carrinho")}
            title="Ir para o carrinho"
          >
            <FaShoppingCart title="Carrinho" />
            <span className={styles.cartBadge}>{cartCount}</span>
          </div>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              const isLogged = localStorage.getItem("usuarioLogado") === "true";
              router.push(isLogged ? "/cliente" : "/login");
            }}
          >
            <FaUser title="Conta" />
          </span>
          <div className={styles.cartLoginContainer}>
            <span className={styles.cartLogin}>
              <Link href="/login">Entrar</Link>
            </span>
            <span className={styles.cartLogin}>
              <Link href="/register">Cadastrar</Link>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
