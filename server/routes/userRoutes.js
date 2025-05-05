import { Router } from "express";
import UserController from "../controllers/userController.js";

const router = Router();

// Listar com ordenação e paginação
router.get("/", UserController.filtrarUsuarios);

// Atualizar permissão
router.patch("/:cpf/permissao", UserController.atualizarPermissao);

// Atualizar informações pessoais
router.patch("/:cpf/info-pessoal", UserController.atualizarInfoPessoal);

// Excluir usuário
router.delete("/:cpf", UserController.deletarUsuario);

export default router;
