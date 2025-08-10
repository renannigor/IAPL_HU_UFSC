import db from "../config/db.js";

const DadosFormLesaoModel = {
  async getEtiologias() {
    const result = await db.query("SELECT * FROM etiologias ORDER BY id");
    return result.rows;
  },

  async getClassificacoesLesaoPressao() {
    const result = await db.query(
      "SELECT * FROM classificacoes_lesao_por_pressao ORDER BY id"
    );
    return result.rows;
  },

  async getRegioesPerilesionais() {
    const result = await db.query(
      "SELECT * FROM regioes_perilesionais ORDER BY id"
    );
    return result.rows;
  },

  async getIdOpcaoOutro(tabela) {
    const result = await db.query(
      `SELECT id FROM ${tabela} WHERE nome = 'Outro'`
    );

    const resultOutro = result.rows[0].id ?? null;
    return resultOutro;
  },

  async getRegiaoPerilesional(id) {
    const result = await db.query(
      "SELECT * FROM regioes_perilesionais WHERE id = $1",
      [id]
    );
    return result.rows;
  },

  async getBordas() {
    const result = await db.query("SELECT * FROM bordas ORDER BY id");
    return result.rows;
  },

  async getEstruturasNobres() {
    const result = await db.query(
      "SELECT * FROM estruturas_nobres ORDER BY id"
    );
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
    const result = await db.query("SELECT * FROM tecidos ORDER BY id");
    return result.rows;
  },

  async getTecidoNome(id) {
    const result = await db.query("SELECT * FROM tecidos WHERE id = $1", [id]);
    return result.rows[0].nome;
  },

  async getClassificacoesDor() {
    const result = await db.query(
      "SELECT * FROM classificacoes_dor ORDER BY id"
    );
    return result.rows;
  },

  async getQuantidadesExsudato() {
    const result = await db.query(
      "SELECT * FROM quantidades_exsudato ORDER BY id"
    );
    return result.rows;
  },

  async getQuantidadeExsudatoNome(id) {
    const result = await db.query(
      "SELECT * FROM quantidades_exsudato WHERE id = $1",
      [id]
    );
    return result.rows[0].nome;
  },

  async getTiposExsudato() {
    const result = await db.query("SELECT * FROM tipos_exsudato ORDER BY id");
    return result.rows;
  },

  async getTipoExsudatoNome(id) {
    const result = await db.query(
      "SELECT * FROM tipos_exsudato WHERE id = $1",
      [id]
    );
    return result.rows[0].nome;
  },

  async getOdores() {
    const result = await db.query("SELECT * FROM odores ORDER BY id");
    return result.rows;
  },

  async getOdorNome(id) {
    const result = await db.query("SELECT * FROM odores WHERE id = $1", [id]);
    return result.rows[0].nome;
  },

  async getLimpezas() {
    const result = await db.query("SELECT * FROM limpezas ORDER BY id");
    return result.rows;
  },

  async getLimpeza(id) {
    const result = await db.query("SELECT * FROM limpezas WHERE id = $1", [id]);
    return result.rows;
  },

  async getDesbridamentos() {
    const result = await db.query("SELECT * FROM desbridamentos ORDER BY id");
    return result.rows;
  },

  async getDesbridamento(id) {
    const result = await db.query(
      "SELECT * FROM desbridamentos WHERE id = $1",
      [id]
    );
    return result.rows;
  },

  async getProtecoes() {
    const result = await db.query("SELECT * FROM protecoes ORDER BY id");
    return result.rows;
  },

  async getProtecao(id) {
    const result = await db.query("SELECT * FROM protecoes WHERE id = $1", [
      id,
    ]);
    return result.rows;
  },

  async getCoberturas() {
    const result = await db.query("SELECT * FROM coberturas ORDER BY id");
    return result.rows;
  },

  async getCoberturaNome(id) {
    const result = await db.query("SELECT * FROM coberturas WHERE id = $1", [
      id,
    ]);
    return result.rows[0].nome;
  },

  async getTiposFechamentoCurativo() {
    const result = await db.query(
      "SELECT * FROM tipos_fechamento_curativo ORDER BY id"
    );
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
