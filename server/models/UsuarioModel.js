import db from "../config/db.js";

const Usuarios = {
  async getTiposUsuario() {
    const result = await db.query("SELECT * FROM tipos_usuario");
    return result.rows;
  },

  async getTipoUsuario(id) {
    const result = await db.query("SELECT * FROM tipos_usuario WHERE id = $1", [
      id,
    ]);
    return result.rows;
  },

  async verificaPermissaoAprovacao(id) {
    const result = await db.query(
      "SELECT nome FROM tipos_usuario WHERE id = $1",
      [id]
    );
    return result.rows[0].nome == "Acadêmico";
  },

  async getPorEmail(email) {
    const result = await db.query(
      `SELECT 
        cpf, nome, email, tipo_id, possui_acesso, senha, criado_em,
        TO_CHAR(ultimo_acesso, 'DD/MM/YYYY HH24:MI:SS') AS ultimo_acesso
       FROM Usuarios 
       WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  },

  async getPorCPF(cpf) {
    const result = await db.query(
      `
      SELECT 
       cpf, nome, email, tipo_id, possui_acesso, senha, criado_em,
       TO_CHAR(ultimo_acesso, 'DD/MM/YYYY HH24:MI:SS') AS ultimo_acesso
      FROM usuarios 
      WHERE cpf = $1`,
      [cpf]
    );
    return result.rows[0];
  },

  async criar(dados) {
    const { cpf, nome, email, tipo, senha } = dados;
    const result = await db.query(
      `INSERT INTO usuarios (cpf, nome, email, tipo_id, senha, possui_acesso, criado_em, ultimo_acesso) 
             VALUES ($1, $2, $3, $4, $5, false, NOW(), NOW()) RETURNING *`,
      [cpf, nome, email, tipo, senha]
    );
    return result.rows[0];
  },

  async atualizarUltimoAcesso(cpf) {
    await db.query("UPDATE usuarios SET ultimo_acesso = NOW() WHERE cpf = $1", [
      cpf,
    ]);
  },

  async atualizarSenha(email, novaSenha) {
    await db.query("UPDATE usuarios SET senha = $1 WHERE email = $2", [
      novaSenha,
      email,
    ]);
  },

  async excluirUsuario(cpf) {
    await db.query("DELETE FROM usuarios WHERE cpf = $1", [cpf]);
  },

  async atualizarPermissao(cpf, possui_acesso) {
    await db.query("UPDATE usuarios SET possui_acesso = $1 WHERE cpf = $2", [
      possui_acesso,
      cpf,
    ]);
  },

  async atualizarInfoPessoal(nome, tipo, cpf) {
    await db.query(
      "UPDATE usuarios SET nome = $1, tipo_id = $2 WHERE cpf = $3",
      [nome, tipo, cpf]
    );
  },
};

export default Usuarios;
