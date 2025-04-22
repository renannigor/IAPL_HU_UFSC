import "dotenv/config";
import { hash, compare } from "bcrypt";
import pkg from "jsonwebtoken";
import Enderecos from "../models/AddressModel.js";
import Usuarios from "../models/UserModel.js";
import Tokens from "../models/TokenModel.js";
import EmailService from "./EmailService.js";
import crypto from "crypto";

const { sign, verify } = pkg;

const SECRET_ACCESS = process.env.ACCESS_TOKEN_SECRET;
const SECRET_REFRESH = process.env.REFRESH_TOKEN_SECRET;

class AuthService {
  static gerarAccessToken(usuario) {
    return sign(
      { cpf: usuario.cpf, admin: usuario.admin },
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
      const usuario = await Usuarios.buscarPorCPF(decoded.cpf);
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
      const usuario = await Usuarios.buscarPorCPF(decoded.cpf);
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
    const emailExistente = await Usuarios.buscarPorEmail(email);
    if (emailExistente) throw new Error("Email já cadastrado.");

    // Verifica se o cpf já existe
    const cpfExistente = await Usuarios.buscarPorCPF(cpf);
    if (cpfExistente) throw new Error("CPF já cadastrado.");

    // Hash da senha
    const hashSenha = await hash(senha, 10);

    // Cria o usuário
    const usuario = await Usuarios.criar({
      cpf,
      nome,
      email,
      tipo,
      senha: hashSenha,
    });

    // Salva o endereço do usuário
    await Enderecos.criar({
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
    const usuario = await Usuarios.buscarPorEmail(email);
    if (!usuario) throw new Error("Usuário não encontrado.");

    // Compara a senha informada com a armazenada
    const senhaValida = await compare(senha, usuario.senha);
    if (!senhaValida) throw new Error("Senha inválida.");

    // Gera token JWT
    const accessToken = this.gerarAccessToken(usuario);
    const refreshToken = this.gerarRefreshToken(usuario);

    // Atualiza o último acesso do usuário
    await Usuarios.atualizarUltimoAcesso(usuario.cpf);
    // Atualiza o status de online do usuário
    await Usuarios.atualizarStatusOnline(usuario.cpf, true);

    return { accessToken, refreshToken, usuario };
  }

  static async esqueceuSenha(email) {
    // Busca usuário pelo email
    const usuario = await Usuarios.buscarPorEmail(email);
    if (!usuario) throw new Error("Email não encontrado.");

    // Gerar um token aleatório
    const token = crypto.randomBytes(32).toString("hex");
    const expires_at = new Date(Date.now() + 15 * 60 * 1000); // Expira em 15 minutos

    // Salvar no banco
    await Tokens.criarToken(email, token, expires_at);

    // Criar link de redefinição
    const resetLink = `http://localhost:3000/redefinir-senha?token=${token}`;
    const mensagem = `
        <h3>Redefinição de Senha</h3>
        <p>Olá, ${usuario.nome}!</p>
        <p>Clique no link abaixo para redefinir sua senha. O link expira em 15 minutos.</p>
        <a href="${resetLink}">${resetLink}</a>
    `;

    console.log(`Email de recuperação enviado para: ${email}`);

    await EmailService.enviarEmail(email, "Redefinição de Senha", mensagem);
  }

  static async redefinirSenha(token, novaSenha) {
    const tokenData = await Tokens.buscarPorToken(token);
    if (!tokenData) throw new Error("Token inválido ou expirado.");

    // Buscar usuário pelo email do token
    const usuario = await Usuarios.buscarPorEmail(tokenData.email);
    if (!usuario) throw new Error("Usuário não encontrado.");

    // Hash da nova senha
    const hashSenha = await hash(novaSenha, 10);
    await Usuarios.atualizarSenha(usuario.email, hashSenha);

    // Remover o token do banco após o uso
    await Tokens.excluirToken(token);

    return { mensagem: "Senha redefinida com sucesso!" };
  }

  static async atualizarStatusOnline(cpf, status) {
    await Usuarios.atualizarStatusOnline(cpf, status);
  }
}

export default AuthService;
