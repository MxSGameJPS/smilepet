import styles from "./footer.module.css";
import Image from "next/image";
import {
  FaInstagram,
  FaFacebookF,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDinersClub,
  FaLock,
} from "react-icons/fa";
import { SiLetsencrypt } from "react-icons/si";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Coluna 1: Logo, contato, redes sociais */}
        <div className={styles.footerCol}>
          <div className={styles.footerLogo}>
            <Image src="/logo.jpeg" alt="SmilePet" width={80} height={80} />
            <div>
              <div>contato@smilepet.com.br</div>
              <div>Telefone (21) 97666-3909</div>
            </div>
          </div>
          <div className={styles.footerSocial}>
            <a
              href="#"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={22} />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF size={22} />
            </a>
          </div>
        </div>
        {/* Coluna 2: Newsletter */}
        <div className={styles.footerCol}>
          <div className={styles.footerTitle}>NEWSLETTER</div>
          <div className={styles.footerNewsletter}>
            <input type="text" placeholder="Digite o seu nome" />
            <input type="email" placeholder="Digite o seu e-mail" />
            <button>✈</button>
          </div>
          <div style={{ fontSize: "0.85rem", color: "#888" }}>
            Ao enviar, você concorda em receber nossos e-mails e aceita nossos
            Termos de Uso e de Privacidade
          </div>
        </div>
        {/* Coluna 3: Sobre */}
        <div className={styles.footerCol}>
          <div className={styles.footerTitle}>Olá, somos a SmilePet:</div>
          <div
            style={{ color: "#444", fontSize: "1rem", marginBottom: "1.2rem" }}
          >
            A loja do seu animal! Nossa missão é trazer mais alegria, saúde e
            diversão para pets e famílias. Atendimento humanizado, produtos de
            qualidade e muito carinho para seu pet.
          </div>
        </div>
        {/* Coluna 4: Informações úteis */}
        <div className={styles.footerCol}>
          <div className={styles.footerTitle}>INFORMAÇÕES ÚTEIS</div>
          <ul className={styles.footerList}>
            <li>
              <a href="#">Sobre a Empresa</a>
            </li>
            <li>
              <a href="#">Nossas Lojas</a>
            </li>
            <li>
              <a href="#">Fale Conosco</a>
            </li>
            <li>
              <a href="#">Trabalhe Conosco</a>
            </li>
            <li>
              <a href="#">Regulamentos</a>
            </li>
            <li>
              <a href="#">Blog</a>
            </li>
          </ul>
        </div>
        {/* Coluna 5: Informações úteis 2 */}
        <div className={styles.footerCol}>
          <div className={styles.footerTitle}>INFORMAÇÕES ÚTEIS</div>
          <ul className={styles.footerList}>
            <li>
              <a href="#">Trocas e Devoluções</a>
            </li>
            <li>
              <a href="#">Formas de Pagamento</a>
            </li>
            <li>
              <a href="#">Perguntas Frequentes</a>
            </li>
            <li>
              <a href="#">Política de Frete</a>
            </li>
            <li>
              <a href="#">Política de Privacidade</a>
            </li>
          </ul>
        </div>
        {/* Coluna 6: Pagamento e segurança */}
        <div className={styles.footerCol}>
          <div className={styles.footerTitle}>FORMAS DE PAGAMENTO</div>
          <div className={styles.footerPagamentos}>
            <FaCcVisa size={48} title="Visa" />
            <FaCcMastercard size={48} title="Mastercard" />
            <FaCcAmex size={48} title="Amex" />
            <FaCcDinersClub size={48} title="Diners" />
          </div>
          <div className={styles.footerTitle}>SEGURANÇA</div>
          <div className={styles.footerSeguranca}>
            <SiLetsencrypt
              size={48}
              title="Let's Encrypt"
              style={{ marginRight: 8 }}
            />
            <FaLock size={32} title="Segurança" />
          </div>
        </div>
      </div>
      <div className={styles.footerCopy}>
        © {new Date().getFullYear()} SmilePet. Todos os direitos reservados.
      </div>
    </footer>
  );
}
