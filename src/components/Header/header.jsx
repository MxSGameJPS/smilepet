import Image from "next/image";
import {
  FaStore,
  FaHeart,
  FaUser,
  FaShoppingCart,
  FaRegCreditCard,
} from "react-icons/fa";
import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={styles.headerV2}>
      <div className={styles.headerRow}>
        <div className={styles.logoArea}>
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
            <a href="#assinaturas">Planos de Assinatura</a>
            <a href="#caes">Cachorros</a>
            <a href="#gatos">Gatos</a>
            <a href="#promocoes">Promoções</a>
            <a href="#lojas">Nossas Lojas</a>
          </nav>
        </div>
        <div className={styles.headerIcons}>
          <FaStore title="Lojas" />
          <FaHeart title="Favoritos" />
          <FaRegCreditCard title="Planos" />
          <FaUser title="Conta" />
          <div className={styles.cartIconWrap}>
            <FaShoppingCart title="Carrinho" />
            <span className={styles.cartBadge}>0</span>
          </div>
        </div>
      </div>
    </header>
  );
}
