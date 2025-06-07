import db from "../config/db.js";

const TokenModel = {
  async criarToken(email, token, expires_at) {
    await db.query(
      `INSERT INTO TokensRedefinicaoSenha (email, token, expires_at) VALUES ($1, $2, $3)`,
      [email, token, expires_at]
    );
  },

  async buscarPorToken(token) {
    const { rows } = await db.query(
      `SELECT * FROM TokensRedefinicaoSenha WHERE token = $1 AND expires_at > NOW()`,
      [token]
    );
    return rows[0];
  },

  async excluirToken(token) {
    await db.query(`DELETE FROM TokensRedefinicaoSenha WHERE token = $1`, [
      token,
    ]);
  },
};

export default TokenModel;
