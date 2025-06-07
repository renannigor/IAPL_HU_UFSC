import { Router } from "express";
import PacienteController from "../controllers/PacienteController.js";

const router = Router();

// Carregar todos os pacientes
router.get("/todos", PacienteController.carregarTodosPacientes);

// Obter paciente
router.get("/:id", PacienteController.obterPaciente);

export default router;
