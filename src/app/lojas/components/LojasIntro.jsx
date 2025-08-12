import styles from "./LojasIntro.module.css";

export default function LojasIntro({ onLogin, onRegister }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Compre no Atacado SmilePet</h2>
      <p className={styles.texto}>
        Tenha acesso a preços especiais e condições exclusivas para empresas!
        <br />
        Somente pessoas jurídicas com CNPJ podem comprar por atacado.
        <br />
        Cadastre sua empresa e aproveite os benefícios de ser um parceiro
        SmilePet.
      </p>
      <div className={styles.botoes}>
        <button className={styles.button} onClick={onLogin}>
          Tenho cadastro
        </button>
        <button className={styles.button} onClick={onRegister}>
          Não tenho cadastro
        </button>
      </div>
    </div>
  );
}
