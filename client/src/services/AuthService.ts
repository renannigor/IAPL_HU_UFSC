import api from "@/api/api.ts";

class AuthService {
  static async getUsuarioAtual() {
    try {
      const response = await api.get("/api/auth/me", { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("❌ Erro ao buscar usuário:", error);
      throw error;
    }
  }

  static async refreshToken() {
    try {
      const response = await api.get("/api/auth/refresh-token", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      throw error;
    }
  }
  
  static async login(email: string, senha: string) {
    try {
      const response = await api.post(
        "/api/auth/login",
        { email, senha },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  }

  static async cadastrarUsuario(
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
      return response.data;
    } catch (error) {
      console.error("Erro no cadastro:", error);
      throw error;
    }
  }

  static async esqueceuSenha(email: string) {
    try {
      await api.post(
        "/api/auth/esqueceu-senha",
        { email },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Erro no envio do email de redefinição de senha:", error);
      throw error;
    }
  }

  static async redefinirSenha(novaSenha: string, token: string) {
    try {
      await api.post(
        `/api/auth/${token}/redefinir-senha`,
        { novaSenha },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      throw error;
    }
  }

  static async logout(usuarioCpf: string) {
    try {
      await api.post(
        "/api/auth/logout",
        { cpf: usuarioCpf },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Erro no logout:", error);
      throw error;
    }
  }

  static async verificarTokenRedefinicaoSenha(token: string) {
    try {
      await api.post(
        `/api/auth/verificar-token/${token}`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error(
        "Erro ao verificar o token de redefinição de senha:",
        error
      );
      throw error;
    }
  }
}

export default AuthService;
