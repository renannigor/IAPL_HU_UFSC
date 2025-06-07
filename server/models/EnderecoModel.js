import db from "../config/db.js";

const Enderecos = {
  async criar(dados) {
    const { cpf_usuario, cep, logradouro, bairro, cidade, estado, numero } =
      dados;
    await db.query(
      `INSERT INTO enderecos (cpf_usuario, cep, logradouro, bairro, cidade, estado, numero) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [cpf_usuario, cep, logradouro, bairro, cidade, estado, numero]
    );
  },
};

export default Enderecos;
