"use client";
import { useState } from "react";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import styles from "./cliente.module.css";

const abaCampos = [
  { label: "CEP", name: "cep" },
  { label: "UF", name: "uf" },
  { label: "Cidade", name: "cidade" },
  { label: "Bairro", name: "bairro" },
  { label: "Endereço", name: "endereco" },
  { label: "Número", name: "numero" },
  { label: "Complemento", name: "complemento" },
];

export default function ClientePage() {
  const [abaEndereco, setAbaEndereco] = useState("geral");
  const [abaMenu, setAbaMenu] = useState("dados");
  // Mock de pedidos usando produtos.json
  const produtosFicticios = [
    {
      numero: "1234143145",
      status: "entregue",
      produto: {
        nome: "15 Ração Fancy Feast Casserole Atum E Salmão Gato Adulto 85g",
        imagem_url: "/mocks/produtos.png",
        preco: 78.9,
      },
      data: "08/07/2025",
      valor: 78.9,
    },
    {
      numero: "13243142345",
      status: "aguardando pagamento",
      produto: {
        nome: "15 Ração Úmida Dog Chow Frango Ao Molho P Cães Filhotes 100g",
        imagem_url: "/mocks/produtos.png",
        preco: 42.99,
      },
      data: "07/07/2025",
      valor: 42.99,
    },
    {
      numero: "1231432341",
      status: "cancelado",
      produto: {
        nome: "15 Ração Úmida Friskies Sabor Peixe Branco Gatos Adultos 85g",
        imagem_url: "/mocks/produtos.png",
        preco: 47.0,
      },
      data: "05/07/2025",
      valor: 47.0,
    },
    {
      numero: "12343453252",
      status: "a caminho",
      produto: {
        nome: "20 Petisco Dog Chow Saúde Oral Adultos Minis & Pequenos 105g",
        imagem_url: "/mocks/produtos.png",
        preco: 269.99,
      },
      data: "06/07/2025",
      valor: 269.99,
    },
  ];
  const [form, setForm] = useState({
    nome: "",
    fantasia: "",
    tipoPessoa: "fisica",
    cpfCnpj: "",
    inscricaoEstadual: "",
    rg: "",
    orgaoEmissor: "",
    enderecoGeral: {},
    enderecoCobranca: {},
    contato: {
      info: "",
      pessoa: "",
      celular: "",
      email: "",
    },
  });

  function handleChange(e, grupo = null, aba = null) {
    const { name, value } = e.target;
    if (grupo === "endereco") {
      setForm((prev) => ({
        ...prev,
        [aba === "geral" ? "enderecoGeral" : "enderecoCobranca"]: {
          ...prev[aba === "geral" ? "enderecoGeral" : "enderecoCobranca"],
          [name]: value,
        },
      }));
    } else if (grupo === "contato") {
      setForm((prev) => ({
        ...prev,
        contato: { ...prev.contato, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleLogout() {
    alert("Logout realizado!");
    window.location.href = "/login";
  }

  return (
    <div>
      <Header />
      <div className={styles.clienteLayout}>
        <aside className={styles.menuAside}>
          <button
            className={styles.menuBtn}
            onClick={() => setAbaMenu("pedidos")}
          >
            Pedidos realizados
          </button>
          <button
            className={styles.menuBtn}
            onClick={() => setAbaMenu("dados")}
          >
            Meus dados
          </button>
          <button className={styles.menuBtn} onClick={handleLogout}>
            Sair
          </button>
        </aside>
        <main className={styles.clienteMain}>
          {abaMenu === "pedidos" ? (
            <div>
              <h2 className={styles.sectionTitulo}>Pedidos realizados</h2>
              <ul className={styles.pedidosLista}>
                {produtosFicticios.map((pedido) => (
                  <li key={pedido.numero} className={styles.pedidoItem}>
                    <img
                      src={pedido.produto.imagem_url}
                      alt={pedido.produto.nome}
                      className={styles.pedidoImagem}
                    />
                    <div className={styles.pedidoInfoWrap}>
                      <span className={styles.pedidoNum}>
                        Pedido nº {pedido.numero}
                      </span>
                      <span className={styles.pedidoNome}>
                        {pedido.produto.nome}
                      </span>
                      <span className={styles.pedidoData}>
                        Data: {pedido.data}
                      </span>
                      <span className={styles.pedidoValor}>
                        Valor: R$ {pedido.valor.toFixed(2)}
                      </span>
                    </div>
                    <span
                      className={
                        styles.pedidoStatus +
                        " " +
                        styles["status-" + pedido.status.replace(/\s/g, "")]
                      }
                    >
                      {pedido.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <h2 className={styles.sectionTitulo}>Dados Cadastrais</h2>
              <form className={styles.dadosForm}>
                <label>
                  Nome*
                  <input
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Fantasia
                  <input
                    name="fantasia"
                    value={form.fantasia}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Tipo de pessoa
                  <select
                    name="tipoPessoa"
                    value={form.tipoPessoa}
                    onChange={handleChange}
                  >
                    <option value="fisica">Pessoa Física</option>
                    <option value="juridica">Pessoa Jurídica</option>
                  </select>
                </label>
                <label>
                  CPF ou CNPJ*
                  <input
                    name="cpfCnpj"
                    value={form.cpfCnpj}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Inscrição Estadual
                  <input
                    name="inscricaoEstadual"
                    value={form.inscricaoEstadual}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  RG
                  <input name="rg" value={form.rg} onChange={handleChange} />
                </label>
                <label>
                  Orgão emissor
                  <input
                    name="orgaoEmissor"
                    value={form.orgaoEmissor}
                    onChange={handleChange}
                  />
                </label>
              </form>
              <h2 className={styles.sectionTitulo}>Endereço</h2>
              <div className={styles.abasWrap}>
                <button
                  className={
                    abaEndereco === "geral" ? styles.abaBtnAtiva : styles.abaBtn
                  }
                  onClick={() => setAbaEndereco("geral")}
                  type="button"
                >
                  Geral
                </button>
                <button
                  className={
                    abaEndereco === "cobranca"
                      ? styles.abaBtnAtiva
                      : styles.abaBtn
                  }
                  onClick={() => setAbaEndereco("cobranca")}
                  type="button"
                >
                  Cobrança
                </button>
              </div>
              <form className={styles.enderecoForm}>
                {abaCampos.map((campo) => (
                  <label key={campo.name}>
                    {campo.label}
                    <input
                      name={campo.name}
                      value={
                        abaEndereco === "geral"
                          ? form.enderecoGeral[campo.name] || ""
                          : form.enderecoCobranca[campo.name] || ""
                      }
                      onChange={(e) => handleChange(e, "endereco", abaEndereco)}
                    />
                  </label>
                ))}
              </form>
              <h2 className={styles.sectionTitulo}>Contato</h2>
              <form className={styles.contatoForm}>
                <label>
                  Informação de contato
                  <input
                    name="info"
                    value={form.contato.info}
                    onChange={(e) => handleChange(e, "contato")}
                  />
                </label>
                <label>
                  Pessoa de contato
                  <input
                    name="pessoa"
                    value={form.contato.pessoa}
                    onChange={(e) => handleChange(e, "contato")}
                  />
                </label>
                <label>
                  Celular
                  <input
                    name="celular"
                    value={form.contato.celular}
                    onChange={(e) => handleChange(e, "contato")}
                  />
                </label>
                <label>
                  Email
                  <input
                    name="email"
                    value={form.contato.email}
                    onChange={(e) => handleChange(e, "contato")}
                  />
                </label>
              </form>
            </>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
