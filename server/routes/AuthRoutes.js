import { Router } from "express";
import AuthController from "../controllers/AuthController.js";

const router = Router();

// Rota para obter informações do usuário autenticado (perfil)
router.get("/me", AuthController.me);

// Rota para cadastro de novo usuário
router.post("/cadastro", AuthController.cadastrarUsuario);

// Rota para login do usuário (autenticação)
router.post("/login", AuthController.login);

// Rota para logout do usuário (encerrar sessão/token)
router.post("/logout", AuthController.logout);

// Rota para renovar token de autenticação (refresh token)
router.get("/refresh-token", AuthController.refreshToken);

export default router;
