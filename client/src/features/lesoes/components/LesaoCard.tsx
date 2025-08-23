import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Lesao } from "../types/Lesao";
import { Button } from "@/components/ui/button";

/** Card para exibir informações da lesão */
function LesaoCard({
  lesao,
  tipo,
}: {
  lesao: Lesao;
  tipo: "normal" | "pendente";
}) {
  const navigate = useNavigate();

  return (
    <Card className="shadow-sm border rounded-xl">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-lg font-semibold text-gray-800">
              {lesao.localizacao}
            </h4>
            <p className="text-sm text-gray-500">
              Dimensões: {lesao.comprimento} x {lesao.largura} x{" "}
              {lesao.profundidade}
            </p>
            <p className="text-sm text-gray-500">
              Próxima Avaliação:{" "}
              {new Date(lesao.data_proxima_avaliacao).toLocaleDateString()}
            </p>
          </div>

          <div className="flex gap-2">
            {tipo === "pendente" ? (
              <>
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(
                      `/dashboard/pacientes/${lesao.paciente_id}/lesoes/${lesao.id}/detalhes`
                    )
                  }
                >
                  Ver Detalhes
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(
                      `/dashboard/pacientes/${lesao.paciente_id}/lesoes/${lesao.id}/editar`
                    )
                  }
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => console.log("Excluir", lesao.id)}
                >
                  Excluir
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() =>
                  navigate(
                    `/dashboard/pacientes/${lesao.paciente_id}/lesoes/${lesao.id}/historico`
                  )
                }
              >
                Ver Histórico
              </Button>
            )}
          </div>
        </div>

        {/* Collapsible para dados de registro */}
        <Collapsible className="mt-4">
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
            <ChevronDown size={16} /> Ver mais detalhes
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 text-sm text-gray-600 space-y-1">
            <p>Criador: {lesao.nome_criador || "-"}</p>
            <p>Modificador: {lesao.nome_modificador || "-"}</p>
            <p>Aprovador: {lesao.nome_aprovador || "-"}</p>
            <p>
              Data Criação: {new Date(lesao.data_criacao).toLocaleDateString()}
            </p>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

export default LesaoCard;
