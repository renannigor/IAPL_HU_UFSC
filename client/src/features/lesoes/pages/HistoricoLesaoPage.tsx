import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import { toast } from "sonner";
import { CopyIcon, EyeIcon, Pencil } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import LesaoService from "../services/LesaoService";
import { LesaoComNomeFormData } from "../types/LesaoComNomeFormData";
import { BreadcrumbNav } from "@/shared/components/layout/BreadcrumbNav";

interface HistoricoItem {
  id: number;
  lesao_original_id: number;
  lesao_base_id: number;
  lesao_versao_id: number;
  data_criacao: string;
}

export default function HistoricoPacientePage() {
  const { id_lesao, id_paciente } = useParams();
  const { usuarioAtual } = useAuth();

  const [lesaoOriginal, setLesaoOriginal] = useState<LesaoComNomeFormData>();
  const [historicoLesoes, setHistoricoLesoes] = useState<
    { item: HistoricoItem; dados: LesaoComNomeFormData }[]
  >([]);

  async function fetchHistorico() {
    try {
      const historico: HistoricoItem[] = await LesaoService.getHistoricoLesao(
        id_lesao!
      );
      const historicoComDados = await Promise.all(
        historico.map(async (item) => {
          const { dados } = await LesaoService.getLesaoComNomes(
            String(item.lesao_versao_id)
          );
          return { item, dados };
        })
      );
      setHistoricoLesoes(
        historicoComDados.sort(
          (a, b) =>
            new Date(b.item.data_criacao).getTime() -
            new Date(a.item.data_criacao).getTime()
        )
      );
    } catch (error) {
      toast.error("Erro ao carregar o histórico da lesão");
    }
  }

  async function fetchLesaoOriginal() {
    const { dados } = await LesaoService.getLesaoComNomes(id_lesao!);
    setLesaoOriginal(dados);
  }

  useEffect(() => {
    fetchLesaoOriginal();
    fetchHistorico();
  }, [id_lesao, id_paciente]);

  async function handleDuplicar(idVersao: string) {
    try {
      await LesaoService.duplicarLesao(
        usuarioAtual?.cpf!,
        id_paciente!,
        lesaoOriginal!.id,
        idVersao
      );
      toast.success("Lesão duplicada com sucesso!");
      fetchHistorico(); // Atualiza tela
    } catch (error) {
      toast.error("Erro ao duplicar lesão");
    }
  }

  if (!lesaoOriginal)
    return <div className="p-6 text-gray-500">Carregando...</div>;

  return (
    <div className="space-y-8 px-4 md:px-6 pb-12">
      <BreadcrumbNav
        itens={[
          { titulo: "Home", href: "/" },
          { titulo: "Pacientes", href: "/dashboard/pacientes" },
          {
            titulo: id_paciente!,
            href: `/dashboard/pacientes/${id_paciente}`,
          },
          {
            titulo: "Histórico",
            href: `/dashboard/pacientes/${id_paciente}/lesoes/${id_lesao}/historico`,
          },
        ]}
      />

      {/* HISTÓRICO */}
      <div className="relative border-l border-gray-300 ml-4 pl-6 space-y-8">
        {historicoLesoes.map(({ item, dados }) => (
          <div key={item.id} className="relative">
            <span className="absolute -left-[9px] top-2 h-3 w-3 rounded-full bg-blue-600" />
            <CardLesao
              titulo={`Versão criada em ${item.data_criacao}`}
              dados={dados}
              idLesao={String(item.lesao_versao_id)}
              onDuplicar={() => handleDuplicar(String(item.lesao_versao_id))}
            />
          </div>
        ))}
      </div>

      {/* ORIGINAL */}
      <div className="pt-8">
        <CardLesao
          titulo="Lesão Original"
          dados={lesaoOriginal}
          idLesao={lesaoOriginal.id}
          onDuplicar={() => handleDuplicar(lesaoOriginal.id)}
        />
      </div>
    </div>
  );
}

function CardLesao({
  titulo,
  dados,
  idLesao,
  onDuplicar,
}: {
  titulo: string;
  dados: LesaoComNomeFormData;
  idLesao: string;
  isOriginal?: boolean;
  onDuplicar: () => void;
}) {
  const { id_paciente } = useParams();
  const navigate = useNavigate();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <CardTitle>{titulo}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {`Próxima avaliação: ${new Date(
              dados.dataProximaAvaliacao
            ).toLocaleDateString("pt-BR")}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              navigate(
                `/dashboard/pacientes/${id_paciente}/lesoes/${idLesao}/detalhes`
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
                `/dashboard/pacientes/${id_paciente}/lesoes/${idLesao}/editar`
              )
            }
          >
            <Pencil className="w-4 h-4 mr-1" /> Editar
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="bg-[#1F4D2C]/90 text-white hover:bg-[#1F4D2C] transition-colors"
            onClick={onDuplicar}
          >
            <CopyIcon size={16} className="mr-1" /> Duplicar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-1">
        <p>Presença de Túnel: {dados.presencaTunel}</p>
        <p>Dor: {dados.dor}</p>
        <p>
          Tamanho: {dados.tamanho.comprimento} x {dados.tamanho.largura} x{" "}
          {dados.tamanho.profundidade} cm
        </p>
        <p>Exsudato: {dados.quantidadeExsudato}</p>
      </CardContent>
    </Card>
  );
}
