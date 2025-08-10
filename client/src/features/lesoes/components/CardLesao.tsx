import { useState } from "react";
import { Button } from "@/ui/button";
import {
  Pencil,
  Trash,
  Eye,
  AlertCircle,
  Activity,
  UserCircle,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Lesao } from "../types/Lesao";
import LesaoService from "../services/LesaoService";
import ConfirmDialog from "@/shared/components/ConfirmDialog";

// Props esperadas pelo componente CardLesao
interface CardLesaoProps {
  lesoes: Lesao[]; // Lista de lesões que serão exibidas
  onRefresh?: () => void; // Função opcional para recarregar dados após exclusão
}

const CardLesao = ({ lesoes, onRefresh }: CardLesaoProps) => {
  const navigate = useNavigate(); // Hook para redirecionar entre páginas
  const [openDialog, setOpenDialog] = useState(false); // Controle de abertura do diálogo
  const [lesaoIdParaExcluir, setLesaoIdParaExcluir] = useState<string | null>(
    null
  ); // ID da lesão a ser excluída

  // Função para confirmar exclusão de uma lesão
  const handleDelete = async () => {
    if (!lesaoIdParaExcluir) return; // Garante que há um ID válido antes de excluir

    try {
      console.log("Deletando lesão com ID:", lesaoIdParaExcluir);
      await LesaoService.deletarLesao(lesaoIdParaExcluir); // Chama o serviço para excluir
      if (onRefresh) onRefresh(); // Atualiza a lista se a função foi passada
    } finally {
      setOpenDialog(false); // Fecha o diálogo
      setLesaoIdParaExcluir(null); // Limpa o ID selecionado
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Percorre todas as lesões recebidas via props */}
      {lesoes.map((lesao, index) => {
        const possuiDor = lesao.possui_dor?.toLowerCase() === "sim"; // Verifica se a lesão possui dor

        return (
          <div
            key={lesao.id}
            className="relative rounded-2xl bg-white border border-gray-200 shadow-sm p-5 flex flex-col justify-between"
          >
            {/* Exibe um selo "Pendente" se a lesão precisa de aprovação */}
            {lesao.precisa_aprovacao && (
              <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full z-10">
                Pendente
              </div>
            )}

            {/* Título da lesão */}
            <div className="flex items-center gap-2 text-[#FF6B00] text-sm font-semibold mb-3">
              <AlertCircle className="w-4 h-4" />
              Lesão #{index + 1} {lesao.localizacao}
            </div>

            {/* Informações principais da lesão */}
            <div className="space-y-2 text-sm text-gray-700">
              <div>
                <span className="font-semibold">Túnel:</span>{" "}
                {lesao.presenca_tunel}
              </div>

              <div>
                <span className="font-semibold">Dor:</span>{" "}
                <span className={possuiDor ? "text-red-500" : "text-gray-500"}>
                  {possuiDor ? "Com dor" : "Sem dor"}
                </span>
              </div>

              {/* Escala de dor (somente se houver dor) */}
              {possuiDor && (
                <div className="flex items-center gap-1">
                  <span className="font-semibold">Escala da dor:</span>{" "}
                  {lesao.escala_numerica_dor} / 10
                  <Activity className="w-4 h-4 text-gray-500" />
                </div>
              )}

              {/* Dimensões da lesão */}
              <div>
                <span className="font-semibold">Dimensões:</span>{" "}
                {lesao.comprimento} × {lesao.largura} × {lesao.profundidade} cm
              </div>
            </div>

            {/* Informações de autoria */}
            <div className="mt-4 border-t pt-3 text-xs text-gray-600 space-y-1">
              <div className="flex items-center gap-1">
                <UserCircle className="w-4 h-4 text-gray-400" />
                <span>
                  <strong>Criado por:</strong> {lesao.nome_criador || "—"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <UserCircle className="w-4 h-4 text-gray-400" />
                <span>
                  <strong>Modificado por:</strong>{" "}
                  {lesao.nome_modificador || "—"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <UserCircle className="w-4 h-4 text-gray-400" />
                <span>
                  <strong>Aprovado por:</strong> {lesao.nome_aprovador || "—"}
                </span>
              </div>
            </div>

            {/* Botões de ação */}
            {lesao.precisa_aprovacao ? (
              // Se precisa de aprovação, mostra botões de Ver, Editar e Excluir
              <div className="flex justify-end items-center mt-5 gap-2 flex-wrap">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#1F4D2C] hover:bg-[#1F4D2C]/10 hover:border-[#1F4D2C]/20"
                  onClick={() =>
                    navigate(
                      `/dashboard/pacientes/${lesao.paciente_id}/lesoes/${lesao.id}/detalhes`
                    )
                  }
                >
                  <Eye className="w-4 h-4 mr-1" /> Ver
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-[#1F4D2C]/90 text-white hover:bg-[#1F4D2C] transition-colors"
                  onClick={() =>
                    navigate(
                      `/dashboard/pacientes/${lesao.paciente_id}/lesoes/${lesao.id}/editar`
                    )
                  }
                >
                  <Pencil className="w-4 h-4 mr-1" /> Editar
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:bg-red-100"
                  onClick={() => {
                    setLesaoIdParaExcluir(lesao.id); // Define o ID a ser excluído
                    setOpenDialog(true); // Abre o diálogo de confirmação
                  }}
                >
                  <Trash className="w-4 h-4 mr-1" /> Excluir
                </Button>
              </div>
            ) : (
              // Caso contrário, mostra apenas o botão de Histórico
              <div className="flex justify-end items-center mt-5 gap-2 flex-wrap">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#1F4D2C] hover:bg-[#1F4D2C]/10 hover:border-[#1F4D2C]/20"
                  onClick={() =>
                    navigate(
                      `/dashboard/pacientes/${lesao.paciente_id}/lesoes/${lesao.id}/historico`
                    )
                  }
                >
                  <Clock className="w-4 h-4 mr-1" /> Histórico
                </Button>
              </div>
            )}

            {/* Diálogo de confirmação de exclusão */}
            <ConfirmDialog
              open={openDialog}
              onOpenChange={setOpenDialog}
              title="Deseja realmente excluir esta lesão?"
              description="Essa ação não poderá ser desfeita."
              confirmLabel="Excluir"
              cancelLabel="Cancelar"
              onConfirm={handleDelete}
              confirmColor="danger"
              icon={<Trash className="w-5 h-5 text-red-600" />}
            />
          </div>
        );
      })}
    </div>
  );
};

export default CardLesao;
