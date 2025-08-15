import db from "../config/db.js";
import EnderecoModel from "../models/EnderecoModel.js";

const UsuarioModel = {
  // Retorna todos os tipos de usuário cadastrados no sistema.
  async getTiposUsuario() {
    const result = await db.query("SELECT * FROM tipos_usuario");
    return result.rows;
  },

  // Retorna um tipo de usuário específico pelo ID.
  async getTipoUsuario(id) {
    const result = await db.query("SELECT * FROM tipos_usuario WHERE id = $1", [
      id,
    ]);
    return result.rows;
  },

  // Busca um usuário pelo email.
  async getPorEmail(email) {
    const result = await db.query(
      `SELECT 
        cpf, nome, email, tipo_id, senha, criado_em,
        TO_CHAR(ultimo_acesso, 'DD/MM/YYYY HH24:MI:SS') AS ultimo_acesso
       FROM Usuarios 
       WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  },

  // Busca um usuário pelo CPF, retornando informações adicionais como o nome do tipo de usuário.
  async getPorCPF(cpf) {
    const result = await db.query(
      `
      SELECT 
        u.cpf, u.nome, u.email, tu.nome AS tipo, 
        u.criado_em, TO_CHAR(u.ultimo_acesso, 'DD/MM/YYYY HH24:MI:SS') AS ultimo_acesso,
        e.cep, e.logradouro, e.bairro, e.cidade, e.estado, e.numero
      FROM usuarios u
        JOIN tipos_usuario tu ON u.tipo_id = tu.id
        JOIN enderecos e ON u.cpf = e.cpf_usuario
      WHERE u.cpf = $1;
      `,
      [cpf]
    );
    return result.rows[0];
  },

  // Cadastra um novo usuário no banco.
  async cadastrarUsuario(dados) {
    const { cpf, nome, email, tipo, senha } = dados;
    const result = await db.query(
      `INSERT INTO usuarios (cpf, nome, email, tipo_id, senha, criado_em, ultimo_acesso) 
             VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *`,
      [cpf, nome, email, tipo, senha]
    );
    return result.rows[0];
  },

  //  Atualiza o campo "ultimo_acesso" do usuário para a data/hora atual.
  async atualizarUltimoAcesso(cpf) {
    await db.query("UPDATE usuarios SET ultimo_acesso = NOW() WHERE cpf = $1", [
      cpf,
    ]);
  },

  // Remove um usuário pelo CPF
  async deletarUsuario(cpf) {
    await db.query("DELETE FROM usuarios WHERE cpf = $1", [cpf]);
  },

  // Atualiza os dados do usuário.
  async atualizarPerfil(dados, cpf) {
    await db.query("UPDATE usuarios SET nome = $1 WHERE cpf = $2", [
      dados.nome,
      cpf,
    ]);

    // Atualizando dados do endereço do usuário
    await EnderecoModel.atualizarEndereco(dados, cpf);
  },
};

export default UsuarioModel;
