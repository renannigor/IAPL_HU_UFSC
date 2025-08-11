import AuthService from "../services/AuthService.js";

class AuthController {
  // Método para cadastrar um novo usuário
  static async cadastrarUsuario(req, res) {
    try {
      // Chama o serviço para cadastrar o usuário, que retorna o usuário e tokens
      const { usuario, accessToken, refreshToken } =
        await AuthService.cadastrarUsuario(req.body);

      // Armazena o refreshToken em cookie HTTPOnly para segurança
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 2 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({ accessToken, usuario });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Método para login do usuário
  static async login(req, res) {
    try {
      // Chama serviço de login que retorna tokens e dados do usuário
      const { accessToken, refreshToken, usuario } = await AuthService.login(
        req.body
      );
      // Armazena refreshToken no cookie HTTPOnly
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // Apenas HTTPS em produção
        sameSite: "Lax",
        maxAge: 2 * 24 * 60 * 60 * 1000, // 2 dias
      });

      res.status(201).json({ accessToken, usuario });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // Método para renovar token de acesso usando refreshToken
  static async refreshToken(req, res) {
    try {
      // Pega o refreshToken armazenado no cookie
      const { refreshToken } = req.cookies;
      // Se não tiver refreshToken, retorna erro 403 (proibido)
      if (!refreshToken)
        return res
          .status(403)
          .json({ error: "Sem refresh token, faça login novamente" });

      // Chama serviço para gerar novo accessToken com base no refreshToken
      const newAccessToken = await AuthService.refreshToken(refreshToken);
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }

  // Método para logout do usuário
  static async logout(req, res) {
    try {
      // Limpa o cookie do refreshToken para "deslogar" o usuário
      res.clearCookie("refreshToken");

      res.json({ message: "Logout realizado com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao fazer logout" });
    }
  }

  // Método para obter dados do usuário autenticado (perfil)
  static async me(req, res) {
    try {
      // Pega o token do cabeçalho Authorization
      const authHeader = req.headers.authorization;

      // Se não houver token, retorna 401 (não autorizado)
      if (!authHeader) {
        return res.status(401).json({ error: "Token não fornecido" });
      }

      // Extrai só o token (removendo o "Bearer ")
      const token = authHeader.split(" ")[1];

      // Chama serviço para validar token e obter dados do usuário
      const usuario = await AuthService.me(token);

      res.json({ accessToken: token, user: usuario });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

export default AuthController;
