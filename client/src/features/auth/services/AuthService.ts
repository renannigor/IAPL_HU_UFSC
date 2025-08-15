import api from "@/api/api.ts";

class AuthService {
  // Busca os dados do usuário atualmente autenticado
  static async getUsuarioAtual() {
    try {
      // Faz uma requisição GET para "/api/auth/me" enviando cookies (credenciais)
      const response = await api.get("/api/auth/me", { withCredentials: true });
      return response.data; // Retorna os dados do usuário
    } catch (error) {
      console.error("❌ Erro ao buscar usuário:", error); // Log de erro
      throw error; // Propaga o erro para quem chamou
    }
  }

  // Solicita um novo token de autenticação (refresh token)
  static async refreshToken() {
    try {
      // Requisição GET para renovar o token, com envio de cookies
      const response = await api.get("/api/auth/refresh-token", {
        withCredentials: true,
      });
      return response.data; // Retorna os dados do novo token
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      throw error;
    }
  }

  // Faz o login do usuário com email e senha
  static async login(email: string, senha: string) {
    try {
      // POST para "/api/auth/login" enviando email e senha no corpo, com cookies
      const response = await api.post(
        "/api/auth/login",
        { email, senha },
        { withCredentials: true }
      );
      return response.data; // Retorna dados da autenticação
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  }

  // Cadastra um novo usuário com vários dados pessoais e endereço
  static async cadastrarUsuario(
    cpf: string,
    nome: string,
    email: string,
    tipo: number,
    senha: string,
    cep: string,
    logradouro: string,
    bairro: string,
    cidade: string,
    estado: string,
    numero: number
  ) {
    try {
      // POST para "/api/auth/cadastro" com dados do usuário no corpo e envio de cookies
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
      return response.data; // Retorna confirmação ou dados do usuário criado
    } catch (error) {
      console.error("Erro no cadastro:", error);
      throw error;
    }
  }

  // Faz logout do usuário
  static async logout() {
    try {
      // POST para "/api/auth/logout" com cookies para encerrar sessão
      await api.post("/api/auth/logout", { withCredentials: true });
    } catch (error) {
      console.error("Erro no logout:", error);
      throw error;
    }
  }
}

export default AuthService;
