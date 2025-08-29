import AuthService from "../services/AuthService.js";

class AuthController {
  // Método para cadastrar um novo usuário
  static async cadastrarUsuario(req, res, next) {
    try {
      // Chama o serviço para cadastrar o usuário, que retorna o usuário e tokens
      const { usuario, accessToken, refreshToken } =
        await AuthService.cadastrarUsuario(req.body);

      // Armazena o refreshToken em cookie HTTPOnly para segurança
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // mudar para true em produção com HTTPS
        sameSite: "Lax",
        maxAge: 2 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        sucesso: true,
        mensagem: "Usuário cadastrado com sucesso!",
        dados: { usuario, accessToken },
      });
    } catch (error) {
      next(error);
    }
  }

  // Método para login do usuário
  static async login(req, res, next) {
    try {
      // Chama serviço de login que retorna tokens e dados do usuário
      const { accessToken, refreshToken, usuario } = await AuthService.login(
        req.body
      );

      // Armazena refreshToken no cookie HTTPOnly
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // true em produção
        sameSite: "Lax",
        maxAge: 2 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        sucesso: true,
        mensagem: "Login realizado com sucesso!",
        dados: { usuario, accessToken },
      });
    } catch (error) {
      next(error);
    }
  }

  // Método para renovar token de acesso usando refreshToken
  static async refreshToken(req, res, next) {
    try {
      // Pega o refreshToken armazenado no cookie
      const { refreshToken } = req.cookies;

      // Se não tiver refreshToken, retorna erro 403 (proibido)
      if (!refreshToken) {
        return res.status(403).json({
          sucesso: false,
          mensagem: "Sem refresh token, faça login novamente",
        });
      }

      // Chama serviço para gerar novo accessToken com base no refreshToken
      const newAccessToken = await AuthService.refreshToken(refreshToken);

      res.status(200).json({
        sucesso: true,
        mensagem: "Token renovado com sucesso!",
        dados: { accessToken: newAccessToken },
      });
    } catch (error) {
      next(error);
    }
  }

  // Método para logout do usuário
  static async logout(req, res, next) {
    try {
      // Limpa o cookie do refreshToken para "deslogar" o usuário
      res.clearCookie("refreshToken");

      res.status(200).json({
        sucesso: true,
        mensagem: "Logout realizado com sucesso!",
      });
    } catch (error) {
      next(error);
    }
  }

  // Método para obter dados do usuário autenticado (perfil)
  static async me(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      // Se não houver token, retorna 401 (não autorizado)
      if (!authHeader) {
        return res.status(401).json({
          sucesso: false,
          mensagem: "Token não fornecido",
        });
      }

      // Extrai só o token (removendo o "Bearer ")
      const token = authHeader.split(" ")[1];
      // Chama serviço para validar token e obter dados do usuário
      const usuario = await AuthService.me(token);

      res.status(200).json({
        sucesso: true,
        mensagem: "Dados do usuário recuperados com sucesso!",
        dados: { usuario: usuario, accessToken: token },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
