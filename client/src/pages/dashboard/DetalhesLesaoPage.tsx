import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LesaoService from "@/services/LesaoService";
import { useParams } from "react-router-dom";
import { ClipboardCopyIcon } from "lucide-react";
import { toast } from "sonner";
import { DadosLesaoFormatado } from "@/types/Lesao";
import { Button } from "@/components/ui/button";
import { BreadcrumbNav } from "./components/BreadcrumbNav";

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

  useEffect(() => {
    const fetchLesao = async () => {
      const data = await LesaoService.getLesaoComNomes(id_lesao!);
      console.log(data.dados);
      setDadosLesao(data.dados);
    };
    fetchLesao();
  }, [id_paciente, id_lesao]);

  if (!dadosLesao) {
    return (
      <div className="p-6 text-gray-500">Carregando dados da lesão...</div>
    );
  }

  const {
    etiologias,
    classificacoesLesaoPressao,
    regioesPerilesionais,
    regiaoPerilesionalOutro,
    bordas,
    tecidos,
    estruturasNobres,
    estruturaNobreOutro,
    presencaTunel,
    dor,
    escalaNumericaDor,
    classificacoesDor,
    exsudato,
    tipoExsudato,
    odor,
    tamanho,
    limpezas,
    limpezaOutro,
    desbridamentos,
    desbridamentoOutro,
    protecoes,
    protecaoOutro,
    coberturas,
    tiposFechamentoCurativo,
  } = dadosLesao;

  return (
    <div className="space-y-8 px-6 pb-12">
      <div className="flex items-center justify-between">
        <BreadcrumbNav
          itens={[
            { titulo: "Home", href: "/" },
            { titulo: "Pacientes", href: "/dashboard/pacientes" },
            {
              titulo: id_paciente!,
              href: `/dashboard/pacientes/${id_paciente}`,
            },
            {
              titulo: "Informações Adicionais",
              href: `/dashboard/pacientes/${id_paciente}/lesoes/${id_lesao}/detalhes`,
            },
          ]}
        />

        <Button
          onClick={async () => {
            try {
              //await LesaoService.aprovarLesao(id_lesao!);
              toast.success("Lesão aprovada com sucesso!");
            } catch (error) {
              console.error("Erro ao aprovar lesão:", error);
              toast.error("Erro ao aprovar lesão.");
            }
          }}
          className="bg-green-100 text-green-800 hover:bg-green-200"
        >
          Aprovar Lesão
        </Button>
      </div>

      {/* RESUMO GERAL */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Geral</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <LabelValue label="Presença de Túnel" value={presencaTunel} />
          <LabelValue label="Dor" value={dor} />
          {dor != "nao" && (
            <LabelValue label="Nível da dor" value={String(escalaNumericaDor)} />
          )}
          <LabelValue label="Exsudato" value={exsudato} />
          <LabelValue label="Tipo de Exsudato" value={tipoExsudato} />
          <LabelValue label="Odor" value={odor} />
          <LabelValue
            label="Tamanho"
            value={`Comprimento: ${tamanho.comprimento} cm\nLargura: ${tamanho.largura} cm\nProfundidade: ${tamanho.profundidade} cm`}
          />
        </CardContent>
      </Card>

      {/* ETIOLOGIAS E CLASSIFICAÇÕES */}
      <Card>
        <CardHeader>
          <CardTitle>Etiologias e Classificações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <LabelValue label="Etiologias" value={etiologias.join(", ")} />
          {classificacoesLesaoPressao && (
            <LabelValue
              label="Classificações Lesão por Pressão"
              value={classificacoesLesaoPressao.join(", ")}
            />
          )}
        </CardContent>
      </Card>

      {/* ASPECTOS VISUAIS */}
      <Card>
        <CardHeader>
          <CardTitle>Aspectos Visuais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <LabelValue label="Bordas" value={bordas.join(", ")} />
          <LabelValue
            label="Tecidos"
            value={tecidos.map((t) => `${t.nome} (${t.valor}%)`).join(", ")}
          />
        </CardContent>
      </Card>

      {/* REGIÕES E ESTRUTURAS */}
      <Card>
        <CardHeader>
          <CardTitle>Regiões e Estruturas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <LabelValue
            label="Regiões Perilesionais"
            value={regioesPerilesionais.join(", ")}
          />
          {regiaoPerilesionalOutro && (
            <LabelValue
              label="Outra Região Perilesional"
              value={regiaoPerilesionalOutro}
            />
          )}
          <LabelValue
            label="Estruturas Nobres"
            value={estruturasNobres.join(", ")}
          />
          {estruturaNobreOutro && (
            <LabelValue
              label="Outra Estrutura Nobre"
              value={estruturaNobreOutro}
            />
          )}
        </CardContent>
      </Card>

      {/* TRATAMENTO */}
      <Card>
        <CardHeader>
          <CardTitle>Tratamento Aplicado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {dor != "nao" && (
            <LabelValue
              label="Quantificações da Dor"
              value={classificacoesDor?.join(", ") || "-"}
            />
          )}
          <LabelValue label="Limpezas" value={limpezas.join(", ")} />
          {limpezaOutro && (
            <LabelValue label="Outra Limpeza" value={limpezaOutro} />
          )}
          <LabelValue
            label="Desbridamentos"
            value={desbridamentos.join(", ")}
          />
          {desbridamentoOutro && (
            <LabelValue
              label="Outro Desbridamento"
              value={desbridamentoOutro}
            />
          )}
          <LabelValue label="Proteções" value={protecoes.join(", ")} />
          {protecaoOutro && (
            <LabelValue label="Outra Proteção" value={protecaoOutro} />
          )}
          <LabelValue
            label="Coberturas"
            value={coberturas.map((c) => `${c.nome} (${c.valor})`).join(", ")}
          />
          <LabelValue
            label="Tipos de Fechamento Curativo"
            value={tiposFechamentoCurativo
              .map((f) => `${f.nome} (${f.valor})`)
              .join(", ")}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DetalhesLesaoPage;
