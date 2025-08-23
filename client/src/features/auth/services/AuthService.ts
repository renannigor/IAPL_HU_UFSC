import api from "@/api/api.ts";
import { toast } from "sonner";

class AuthService {
  // Busca os dados do usuário atualmente autenticado
  static async getUsuarioAtual() {
    try {
      const response = await api.get("/api/auth/me", { withCredentials: true });
      return response.data;
    } catch (error: any) {
      const mensagemErro =
        error.response?.data?.mensagem || "Erro ao buscar usuário atual";
      toast.error(mensagemErro);
      throw error;
    }
  }

  // Solicita um novo token de autenticação (refresh token)
  static async refreshToken() {
    try {
      const response = await api.get("/api/auth/refresh-token", {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      const mensagemErro =
        error.response?.data?.mensagem || "Erro ao renovar token";
      toast.error(mensagemErro);
      throw error;
    }
  }

  // Faz o login do usuário com email e senha
  static async login(email: string, senha: string) {
    try {
      const response = await api.post(
        "/api/auth/login",
        { email, senha },
        { withCredentials: true }
      );
      toast.success("Login realizado com sucesso!");
      return response.data;
    } catch (error: any) {
      const mensagemErro =
        error.response?.data?.mensagem || "Erro ao realizar login";
      toast.error(mensagemErro);
      throw error;
    }
  }

  // Cadastra um novo usuário com vários dados pessoais e endereço
  static async cadastro(
    cpf: string,
    nome: string,
    email: string,
    tipo: string,
    senha: string,
    cep: string,
    logradouro: string,
    bairro: string,
    cidade: string,
    estado: string,
    numero: string
  ) {
    try {
      const response = await api.post(
        "/api/auth/cadastro",
        {
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
        },
        { withCredentials: true }
      );
      toast.success("Cadastro realizado com sucesso!");
      return response.data;
    } catch (error: any) {
      const mensagemErro =
        error.response?.data?.mensagem || "Erro ao realizar cadastro";
      toast.error(mensagemErro);
      throw error;
    }
  }

  // Faz logout do usuário
  static async logout() {
    try {
      await api.post("/api/auth/logout", {}, { withCredentials: true });
      toast.success("Logout realizado com sucesso!");
    } catch (error: any) {
      const mensagemErro =
        error.response?.data?.mensagem || "Erro ao realizar logout";
      toast.error(mensagemErro);
      throw error;
    }
  }
}

export default AuthService;
