import { Router } from "express";
import UserController from "../controllers/userController.js";

const router = Router();

// Listar com ordenação e paginação
router.get("/usuarios", UserController.filtrarUsuarios);

// Atualizar permissão
router.patch("/usuarios/:cpf/permissao", UserController.atualizarPermissao);

// Atualizar informações pessoais
router.patch(
  "/usuarios/:cpf/info-pessoal",
  UserController.atualizarInfoPessoal
);

// Excluir usuário
router.delete("/usuarios/:cpf", UserController.deletarUsuario);

export default router;
