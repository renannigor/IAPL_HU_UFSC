import { Router } from "express";
import AuthController from "../controllers/authController.js";

const router = Router();

// Rotas de Autenticação
router.get("/me", AuthController.me);
router.post("/cadastro", AuthController.cadastrarUsuario);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.get("/refresh-token", AuthController.refreshToken);
router.post("/esqueceu-senha", AuthController.esqueceuSenha);
router.post("/redefinir-senha/:token", AuthController.redefinirSenha);

export default router;
