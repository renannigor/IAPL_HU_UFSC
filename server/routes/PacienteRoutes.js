import { Router } from "express";
import PacienteController from "../controllers/PacienteController.js";

const router = Router();

// Rota para carregar todos os pacientes (rota de teste)
router.get("/todos/teste", PacienteController.getPacientesTeste);

// Rota para obter um paciente específico pelo ID (rota de teste)
router.get("/:id/teste", PacienteController.getPacienteTeste);

// Rota para obter todos os pacientes cadastrados
router.get("/", PacienteController.getPacientes);

// Rota para obter os dados de um paciente específico pelo ID
router.get("/:id", PacienteController.getPaciente);

export default router;
