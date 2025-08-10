import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { useParams } from "react-router-dom";
import { ClipboardCopyIcon, CheckCheckIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/ui/button";
import { BreadcrumbNav } from "@/shared/components/layout/BreadcrumbNav";
import LesaoService from "../services/LesaoService";
import { useAuth } from "@/providers/AuthProvider";
import { LesaoComNomeFormData } from "../types/LesaoComNomeFormData";

function LabelValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 p-1 border-b last:border-none">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-base text-black whitespace-pre-line">{value}</p>
      </div>
    </div>
  );
}

const DetalhesLesaoPage = () => {
  const { id_lesao, id_paciente } = useParams();
  // Estado para armazenar os dados carregados da lesão
  const [dadosLesao, setDadosLesao] = useState<LesaoComNomeFormData>();

  const { usuarioAtual } = useAuth();

  // Efeito para carregar os dados da lesão quando o componente for montado
  useEffect(() => {
    const fetchLesao = async () => {
      const { dados } = await LesaoService.getLesaoComNomes(id_lesao!);
      console.log(dados);
      setDadosLesao(dados);
    };
    fetchLesao();
  }, [id_paciente, id_lesao]);

  if (!dadosLesao) {
    return (
      <div className="p-6 text-gray-500">Carregando dados da lesão...</div>
    );
  }

  // Desestruturando campos da lesão para uso mais prático
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
    quantidadeExsudato,
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

  // Função para gerar um resumo textual de todos os campos
  const gerarResumoTexto = () => {
    const texto = [
      `Presença de Túnel: ${presencaTunel}`,
      `Dor: ${dor}`,
      dor !== "nao" ? `Nível da dor: ${escalaNumericaDor ?? "-"}` : null,
      `Quantidade de Exsudato: ${quantidadeExsudato}`,
      `Tipo de Exsudato: ${tipoExsudato}`,
      `Odor: ${odor}`,
      tamanho.comprimento > 0 || tamanho.largura > 0 || tamanho.profundidade > 0
        ? `Tamanho:\n  Comprimento: ${tamanho.comprimento} cm\n  Largura: ${tamanho.largura} cm\n  Profundidade: ${tamanho.profundidade} cm`
        : null,
      `Etiologias: ${etiologias.join(", ")}`,
      classificacoesLesaoPressao?.length
        ? `Classificações Lesão por Pressão: ${classificacoesLesaoPressao.join(
            ", "
          )}`
        : null,
      `Bordas: ${bordas.join(", ")}`,
      tecidos
        .filter((t) => t.valor > 0)
        .map((t) => `${t.nome} (${t.valor}%)`)
        .join(", ")
        ? `Tecidos: ${tecidos
            .filter((t) => t.valor > 0)
            .map((t) => `${t.nome} (${t.valor}%)`)
            .join(", ")}`
        : null,
      `Regiões Perilesionais: ${regioesPerilesionais.join(", ")}`,
      regiaoPerilesionalOutro
        ? `Outra Região Perilesional: ${regiaoPerilesionalOutro}`
        : null,
      `Estruturas Nobres: ${estruturasNobres.join(", ")}`,
      estruturaNobreOutro
        ? `Outra Estrutura Nobre: ${estruturaNobreOutro}`
        : null,
      dor !== "nao" && classificacoesDor?.length
        ? `Classificações de Dor: ${classificacoesDor.join(", ")}`
        : null,
      `Limpezas: ${limpezas.join(", ")}`,
      limpezaOutro ? `Outra Limpeza: ${limpezaOutro}` : null,
      `Desbridamentos: ${desbridamentos.join(", ")}`,
      desbridamentoOutro ? `Outro Desbridamento: ${desbridamentoOutro}` : null,
      `Proteções: ${
        protecaoOutro
          ? protecoes.join(", ") + ", " + protecaoOutro
          : protecoes.join(", ")
      }`,
      coberturas
        .filter((c) => c.valor > 0)
        .map((c) => `${c.nome} (${c.valor})`)
        .join(", ")
        ? `Coberturas: ${coberturas
            .filter((c) => c.valor > 0)
            .map((c) => `${c.nome} (${c.valor})`)
            .join(", ")}`
        : null,
      tiposFechamentoCurativo
        .filter((f) => f.valor > 0)
        .map((f) => `${f.nome} (${f.valor})`)
        .join(", ")
        ? `Tipos de Fechamento Curativo: ${tiposFechamentoCurativo
            .filter((f) => f.valor > 0)
            .map((f) => `${f.nome} (${f.valor})`)
            .join(", ")}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    return texto;
  };

  // Copia o resumo para a área de transferência
  const copiarResumo = () => {
    navigator.clipboard.writeText(gerarResumoTexto());
    toast.success("Resumo copiado para a área de transferência!");
  };

  // Aprovação da lesão
  const aprovarLesao = async () => {
    try {
      await LesaoService.aprovarLesao(usuarioAtual?.cpf!, id_lesao!);
    } catch (error) {
      toast.error("Erro ao aprovar lesão.");
    }
  };

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

        <div className="flex items-center gap-2">
          {/* Botão para copiar resumo */}
          <Button
            variant="outline"
            onClick={copiarResumo}
            className="flex items-center gap-1"
          >
            <ClipboardCopyIcon size={16} />
            Copiar Resumo
          </Button>

          {/* Botão para aprovar lesão */}
          <Button
            variant="outline"
            onClick={aprovarLesao}
            className="flex items-center gap-1"
          >
            <CheckCheckIcon size={16} />
            Aprovar Lesão
          </Button>
        </div>
      </div>

      {/* RESUMO GERAL */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Geral</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <LabelValue label="Presença de Túnel" value={presencaTunel} />
          <LabelValue label="Dor" value={dor} />
          {dor !== "nao" && escalaNumericaDor !== undefined && (
            <LabelValue
              label="Nível da dor"
              value={String(escalaNumericaDor)}
            />
          )}
          <LabelValue
            label="Quantidade de Exsudato"
            value={quantidadeExsudato}
          />
          <LabelValue label="Tipo de Exsudato" value={tipoExsudato} />
          <LabelValue label="Odor" value={odor} />
          {(tamanho.comprimento > 0 ||
            tamanho.largura > 0 ||
            tamanho.profundidade > 0) && (
            <LabelValue
              label="Tamanho"
              value={`Comprimento: ${tamanho.comprimento} cm\nLargura: ${tamanho.largura} cm\nProfundidade: ${tamanho.profundidade} cm`}
            />
          )}
        </CardContent>
      </Card>

      {/* ETIOLOGIAS E CLASSIFICAÇÕES */}
      <Card>
        <CardHeader>
          <CardTitle>Etiologias e Classificações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <LabelValue label="Etiologias" value={etiologias.join(", ")} />
          {classificacoesLesaoPressao?.length! > 0 && (
            <LabelValue
              label="Classificações Lesão por Pressão"
              value={classificacoesLesaoPressao!.join(", ")}
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
          {tecidos.filter((t) => t.valor > 0).length > 0 && (
            <LabelValue
              label="Tecidos"
              value={tecidos
                .filter((t) => t.valor > 0)
                .map((t) => `${t.nome} (${t.valor}%)`)
                .join(", ")}
            />
          )}
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
          {dor !== "nao" && classificacoesDor?.length! > 0 && (
            <LabelValue
              label="Classificações da Dor"
              value={classificacoesDor!.join(", ")}
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
          {coberturas.filter((c) => c.valor > 0).length > 0 && (
            <LabelValue
              label="Coberturas"
              value={coberturas
                .filter((c) => c.valor > 0)
                .map((c) => `${c.nome} (${c.valor})`)
                .join(", ")}
            />
          )}
          {tiposFechamentoCurativo.filter((f) => f.valor > 0).length > 0 && (
            <LabelValue
              label="Tipos de Fechamento Curativo"
              value={tiposFechamentoCurativo
                .filter((f) => f.valor > 0)
                .map((f) => `${f.nome} (${f.valor})`)
                .join(", ")}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DetalhesLesaoPage;
