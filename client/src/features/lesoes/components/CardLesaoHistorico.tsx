import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { EyeIcon, Pencil, CopyIcon, UserCircle, Trash2 } from "lucide-react";
import { Button } from "@/ui/button";
import { Lesao } from "../types/Lesao";
import { TiposUsuario } from "@/features/usuarios/constants/TiposUsuario.enum";

interface Props {
  titulo: string;
  dados: Lesao;
  lesaoId: string;
  onDuplicar: () => void;
  onExcluir?: () => void;
  usuarioAtual: { tipo: string } | null;
}

export default function CardLesaoHistorico({
  titulo,
  dados,
  lesaoId,
  onDuplicar,
  onExcluir,
  usuarioAtual,
}: Props) {
  const { id_paciente } = useParams();
  const navigate = useNavigate();

  // Verifica se usuário é acadêmico
  const isAcademico = usuarioAtual?.tipo === TiposUsuario.Academico;

  return (
    <Card
      className={`w-full transition-colors ${
        dados.precisa_aprovacao ? "border-2 border-yellow-400 bg-yellow-50" : ""
      }`}
    >
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <CardTitle>{titulo}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {`Próxima avaliação: ${new Date(
              dados.data_proxima_avaliacao
            ).toLocaleDateString("pt-BR")}`}
          </p>
          {dados.precisa_aprovacao && (
            <p className="text-xs font-medium text-yellow-700">
              ⚠ Esta lesão precisa de aprovação
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              navigate(
                `/dashboard/pacientes/${id_paciente}/lesoes/${lesaoId}/detalhes`
              )
            }
          >
            <EyeIcon size={16} className="mr-1" /> Ver detalhes
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              navigate(
                `/dashboard/pacientes/${id_paciente}/lesoes/${lesaoId}/editar`
              )
            }
            disabled={
              dados.precisa_aprovacao ? false : isAcademico ? true : false
            }
          >
            <Pencil className="w-4 h-4 mr-1" /> Editar
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="bg-[#1F4D2C]/90 text-white hover:bg-[#1F4D2C]"
            onClick={onDuplicar}
            disabled={dados.precisa_aprovacao ? true : false}
          >
            <CopyIcon size={16} className="mr-1" /> Duplicar
          </Button>

          {dados.precisa_aprovacao && onExcluir && (
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
              onClick={onExcluir}
            >
              <Trash2 className="w-4 h-4 mr-1" /> Excluir
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="border-t pt-3 text-xs text-gray-600">
        <div className="flex flex-col space-y-1">
          {[
            { label: "Criado por:", value: dados.nome_criador },
            { label: "Modificado por:", value: dados.nome_modificador },
            { label: "Aprovado por:", value: dados.nome_aprovador },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <UserCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <strong className="w-24">{label}</strong>
              <span>{value || "—"}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardContent className="text-sm text-muted-foreground space-y-1">
        <p>Presença de Túnel: {dados.presenca_tunel}</p>
        <p>Dor: {dados.possui_dor}</p>
        <p>
          Tamanho: {dados.comprimento} x {dados.largura} x {dados.profundidade}{" "}
          cm
        </p>
        <p>Localização da Lesão: {dados.localizacao}</p>
      </CardContent>
    </Card>
  );
}
