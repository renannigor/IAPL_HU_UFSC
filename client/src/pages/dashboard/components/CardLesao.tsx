import { Button } from "@/components/ui/button";
import { Lesao } from "@/types/lesao";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CardLesaoProps {
  lesoes: Lesao[];
}

const CardLesao = ({ lesoes }: CardLesaoProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-6">
      {lesoes.map((lesao, index) => (
        <div
          key={lesao.id}
          className="rounded-2xl bg-white shadow-lg p-6 min-h-[240px] border border-gray-200 flex flex-col justify-between transition-shadow hover:shadow-xl"
        >
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold text-[#1F4D2C]">
                Lesão #{index + 1}
              </h3>
              <p className="text-sm text-gray-700">
                Dimensões:{" "}
                <span className="font-medium">
                  {lesao.comprimento} × {lesao.largura} × {lesao.profundidade}{" "}
                  cm
                </span>
              </p>
              <p className="text-sm text-gray-700">
                Dor:{" "}
                <Badge
                  variant={
                    lesao.possui_dor === "Sim" ? "destructive" : "outline"
                  }
                  className="text-xs"
                >
                  {lesao.possui_dor}
                </Badge>
              </p>
            </div>

            {(lesao.modificado_por || lesao.aprovado_por) && (
              <div className="text-xs text-gray-600 border-t border-gray-200 pt-2 space-y-1">
                <p>
                  Criado por:{" "}
                  <span className="font-medium">{lesao.criado_por}</span>
                </p>
                {lesao.modificado_por && (
                  <p>
                    Modificado por:{" "}
                    <span className="font-medium">{lesao.modificado_por}</span>
                  </p>
                )}
                {lesao.aprovado_por && (
                  <p>
                    Aprovado por:{" "}
                    <span className="font-medium">{lesao.aprovado_por}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end items-center mt-6 gap-2 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              className="text-[#1F4D2C] hover:bg-[#1F4D2C]/10 border border-transparent hover:border-[#1F4D2C]/20 transition-colors"
              onClick={() =>
                navigate(
                  `/dashboard/pacientes/${lesao.id_paciente}/lesoes/${lesao.id}/detalhes`
                )
              }
            >
              <Eye className="w-4 h-4 mr-1" /> Ver
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="bg-[#1F4D2C]/90 text-white hover:bg-[#1F4D2C] transition-colors shadow-sm"
              onClick={() =>
                navigate(
                  `/dashboard/pacientes/${lesao.id_paciente}/lesoes/${lesao.id}/editar`
                )
              }
            >
              <Pencil className="w-4 h-4 mr-1" /> Editar
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:bg-red-100 transition-colors"
              onClick={() => {
                if (confirm("Tem certeza que deseja excluir esta lesão?")) {
                  // deletar
                }
              }}
            >
              <Trash className="w-4 h-4 mr-1" /> Excluir
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardLesao;
