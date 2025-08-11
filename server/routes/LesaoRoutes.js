import { Router } from "express";
import LesaoController from "../controllers/LesaoController.js";

const router = Router();

// Rota para obter dados do formulário de lesão
router.get("/formulario", LesaoController.getDadosFormulario);

// Rota para criar uma lesão
router.post(
  "/usuario/:cpfUsuario/paciente/:pacienteId",
  LesaoController.cadastrarLesao
);

// Rota para atualizar uma lesão
router.put(
  "/usuario/:cpfUsuario/lesao/:lesaoId",
  LesaoController.atualizarLesao
);

// Rota para deletar uma lesão
router.delete("/:lesaoId", LesaoController.deletarLesao);

// Rota para obter histórico da lesão
router.get("/:lesaoId/historico", LesaoController.getHistoricoLesao);

// Rota para duplicar uma lesão
router.post(
  "/usuario/:cpfUsuario/paciente/:pacienteId/lesao/:lesaoOriginalId/duplicar/:lesaoBaseId",
  LesaoController.duplicarLesao
);

// Rota para obter lesão
router.get("/:lesaoId", LesaoController.getLesao);

// Rota para obter lesão por ID (com ids relacionados)
router.get("/:lesaoId/ids", LesaoController.getLesaoPorId);

// Rota para obter lesão por nome (com nomes relacionados)
router.get("/:lesaoId/nomes", LesaoController.getLesaoPorNome);

// Rota para listar lesões de paciente (com filtro de aprovação)
router.get("/paciente/:pacienteId", LesaoController.getLesoesPorPaciente);

// Rota para atualizar o status de aprovação da lesão
router.patch(
  "/usuario/:cpfUsuario/lesao/:lesaoId/aprovacao",
  LesaoController.setAprovacao
);

export default router;
