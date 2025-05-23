import db from "../config/db.js";

class DadosFormLesaoModel {
  static async getEtiologias() {
    const result = await db.query("SELECT * FROM etiologias");
    return result.rows;
  }

  static async getClassificacoesLesaoPressao() {
    const result = await db.query(
      "SELECT * FROM classificacoes_lesao_por_pressao"
    );
    return result.rows;
  }

  static async getRegioesPerilesionais() {
    const result = await db.query("SELECT * FROM regioes_perilesionais");
    return result.rows;
  }

  static async getBordas() {
    const result = await db.query("SELECT * FROM bordas");
    return result.rows;
  }

  static async getEstruturasNobres() {
    const result = await db.query("SELECT * FROM estruturas_nobres");
    return result.rows;
  }

  static async getQuantificacoesDor() {
    const result = await db.query("SELECT * FROM quantificacoes_dor");
    return result.rows;
  }

  static async getExsudatos() {
    const result = await db.query("SELECT * FROM exsudatos");
    return result.rows;
  }

  static async getTiposExsudato() {
    const result = await db.query("SELECT * FROM tipos_exsudato");
    return result.rows;
  }

  static async getOdores() {
    const result = await db.query("SELECT * FROM odores");
    return result.rows;
  }
}

export default DadosFormLesaoModel;
