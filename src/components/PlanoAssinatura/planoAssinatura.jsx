
import styles from "./planoAssinatura.module.css";
import Image from "next/image";

export default function PlanoAssinatura() {
  return (
    <section className={styles.planoContainer}>
      <Image
        src="/image/planoDeAssinatura.png"
        alt="Plano de Assinatura"
        width={420}
        height={220}
        className={styles.planoImg}
      />
      <div className={styles.planoInfo}>
        <div className={styles.planoTitle}>
          Mais diversão, menos tédio! Transforme a rotina do seu pet!
        </div>
        <div className={styles.planoText}>
          Brinquedos, petiscos e novidades desenvolvidos por especialistas para
          o perfil do seu peludo. Aproveite a edição especial com brinquedos
          oficiais Superman.
        </div>
        <button className={styles.planoBtn}>Eu quero</button>
      </div>
    </section>
  );
}
