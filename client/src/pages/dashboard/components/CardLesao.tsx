import { useState } from "react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/pages/dashboard/components/ConfirmDialog";
import { Lesao } from "@/types/lesao";
import LesaoService from "@/services/LesaoService";
import {
  Pencil,
  Trash,
  Eye,
  AlertCircle,
  Activity,
  UserCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CardLesaoProps {
  lesoes: Lesao[];
}

const CardLesao = ({ lesoes }: CardLesaoProps) => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [lesaoIdParaExcluir, setLesaoIdParaExcluir] = useState<number | null>(
    null
  );

  const handleDelete = async () => {
    if (!lesaoIdParaExcluir) return;

    try {
      // aqui você pode fazer a requisição de exclusão
      console.log("Deletando lesão com ID:", lesaoIdParaExcluir);
      await LesaoService.deletarLesao(lesaoIdParaExcluir);
    } finally {
      setOpenDialog(false);
      setLesaoIdParaExcluir(null); // limpa o estado
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {lesoes.map((lesao, index) => {
        const possuiDor = lesao.possui_dor?.toLowerCase() === "sim";

        return (
          <div
            key={lesao.id}
            className="relative rounded-2xl bg-white border border-gray-200 shadow-sm p-5 flex flex-col justify-between"
          >
            {lesao.precisa_aprovacao && (
              <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full z-10">
                Pendente
              </div>
            )}

            <div className="flex items-center gap-2 text-[#FF6B00] text-sm font-semibold mb-3">
              <AlertCircle className="w-4 h-4" />
              Lesão #{index + 1}
            </div>

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

              {possuiDor && (
                <div className="flex items-center gap-1">
                  <span className="font-semibold">Escala da dor:</span>{" "}
                  {lesao.escala_dor} / 10
                  <Activity className="w-4 h-4 text-gray-500" />
                </div>
              )}

              <div>
                <span className="font-semibold">Dimensões:</span>{" "}
                {lesao.comprimento} × {lesao.largura} × {lesao.profundidade} cm
              </div>
            </div>

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
                  setLesaoIdParaExcluir(lesao.id); // guarda o id
                  setOpenDialog(true); // abre o diálogo
                }}
              >
                <Trash className="w-4 h-4 mr-1" /> Excluir
              </Button>
            </div>

            {/* Diálogo de confirmação */}
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
