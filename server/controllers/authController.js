import AuthService from "../services/AuthService.js";

class AuthController {
  static async cadastrarUsuario(req, res) {
    try {
      const { usuario, accessToken, refreshToken } =
        await AuthService.cadastrarUsuario(req.body);

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

  static async login(req, res) {
    try {
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

  static async esqueceuSenha(req, res) {
    try {
      await AuthService.esqueceuSenha(req.body.email);
      res.json({ message: "Email de recuperação enviado." });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async redefinirSenha(req, res) {
    try {
      const { token } = req.params; // Pegando o token da URL
      const { novaSenha } = req.body; // Pegando a nova senha do corpo da requisição

      await AuthService.redefinirSenha(token, novaSenha);
      res.json({ message: "Senha redefinida com sucesso." });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.cookies;
      console.log(refreshToken);
      if (!refreshToken)
        return res
          .status(403)
          .json({ error: "Sem refresh token, faça login novamente" });

      const newAccessToken = await AuthService.refreshToken(refreshToken);
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }

  static async logout(req, res) {
    try {
      const { cpf } = req.body;

      if (cpf) {
        await AuthService.atualizarStatusOnline(cpf, false); // Atualiza para offline
      }

      res.clearCookie("refreshToken");
      res.json({ message: "Logout realizado com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao fazer logout" });
    }
  }

  static async me(req, res) {
    try {
      // Pega o token do cabeçalho Authorization
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: "Token não fornecido" });
      }

      const token = authHeader.split(" ")[1];

      // Chama o método no AuthService
      const usuario = await AuthService.me(token);

      console.log("ESTOU SENDO EXECUTADO");

      res.json({ accessToken: token, user: usuario });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

export default AuthController;
