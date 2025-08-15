import db from "../config/db.js";

const EnderecoModel = {
  // Cadastrar o endereço do usuário
  async cadastrarEndereco(dados) {
    const {
      cpf_usuario,
      cep,
      logradouro,
      bairro,
      cidade,
      estado,
      numeroResidencial,
    } = dados;
    await db.query(
      `INSERT INTO enderecos (cpf_usuario, cep, logradouro, bairro, cidade, estado, numero) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [cpf_usuario, cep, logradouro, bairro, cidade, estado, numeroResidencial]
    );
  },

  // Atualizar o endereço do usuário
  async atualizarEndereco(dados, cpfUsuario) {
    const { cep, logradouro, bairro, cidade, estado, numeroResidencial } =
      dados;

    await db.query(
      `UPDATE enderecos
     SET cep = $1,
         logradouro = $2,
         bairro = $3,
         cidade = $4,
         estado = $5,
         numero = $6
     WHERE cpf_usuario = $7`,
      [cep, logradouro, bairro, cidade, estado, numeroResidencial, cpfUsuario]
    );
  },
};

export default EnderecoModel;
