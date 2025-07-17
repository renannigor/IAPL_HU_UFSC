import { Router } from "express";
import PacienteController from "../controllers/PacienteController.js";

const router = Router();

// Carregar todos os pacientes teste
router.get("/todos/teste", PacienteController.carregarTodosPacientes);

// Obter paciente
router.get("/:id/teste", PacienteController.obterPaciente);

// Obter todos os pacientes
router.get("/", PacienteController.getPacientes);

// Obter todos os pacientes
router.get("/:id", PacienteController.getPaciente);

// Atualizar paciente
router.put("/atualizar/:id", PacienteController.atualizarPaciente);

export default router;
