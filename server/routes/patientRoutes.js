import { Router } from "express";
import PatientsController from "../controllers/patientsController.js";

const router = Router();

// Carregar todos os pacientes
router.get("/todos", PatientsController.carregarTodosPacientes);

// Obter paciente
router.get("/:id", PatientsController.obterPaciente);

export default router;
