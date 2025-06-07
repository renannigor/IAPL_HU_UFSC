import { Router } from "express";
import UsuarioController from "../controllers/UsuarioController.js";

const router = Router();

// Listar com ordenação e paginação
router.get("/", UsuarioController.filtrarUsuarios);

// Buscar todos os tipos de usuário
router.get("/tipos", UsuarioController.buscarTiposUsuario);

// Atualizar permissão
router.patch("/atualizar/:cpf/permissao", UsuarioController.atualizarPermissao);

// Atualizar informações pessoais
router.patch(
  "/atualizar/:cpf/info-pessoal",
  UsuarioController.atualizarInfoPessoal
);

// Excluir usuário
router.delete("/deletar/:cpf", UsuarioController.deletarUsuario);

export default router;
