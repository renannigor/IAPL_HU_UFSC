import db from "../config/db.js";

const Usuarios = {
  async buscarTiposUsuario() {
    const result = await db.query("SELECT * FROM tipos_usuario");
    return result.rows;
  },

  async buscarTipoUsuario(id) {
    const result = await db.query("SELECT * FROM tipos_usuario WHERE id = $1", [
      id,
    ]);
    return result.rows;
  },

  async buscarPorEmail(email) {
    const result = await db.query("SELECT * FROM Usuarios WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  },

  async buscarPorCPF(cpf) {
    const result = await db.query("SELECT * FROM usuarios WHERE cpf = $1", [
      cpf,
    ]);
    return result.rows[0];
  },

  async criar(dados) {
    const { cpf, nome, email, tipo, senha } = dados;
    const result = await db.query(
      `INSERT INTO usuarios (cpf, nome, email, tipo_id, senha, admin, possui_acesso, online, criado_em, ultimo_acesso) 
             VALUES ($1, $2, $3, $4, $5, false, false, true, NOW(), NOW()) RETURNING *`,
      [cpf, nome, email, tipo, senha]
    );
    return result.rows[0];
  },

  async atualizarUltimoAcesso(cpf) {
    await db.query("UPDATE usuarios SET ultimo_acesso = NOW() WHERE cpf = $1", [
      cpf,
    ]);
  },

  async atualizarStatusOnline(cpf, status) {
    await db.query("UPDATE usuarios SET online = $1 WHERE cpf = $2", [
      status,
      cpf,
    ]);
  },

  async atualizarSenha(email, novaSenha) {
    await db.query("UPDATE usuarios SET senha = $1 WHERE email = $2", [
      novaSenha,
      email,
    ]);
  },

  async ordenarComFiltro(
    coluna = "nome",
    ordem = "asc",
    offset = 0,
    cpfLogado
  ) {
    const colunasValidas = ["nome", "email", "online", "possui_acesso", "tipo"];
    if (!colunasValidas.includes(coluna)) coluna = "nome";
    const ordemSQL = ordem.toLowerCase() === "desc" ? "DESC" : "ASC";

    const query = `
      SELECT cpf, nome, email, online, possui_acesso, tipo
      FROM usuarios
      WHERE cpf != $1
      ORDER BY ${coluna} ${ordemSQL}
      LIMIT 8 OFFSET $2
    `;

    const result = await db.query(query, [cpfLogado, offset]);
    return result.rows;
  },

  async contarTotalUsuarios() {
    const result = await db.query("SELECT COUNT(*) FROM usuarios");
    return parseInt(result.rows[0].count, 10);
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
    await db.query("UPDATE usuarios SET nome = $1, tipo_id = $2 WHERE cpf = $3", [
      nome,
      tipo,
      cpf,
    ]);
  },
};

export default Usuarios;
