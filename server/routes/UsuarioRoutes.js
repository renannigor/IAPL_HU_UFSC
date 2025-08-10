import { Router } from "express";
import UsuarioController from "../controllers/UsuarioController.js";

const router = Router();

// Buscar todos os tipos de usuário
router.get("/tipos", UsuarioController.getTiposUsuario);

// Atualizar permissão
router.patch("/atualizar/:cpf/permissao", UsuarioController.atualizarPermissao);

// Atualizar informações pessoais
router.patch("/atualizar/:cpf/", UsuarioController.atualizarPerfil);

// Excluir usuário
router.delete("/deletar/:cpf", UsuarioController.deletarUsuario);

export default router;
