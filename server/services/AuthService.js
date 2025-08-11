import "dotenv/config";
import { hash, compare } from "bcrypt";
import pkg from "jsonwebtoken";
import EnderecoModel from "../models/EnderecoModel.js";
import UsuarioModel from "../models/UsuarioModel.js";

const { sign, verify } = pkg;

const SECRET_ACCESS = process.env.ACCESS_TOKEN_SECRET;
const SECRET_REFRESH = process.env.REFRESH_TOKEN_SECRET;

class AuthService {
  static gerarAccessToken(usuario) {
    return sign(
      { cpf: usuario.cpf },
      SECRET_ACCESS,
      { expiresIn: "15m" } // Token de acesso válido por 15 minutos
    );
  }

  static gerarRefreshToken(usuario) {
    return sign(
      { cpf: usuario.cpf },
      SECRET_REFRESH,
      { expiresIn: "7d" } // Refresh Token válido por 7 dias
    );
  }

  static verificarRefreshToken(token) {
    try {
      return verify(token, SECRET_REFRESH);
    } catch (error) {
      throw new Error("Refresh token inválido ou expirado");
    }
  }

  static verificarAccessToken(token) {
    try {
      return verify(token, SECRET_ACCESS);
    } catch (error) {
      return null;
    }
  }

  static async refreshToken(refreshToken) {
    try {
      // Verifica o refreshToken
      const decoded = this.verificarRefreshToken(refreshToken);

      // Busca usuário no banco de dados
      const usuario = await UsuarioModel.getPorCPF(decoded.cpf);
      if (!usuario) throw new Error("Usuário não encontrado");

      // Gera um novo accessToken
      return this.gerarAccessToken(usuario);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async me(token) {
    try {
      if (!token) {
        throw new Error("Token não fornecido");
      }

      // Verifica o token
      const decoded = verify(token, SECRET_ACCESS);
      if (!decoded) {
        throw new Error("Token inválido ou expirado");
      }

      // Busca o usuário no banco de dados
      const usuario = await UsuarioModel.getPorCPF(decoded.cpf);
      if (!usuario) {
        throw new Error("Usuário não encontrado");
      }

      return usuario;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async cadastrarUsuario(dados) {
    const {
      cpf,
      nome,
      email,
      tipo,
      senha,
      cep,
      logradouro,
      bairro,
      cidade,
      estado,
      numero,
    } = dados;

    // Verifica se o email já existe
    const emailExistente = await UsuarioModel.getPorEmail(email);
    if (emailExistente) throw new Error("Email já cadastrado.");

    // Verifica se o cpf já existe
    const cpfExistente = await UsuarioModel.getPorCPF(cpf);
    if (cpfExistente) throw new Error("CPF já cadastrado.");

    // Hash da senha
    const hashSenha = await hash(senha, 10);

    // Cria o usuário
    const usuario = await UsuarioModel.cadastrarUsuario({
      cpf,
      nome,
      email,
      tipo,
      senha: hashSenha,
    });

    // Salva o endereço do usuário
    await EnderecoModel.cadastrarEndereco({
      cpf_usuario: cpf,
      cep,
      logradouro,
      bairro,
      cidade,
      estado,
      numero,
    });

    // Gera tokens após o cadastro
    const accessToken = this.gerarAccessToken(usuario);
    const refreshToken = this.gerarRefreshToken(usuario);

    return { usuario, accessToken, refreshToken };
  }

  static async login({ email, senha }) {
    // Busca usuário pelo email
    const usuario = await UsuarioModel.getPorEmail(email);
    if (!usuario) throw new Error("Usuário não encontrado.");

    // Compara a senha informada com a armazenada
    const senhaValida = await compare(senha, usuario.senha);
    if (!senhaValida) throw new Error("Senha inválida.");

    // Gera token JWT
    const accessToken = this.gerarAccessToken(usuario);
    const refreshToken = this.gerarRefreshToken(usuario);

    // Atualiza o último acesso do usuário
    await UsuarioModel.atualizarUltimoAcesso(usuario.cpf);

    return { accessToken, refreshToken, usuario };
  }
}

export default AuthService;
