import { Router } from "express";
import LesaoController from "../controllers/LesaoController.js";

const router = Router();

// Rota dos dados do formulário
router.get("/form/dados", LesaoController.obterDadosFormLesao);
router.get("/obter/:id_lesao", LesaoController.obterLesao);
router.get("/obter/", LesaoController.obterTodasLesoesPacientes);
router.post(
  "/cadastrar/:cpf_usuario/:id_paciente",
  LesaoController.cadastrarLesao
);
router.put("/atualizar/:cpf_usuario/:id_lesao", LesaoController.atualizarLesao);
router.delete("/deletar/:id_lesao", LesaoController.deletarLesao);

export default router;
