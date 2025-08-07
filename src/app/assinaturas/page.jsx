"use client";

import Header from "@/components/Header/header";
import Image from "next/image";
import styles from "./assinaturas.module.css";

const banners = [
  "/image/banner1.png",
  "/image/banner2.png",
  "/image/banner3.png",
];
function getRandomBanner() {
  return banners[Math.floor(Math.random() * banners.length)];
}

const depoimentos = [
  {
    nome: "Vivian Rodrigues Franco",
    local: "São Paulo/SP",
    texto:
      "A assinatura é ótima! Temos diversos benefícios como a otimização do nosso tempo.",
    img: "/mocks/produtos.png",
  },
  {
    nome: "Pedro H. Carvalho Fonseca",
    local: "São Bernardo do Campo/SP",
    texto:
      "É ótima! Consigo atualizar as datas com facilidade e as compras chegam sempre muito rápidas!",
    img: "/mocks/produtos.png",
  },
  {
    nome: "Paolo Mastella",
    local: "São Bernardo do Campo/SP",
    texto:
      "SmilePet sempre oferecendo ótimos produtos e preços acessíveis para nossos amigos de 4 patas.",
    img: "/mocks/produtos.png",
  },
  {
    nome: "Cristiane Santos de Sá",
    local: "São Bernardo do Campo/SP",
    texto:
      "Gosto da assinatura, porque me dá desconto em todas as minhas compras e facilidade para as futuras.",
    img: "/mocks/produtos.png",
  },
  {
    nome: "Sandra Gomes Guarino",
    local: "São Bernardo do Campo/SP",
    texto:
      "Estamos muito satisfeitos com a SmilePet, nossos pedidos sempre chegam no tempo certinho.",
    img: "/mocks/produtos.png",
  },
  {
    nome: "Adna Vitória Silva Araujo",
    local: "São Bernardo do Campo/SP",
    texto:
      "Ótima experiência e muita praticidade, sem contar com os ótimos descontos!",
    img: "/mocks/produtos.png",
  },
];

const faq = [
  {
    pergunta: "Tem custo para fechar uma assinatura na SmilePet?",
    resposta: "Não! Você pode assinar, pausar ou cancelar sem custo extra.",
  },
  {
    pergunta: "Como eu tenho acesso aos meus benefícios de assinante?",
    resposta: "Basta acessar sua conta SmilePet e gerenciar sua assinatura.",
  },
  {
    pergunta: "Posso fazer mais de uma assinatura?",
    resposta:
      "Sim! Você pode criar quantas assinaturas quiser para diferentes produtos.",
  },
  {
    pergunta: "O desconto de assinante é válido para todos os produtos?",
    resposta:
      "O desconto é válido para produtos selecionados e não é cumulativo com outras promoções.",
  },
  {
    pergunta: "Como eu consigo frete grátis?",
    resposta:
      "Consulte as condições de frete grátis na página de assinaturas SmilePet.",
  },
];

export default function AssinaturasPage() {
  return (
    <>
      <Header />
      <section className={styles.heroSection}>
        <Image
          src={getRandomBanner()}
          alt="Banner Hero"
          fill
          style={{ objectFit: "cover" }}
          className={styles.heroImg}
        />
      </section>
      <div className={styles.heroTextBox}>
        <h1 className={styles.heroTitle}>Assinatura SmilePet</h1>
        <h2 className={styles.heroSubtitle}>
          Descomplique seu dia a dia.
          <br />
          Tenha tudo pro seu pet, sempre.
        </h2>
        <p className={styles.heroDesc}>
          Compra programada, sem custo, sem mensalidade.
          <br />
          Fácil assim.
        </p>
      </div>
      <main className={styles.container}>
        <section className={styles.beneficiosSection}>
          <h2 className={styles.sectionTitle}>
            Vantagens de ser Assinante SmilePet
          </h2>
          <div className={styles.beneficiosCards}>
            <div className={styles.beneficioCard}>
              <img
                src="/mocks/tag-icon.png"
                alt="Desconto"
                className={styles.beneficioIcon}
              />
              <div className={styles.beneficioTitulo}>10% OFF*</div>
              <div className={styles.beneficioTexto}>
                em todas as compras no app, site e lojas físicas
              </div>
            </div>
            <div className={styles.beneficioCard}>
              <img
                src="/mocks/tag-icon.png"
                alt="Banho e Tosa"
                className={styles.beneficioIcon}
              />
              <div className={styles.beneficioTitulo}>10% OFF</div>
              <div className={styles.beneficioTexto}>
                em todos os serviços de banho e tosa
              </div>
            </div>
            <div className={styles.beneficioCard}>
              <img
                src="/mocks/tag-icon.png"
                alt="Receba quando quiser"
                className={styles.beneficioIcon}
              />
              <div className={styles.beneficioTitulo}>Receba quando quiser</div>
              <div className={styles.beneficioTexto}>
                Escolha a frequência de envio
              </div>
            </div>
            <div className={styles.beneficioCard}>
              <img
                src="/mocks/tag-icon.png"
                alt="Sem mensalidade"
                className={styles.beneficioIcon}
              />
              <div className={styles.beneficioTitulo}>Sem mensalidade</div>
              <div className={styles.beneficioTexto}>
                Assine e cancele sem custo
              </div>
            </div>
          </div>
          <div className={styles.beneficioObs}>
            *O desconto de 10% no app, site e lojas físicas não é cumulativo com
            outras promoções e cupons.
          </div>
        </section>
        <section className={styles.comoAltereSection}>
          <div className={styles.comoAltereGrid}>
            <div className={styles.comoBox}>
              <h2 className={styles.sectionTitle}>
                Saiba como fazer sua Assinatura SmilePet:
              </h2>
              <div className={styles.comoStepsGrid}>
                <div className={styles.comoStep}>
                  <div className={styles.comoStepNum}>1</div>
                  <div className={styles.comoStepText}>
                    Adicione na sacola os produtos que quer assinar e clique em
                    Assinar produto.
                  </div>
                </div>
                <div className={styles.comoStep}>
                  <div className={styles.comoStepNum}>2</div>
                  <div className={styles.comoStepText}>
                    Depois, escolha a frequência que quer receber os produtos.
                  </div>
                </div>
                <div className={styles.comoStep}>
                  <div className={styles.comoStepNum}>3</div>
                  <div className={styles.comoStepText}>
                    Ao finalizar o pagamento, a assinatura é concluída.
                  </div>
                </div>
                <div className={styles.comoStep}>
                  <div className={styles.comoStepNum}>4</div>
                  <div className={styles.comoStepText}>
                    Agora, você receberá seus produtos de forma programada.
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.altereBox}>
              <h2 className={styles.sectionTitle}>
                Altere na hora que quiser:
              </h2>
              <div className={styles.altereCardsGrid}>
                <div className={styles.altereCard}>
                  <img
                    src="/mocks/tag-icon.png"
                    alt="Dia de envio"
                    className={styles.altereIcon}
                  />
                  <div className={styles.altereText}>
                    o dia de envio dos produtos
                  </div>
                </div>
                <div className={styles.altereCard}>
                  <img
                    src="/mocks/tag-icon.png"
                    alt="Retire ou adicione"
                    className={styles.altereIcon}
                  />
                  <div className={styles.altereText}>
                    retire ou adicione mais itens
                  </div>
                </div>
                <div className={styles.altereCard}>
                  <img
                    src="/mocks/tag-icon.png"
                    alt="Data da cobrança"
                    className={styles.altereIcon}
                  />
                  <div className={styles.altereText}>a data da cobrança</div>
                </div>
                <div className={styles.altereCard}>
                  <img
                    src="/mocks/tag-icon.png"
                    alt="Dados de pagamento"
                    className={styles.altereIcon}
                  />
                  <div className={styles.altereText}>os dados de pagamento</div>
                </div>
                <div className={styles.altereCard}>
                  <img
                    src="/mocks/tag-icon.png"
                    alt="Endereço de entrega"
                    className={styles.altereIcon}
                  />
                  <div className={styles.altereText}>o endereço de entrega</div>
                </div>
                <div className={styles.altereCard}>
                  <img
                    src="/mocks/tag-icon.png"
                    alt="Pausar ou cancelar"
                    className={styles.altereIcon}
                  />
                  <div className={styles.altereText}>
                    pause ou cancele sem custo a assinatura
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.depoimentosSection}>
          <h2 className={styles.sectionTitle}>
            Confira os depoimentos de quem já assina
          </h2>
          <div className={styles.depoimentosGrid}>
            {depoimentos.map((d, idx) => (
              <div key={idx} className={styles.depoimentoCard}>
                <img
                  src={d.img}
                  alt={d.nome}
                  className={styles.depoimentoImg}
                />
                <p className={styles.depoimentoTexto}>“{d.texto}”</p>
                <span className={styles.depoimentoNome}>{d.nome}</span>
                <span className={styles.depoimentoLocal}>{d.local}</span>
              </div>
            ))}
          </div>
        </section>
        <section className={styles.faqSection}>
          <h2 className={styles.sectionTitle}>Dúvidas Frequentes</h2>
          <div className={styles.faqGrid}>
            {faq.map((f, idx) => (
              <div key={idx} className={styles.faqCard}>
                <h3 className={styles.faqPergunta}>{f.pergunta}</h3>
                <p className={styles.faqResposta}>{f.resposta}</p>
              </div>
            ))}
          </div>
        </section>
        <section className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>
            Comece agora sua assinatura SmilePet!
          </h2>
          <button className={styles.ctaBtn}>Quero assinar</button>
        </section>
      </main>
      <footer className={styles.footer}>
        <span>Smile Pet &copy; {new Date().getFullYear()}</span>
      </footer>
    </>
  );
}
