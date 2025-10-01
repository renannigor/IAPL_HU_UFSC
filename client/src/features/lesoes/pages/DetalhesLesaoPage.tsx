import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LesaoPorNomeFormData } from "../types/LesaoPorNomeFormData";
import { useAuth } from "@/providers/AuthProvider";
import LesaoService from "../services/LesaoService";
import BreadcrumbNav from "@/shared/components/BreadcrumbNav";
import { Paciente } from "@/features/pacientes/types/Paciente";
import PacienteService from "@/features/pacientes/services/PacienteService";

export default function DetalhesLesaoPage() {
  const { id_lesao, id_paciente } = useParams();
  const [dadosLesao, setDadosLesao] = useState<LesaoPorNomeFormData>();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const { usuarioAtual } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLesao = async () => {
      const { dados } = await LesaoService.getLesaoPorNome(id_lesao!);
      setDadosLesao(dados);
    };
    fetchLesao();
  }, [id_paciente, id_lesao]);

  useEffect(() => {
    const fetchPaciente = async () => {
      const data = await PacienteService.getPaciente(id_paciente!);
      setPaciente(data);
    };
    if (id_paciente) fetchPaciente();
  }, [id_paciente]);

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
    dataProximaAvaliacao,
    localizacaoLesao,
  } = dadosLesao;

  // Função para gerar resumo textual
  const gerarResumoTexto = () => {
    const texto = [
      `Localização: ${localizacaoLesao}`,
      `Possui Dor: ${dor === "sim" ? "Sim" : "Não"}`,
      dor === "sim" && escalaNumericaDor
        ? `Escala da Dor: ${escalaNumericaDor}`
        : null,
      classificacoesDor?.length
        ? `Classificações da Dor: ${classificacoesDor.join(", ")}`
        : null,
      `Presença de Túnel: ${presencaTunel === "sim" ? "Sim" : "Não"}`,
      quantidadeExsudato
        ? `Quantidade de Exsudato: ${quantidadeExsudato}`
        : null,
      tipoExsudato ? `Tipo de Exsudato: ${tipoExsudato}` : null,
      odor ? `Odor: ${odor}` : null,
      tamanho.comprimento || tamanho.largura || tamanho.profundidade
        ? `Tamanho:\n  Comprimento: ${tamanho.comprimento} cm\n  Largura: ${tamanho.largura} cm\n  Profundidade: ${tamanho.profundidade} cm`
        : null,
      etiologias?.length ? `Etiologias: ${etiologias.join(", ")}` : null,
      classificacoesLesaoPressao?.length
        ? `Classificações Lesão por Pressão: ${classificacoesLesaoPressao.join(
            ", "
          )}`
        : null,
      bordas?.length ? `Bordas: ${bordas.join(", ")}` : null,
      regioesPerilesionais?.length
        ? `Regiões Perilesionais: ${regioesPerilesionais.join(", ")}`
        : null,
      regiaoPerilesionalOutro
        ? `Outra Região Perilesional: ${regiaoPerilesionalOutro}`
        : null,
      estruturasNobres?.length
        ? `Estruturas Nobres: ${estruturasNobres.join(", ")}`
        : null,
      estruturaNobreOutro
        ? `Outra Estrutura Nobre: ${estruturaNobreOutro}`
        : null,
      limpezas?.length ? `Limpezas: ${limpezas.join(", ")}` : null,
      limpezaOutro ? `Outra Limpeza: ${limpezaOutro}` : null,
      desbridamentos?.length
        ? `Desbridamentos: ${desbridamentos.join(", ")}`
        : null,
      desbridamentoOutro ? `Outro Desbridamento: ${desbridamentoOutro}` : null,
      protecoes?.length || protecaoOutro
        ? `Proteções: ${protecoes.join(", ")}${
            protecaoOutro ? ", " + protecaoOutro : ""
          }`
        : null,
      coberturas.filter((c) => c.valor > 0).length
        ? `Coberturas: ${coberturas
            .filter((c) => c.valor > 0)
            .map((c) => `${c.nome} (${c.valor})`)
            .join(", ")}`
        : null,
      tiposFechamentoCurativo.filter((f) => f.valor > 0).length
        ? `Tipos de Fechamento Curativo: ${tiposFechamentoCurativo
            .filter((f) => f.valor > 0)
            .map((f) => `${f.nome} (${f.valor})`)
            .join(", ")}`
        : null,
      dataProximaAvaliacao
        ? `Próxima Avaliação: ${dataProximaAvaliacao}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    return texto;
  };

  const copiarResumo = () => {
    navigator.clipboard.writeText(gerarResumoTexto());
    toast.success("Resumo copiado para a área de transferência!");
  };

  const aprovarLesao = async () => {
    try {
      await LesaoService.setAprovacao(usuarioAtual?.cpf!, id_lesao!);
      navigate(`/dashboard/pacientes/${id_paciente}`);
    } catch (error) {
      toast.error("Erro ao aprovar lesão.");
    }
  };

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
      <h2 className="text-base font-semibold mb-2 text-gray-700">{title}</h2>
      <div className="text-gray-600 space-y-1 text-sm">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbNav
        items={[
          { label: "Início", href: "/dashboard" },
          { label: "Pacientes", href: "/dashboard/pacientes" },
          {
            label: paciente?.nome!,
            href: `/dashboard/pacientes/${id_paciente}`,
          },
          { label: "Detalhes da Lesão" },
        ]}
      />

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-xl font-bold text-gray-800">{`Detalhes da Lesão`}</h1>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={copiarResumo}>
            Copiar Resumo
          </Button>

          <Button size="sm" onClick={aprovarLesao}>
            Aprovar Lesão
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {localizacaoLesao && (
          <Section title="Localização">
            <p>{localizacaoLesao}</p>
          </Section>
        )}

        {etiologias?.length > 0 && (
          <Section title="Etiologias">
            <p>{etiologias.join(", ")}</p>
          </Section>
        )}

        {tamanho &&
        (tamanho.comprimento || tamanho.largura || tamanho.profundidade) ? (
          <Section title="Tamanho">
            <p>Comprimento: {tamanho.comprimento} cm</p>
            <p>Largura: {tamanho.largura} cm</p>
            <p>Profundidade: {tamanho.profundidade} cm</p>
          </Section>
        ) : null}

        {bordas?.length > 0 && (
          <Section title="Bordas">
            <p>{bordas.join(", ")}</p>
          </Section>
        )}

        {tecidos.filter((t) => t.valor > 0).length > 0 && (
          <Section title="Tecidos">
            {tecidos
              .filter((t) => t.valor > 0)
              .map((t) => (
                <p key={t.id}>
                  {t.nome} ({t.valor}%)
                </p>
              ))}
          </Section>
        )}

        {estruturasNobres?.length > 0 || estruturaNobreOutro ? (
          <Section title="Estruturas Nobres">
            {estruturasNobres.map((e) => (
              <p key={e}>{e}</p>
            ))}
            {estruturaNobreOutro && <p>Outro: {estruturaNobreOutro}</p>}
          </Section>
        ) : null}

        {regioesPerilesionais?.length > 0 || regiaoPerilesionalOutro ? (
          <Section title="Regiões Perilesionais">
            {regioesPerilesionais.map((r) => (
              <p key={r}>{r}</p>
            ))}
            {regiaoPerilesionalOutro && <p>Outro: {regiaoPerilesionalOutro}</p>}
          </Section>
        ) : null}

        {classificacoesLesaoPressao?.length! > 0 && (
          <Section title="Classificação Lesão por Pressão">
            <p>{classificacoesLesaoPressao!.join(", ")}</p>
          </Section>
        )}

        {dor && (
          <Section title="Dor">
            <p>{dor === "sim" ? "Sim" : "Não"}</p>
            {escalaNumericaDor && <p>Escala: {escalaNumericaDor}</p>}
            {classificacoesDor?.length! > 0 && (
              <p>Classificações: {classificacoesDor!.join(", ")}</p>
            )}
          </Section>
        )}

        {presencaTunel && (
          <Section title="Presença de Túnel">
            <p>{presencaTunel === "sim" ? "Sim" : "Não"}</p>
          </Section>
        )}

        {quantidadeExsudato && tipoExsudato && (
          <Section title="Exsudato">
            <p>Quantidade: {quantidadeExsudato}</p>
            <p>Tipo: {tipoExsudato}</p>
          </Section>
        )}

        {odor && (
          <Section title="Odor">
            <p>{odor}</p>
          </Section>
        )}

        {limpezas?.length > 0 || limpezaOutro ? (
          <Section title="Limpeza">
            {limpezas.map((l) => (
              <p key={l}>{l}</p>
            ))}
            {limpezaOutro && <p>Outro: {limpezaOutro}</p>}
          </Section>
        ) : null}

        {desbridamentos?.length > 0 || desbridamentoOutro ? (
          <Section title="Desbridamento">
            {desbridamentos.map((d) => (
              <p key={d}>{d}</p>
            ))}
            {desbridamentoOutro && <p>Outro: {desbridamentoOutro}</p>}
          </Section>
        ) : null}

        {protecoes?.length > 0 || protecaoOutro ? (
          <Section title="Proteções">
            {protecoes.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {protecaoOutro && <p>Outro: {protecaoOutro}</p>}
          </Section>
        ) : null}

        {coberturas.filter((c) => c.valor > 0).length > 0 && (
          <Section title="Coberturas">
            {coberturas
              .filter((c) => c.valor > 0)
              .map((c) => (
                <p key={c.id}>
                  {c.nome} ({c.valor})
                </p>
              ))}
          </Section>
        )}

        {tiposFechamentoCurativo.filter((f) => f.valor > 0).length > 0 && (
          <Section title="Fechamento do Curativo">
            {tiposFechamentoCurativo
              .filter((f) => f.valor > 0)
              .map((f) => (
                <p key={f.id}>
                  {f.nome} ({f.valor})
                </p>
              ))}
          </Section>
        )}

        {dataProximaAvaliacao && (
          <Section title="Próxima Avaliação">
            <p>
              {new Date(dataProximaAvaliacao).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </Section>
        )}
      </div>
    </div>
  );
}
