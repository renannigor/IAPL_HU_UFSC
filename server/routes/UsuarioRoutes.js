import { Router } from "express";
import UsuarioController from "../controllers/UsuarioController.js";

const router = Router();

// Rota para buscar todos os tipos de usuário disponíveis no sistema.
router.get("/tipos", UsuarioController.getTiposUsuario);

// Rota para atualizar informações pessoais de um usuário específico.
router.patch("/atualizar/:cpf/", UsuarioController.atualizarPerfil);

// Rota para excluir um usuário específico do sistema.
router.delete("/deletar/:cpf", UsuarioController.deletarUsuario);

export default router;
