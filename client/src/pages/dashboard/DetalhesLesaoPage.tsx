import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LesaoService from "@/services/LesaoService";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ClipboardCopyIcon } from "lucide-react";
import { toast } from "sonner";
import { DadosLesaoFormatado } from "@/types/lesao";
import { Button } from "@/components/ui/button";

function LabelValue({ label, value }: { label: string; value: string }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    toast.success("Copiado para a área de transferência");
  };

  return (
    <div className="flex items-start justify-between gap-4 p-1 border-b last:border-none">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-base text-black">{value}</p>
      </div>
      <button
        onClick={copyToClipboard}
        className="text-muted-foreground hover:text-black"
      >
        <ClipboardCopyIcon size={16} />
      </button>
    </div>
  );
}

const DetalhesLesaoPage = () => {
  const { id_lesao, id_paciente } = useParams();
  const [dadosLesao, setDadosLesao] = useState<DadosLesaoFormatado>();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLesao = async () => {
      const data = await LesaoService.obterLesao(id_lesao!);
      setDadosLesao(data.dados);
    };
    fetchLesao();
  }, [id_paciente, id_lesao]);

  if (!dadosLesao) {
    return (
      <div className="p-6 text-gray-500">Carregando dados da lesão...</div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Botão para voltar */}
      <div className="space-y-6">
        <Button
          variant="outline"
          onClick={() => navigate(`/dashboard/pacientes/${id_paciente}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      {/* Informações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">
            Informações Gerais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <LabelValue
            label="Etiologias"
            value={dadosLesao.etiologias.join(", ")}
          />
          <LabelValue
            label="Classificações"
            value={dadosLesao.classificacoesLesaoPressao.join(", ")}
          />
          <LabelValue
            label="Regiões Perilesionais"
            value={dadosLesao.regioesPerilesionais.join(", ")}
          />
          {dadosLesao.regiaoPerilesionalOutro && (
            <LabelValue
              label="Outra Região Perilesional"
              value={dadosLesao.regiaoPerilesionalOutro}
            />
          )}
          <LabelValue label="Bordas" value={dadosLesao.bordas.join(", ")} />
        </CardContent>
      </Card>

      {/* Tecido */}
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">Tecido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <LabelValue
            label="Estruturas Nobres"
            value={dadosLesao.tecido.estruturasNobres.join(", ")}
          />
          {dadosLesao.tecido.estruturaNobreOutro && (
            <LabelValue
              label="Outra Estrutura Nobre"
              value={dadosLesao.tecido.estruturaNobreOutro}
            />
          )}
          {Object.entries(dadosLesao.tecido).map(([key, value]) => {
            if (typeof value === "number") {
              return <LabelValue key={key} label={key} value={value + "%"} />;
            }
            return null;
          })}
        </CardContent>
      </Card>

      {/* Dor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">Dor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <LabelValue label="Presença de Dor" value={dadosLesao.dor} />
          {dadosLesao.nivelDor && (
            <LabelValue
              label="Nível de Dor"
              value={String(dadosLesao.nivelDor)}
            />
          )}
          {dadosLesao.quantificacoesDor!.length > 0 && (
            <LabelValue
              label="Quantificações"
              value={dadosLesao.quantificacoesDor!.join(", ")}
            />
          )}
        </CardContent>
      </Card>

      {/* Exsudato */}
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">Exsudato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <LabelValue label="Quantidade" value={dadosLesao.exsudato} />
          <LabelValue label="Tipo" value={dadosLesao.tipoExsudato} />
          <LabelValue label="Odor" value={dadosLesao.odor} />
        </CardContent>
      </Card>

      {/* Tamanho */}
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">
            Tamanho da Lesão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <LabelValue
            label="Comprimento"
            value={`${dadosLesao.tamanho.comprimento} cm`}
          />
          <LabelValue
            label="Largura"
            value={`${dadosLesao.tamanho.largura} cm`}
          />
          <LabelValue
            label="Profundidade"
            value={`${dadosLesao.tamanho.profundidade} cm`}
          />
        </CardContent>
      </Card>

      {/* Cobertura Utilizada */}
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">
            Cobertura Utilizada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(dadosLesao.coberturaUtilizada)
            .filter(([, value]) => value > 0)
            .map(([key, value]) => (
              <LabelValue key={key} label={key} value={String(value)} />
            ))}
        </CardContent>
      </Card>

      {/* Fechamento do Curativo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-muted-foreground">
            Fechamento do Curativo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(dadosLesao.fechamentoCurativo)
            .filter(([, value]) => value > 0)
            .map(([key, value]) => (
              <LabelValue key={key} label={key} value={String(value)} />
            ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DetalhesLesaoPage;
