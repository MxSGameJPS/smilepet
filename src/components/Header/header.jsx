"use client";
import { useState } from "react";
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
            src="/logo.jpeg"
            alt="Logo SmilePet"
            width={110}
            height={110}
            className={styles.logoHeaderV2}
          />
        </div>
        <div className={styles.centerArea}>
          <input
            className={styles.headerSearch}
            type="text"
            placeholder="O que seu Pet precisa?"
          />
          <nav className={styles.menuV2}>
            <Link href="#assinaturas">Planos de Assinatura</Link>
            <Link href="/caes">Cachorros</Link>
            <Link href="#gatos">Gatos</Link>
            <Link href="#promocoes">Promoções</Link>
            <Link href="#lojas">Nossas Lojas</Link>
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
              <Link href="#gatos" onClick={() => setMenuOpen(false)}>
                Gatos
              </Link>
              <Link href="#promocoes" onClick={() => setMenuOpen(false)}>
                Promoções
              </Link>
              <Link href="#lojas" onClick={() => setMenuOpen(false)}>
                Nossas Lojas
              </Link>
            </nav>
          )}
        </div>
        <div className={styles.headerIcons}>
          <FaStore title="Lojas" />
          <FaHeart title="Favoritos" />
          <FaRegCreditCard title="Planos" />
          <div className={styles.cartIconWrap}>
            <FaShoppingCart title="Carrinho" />
            <span className={styles.cartBadge}>0</span>
          </div>
          <FaUser title="Conta" />
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
