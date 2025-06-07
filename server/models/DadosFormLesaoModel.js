import db from "../config/db.js";

const DadosFormLesaoModel = {
  async getEtiologias() {
    const result = await db.query("SELECT * FROM etiologias");
    return result.rows;
  },

  async getClassificacoesLesaoPressao() {
    const result = await db.query(
      "SELECT * FROM classificacoes_lesao_por_pressao"
    );
    return result.rows;
  },

  async getRegioesPerilesionais() {
    const result = await db.query("SELECT * FROM regioes_perilesionais");
    return result.rows;
  },

  async getRegiaoPerilesional(id) {
    const result = await db.query(
      "SELECT * FROM regioes_perilesionais WHERE id = $1",
      [id]
    );
    return result.rows;
  },

  async getBordas() {
    const result = await db.query("SELECT * FROM bordas");
    return result.rows;
  },

  async getEstruturasNobres() {
    const result = await db.query("SELECT * FROM estruturas_nobres");
    return result.rows;
  },

  async getEstruturaNobre(id) {
    const result = await db.query(
      "SELECT * FROM estruturas_nobres WHERE id = $1",
      [id]
    );
    return result.rows;
  },

  async getTecidos() {
    const result = await db.query("SELECT * FROM tecidos");
    return result.rows;
  },

  async getTecidoNome(id) {
    const result = await db.query("SELECT * FROM tecidos WHERE id = $1", [id]);
    return result.rows[0].nome;
  },

  async getQuantificacoesDor() {
    const result = await db.query("SELECT * FROM quantificacoes_dor");
    return result.rows;
  },

  async getExsudatos() {
    const result = await db.query("SELECT * FROM exsudatos");
    return result.rows;
  },

  async getTiposExsudato() {
    const result = await db.query("SELECT * FROM tipos_exsudato");
    return result.rows;
  },

  async getOdores() {
    const result = await db.query("SELECT * FROM odores");
    return result.rows;
  },

  async getLimpezas() {
    const result = await db.query("SELECT * FROM limpezas");
    return result.rows;
  },

  async getLimpeza(id) {
    const result = await db.query("SELECT * FROM limpezas WHERE id = $1", [id]);
    return result.rows;
  },

  async getDesbridamentos() {
    const result = await db.query("SELECT * FROM desbridamento");
    return result.rows;
  },

  async getDesbridamento(id) {
    const result = await db.query("SELECT * FROM desbridamento WHERE id = $1", [
      id,
    ]);
    return result.rows;
  },

  async getProtecoes() {
    const result = await db.query("SELECT * FROM protecoes");
    return result.rows;
  },

  async getProtecao(id) {
    const result = await db.query("SELECT * FROM protecoes WHERE id = $1", [
      id,
    ]);
    return result.rows;
  },

  async getCoberturas() {
    const result = await db.query("SELECT * FROM coberturas");
    return result.rows;
  },

  async getCoberturaNome(id) {
    const result = await db.query("SELECT * FROM coberturas WHERE id = $1", [
      id,
    ]);
    return result.rows[0].nome;
  },

  async getTiposFechamentoCurativo() {
    const result = await db.query("SELECT * FROM tipos_fechamento_curativo");
    return result.rows;
  },

  async getTipoFechamentoCurativoNome(id) {
    const result = await db.query(
      "SELECT * FROM tipos_fechamento_curativo WHERE id = $1",
      [id]
    );
    return result.rows[0].nome;
  },
};

export default DadosFormLesaoModel;
