import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Paciente } from "@/types/Paciente";
import { Lesao } from "@/types/Lesao";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Editor from "@/components/shared/Editor";
import { Button } from "@/components/ui/button";
import { UserIcon, Plus } from "lucide-react";

import PacienteService from "@/services/PacienteService";
import LesaoService from "@/services/LesaoService";
import CardLesao from "./components/CardLesao";
import { BreadcrumbNav } from "@/pages/dashboard/components/BreadcrumbNav";

const DetalhesPacientePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [refetchLesoes, setRefetchLesoes] = useState(false);
  const [lesoesPrecisaAprovacao, setLesoesPrecisaAprovacao] = useState<Lesao[]>(
    []
  );
  const [lesoesNaoPrecisaAprovacao, setLesoesNaoPrecisaAprovacao] = useState<
    Lesao[]
  >([]);

  useEffect(() => {
    const fetchPaciente = async () => {
      const data = await PacienteService.obterPaciente(id!);
      setPaciente(data);
    };

    if (id) fetchPaciente();
  }, [id]);

  useEffect(() => {
    const fetchLesoes = async () => {
      const [precisaAprovacao, naoPrecisaAprovacao] = await Promise.all([
        LesaoService.obterTodasLesoes(id!, true),
        LesaoService.obterTodasLesoes(id!, false),
      ]);

      setLesoesPrecisaAprovacao(
        Array.isArray(precisaAprovacao) ? precisaAprovacao : []
      );
      setLesoesNaoPrecisaAprovacao(
        Array.isArray(naoPrecisaAprovacao) ? naoPrecisaAprovacao : []
      );
    };

    if (id) fetchLesoes();
  }, [id, refetchLesoes]);

  if (!paciente) return <p>Carregando...</p>;

  return (
    <div className="space-y-8">
      <div>
        <BreadcrumbNav
          itens={[
            { titulo: "Home", href: "/" },
            { titulo: "Pacientes", href: "/dashboard/pacientes" },
            { titulo: id!, href: `/dashboard/pacientes/${id}` },
          ]}
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-200 flex items-center justify-center text-xl font-semibold text-green-800">
            <UserIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-lg font-semibold">{paciente.nome}</p>
            <p className="text-sm text-muted-foreground">
              {paciente.idade} anos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-green-800 text-white hover:bg-green-900 h-fit flex items-center gap-2"
            onClick={() =>
              navigate(`/dashboard/pacientes/${id}/lesoes/cadastrar`)
            }
          >
            <Plus size={16} />
            Cadastrar Lesão
          </Button>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="info">Informações do Paciente</TabsTrigger>
          <TabsTrigger value="lesoes">Lesões</TabsTrigger>
          <TabsTrigger value="pendencias">Pendentes de Aprovação</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Editor
              id="dataNascimento"
              label="Data de Nascimento"
              placeholder="Data de nascimento do paciente"
              ehCampoSenha={false}
              value={paciente.nascimento}
              disabled={paciente.nascimento ? true : false}
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
            <Editor
              id="cor"
              label="Cor da Pele"
              placeholder="Cor da pele do paciente"
              ehCampoSenha={false}
              value={paciente.cor}
              disabled={paciente.cor ? true : false}
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
            <Editor
              id="alturaConsultada"
              label="Altura Consultada"
              placeholder="Altura consultada do paciente"
              ehCampoSenha={false}
              value={paciente.altura_consultada?.toString()}
              disabled={paciente.altura_consultada ? true : false}
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
            <Editor
              id="pesoConsultado"
              label="Peso Consultado"
              placeholder="Peso consultado do paciente"
              ehCampoSenha={false}
              value={paciente.peso_consultada?.toString()}
              disabled={paciente.peso_consultada ? true : false}
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
            <Editor
              id="alturaControle"
              label="Altura Controle"
              placeholder="Altura controle do paciente"
              ehCampoSenha={false}
              value={paciente.altura_controle?.toString()}
              disabled={paciente.altura_controle ? true : false}
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
            <Editor
              id="pesoControle"
              label="Peso Controle"
              placeholder="Peso controle do paciente"
              ehCampoSenha={false}
              value={paciente.peso_controle?.toString()}
              disabled={paciente.peso_controle ? true : false}
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
            <Editor
              id="imc"
              label="IMC"
              placeholder="IMC do paciente"
              ehCampoSenha={false}
              value={paciente.imc?.toString()}
              disabled={paciente.imc ? true : false}
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
            <Editor
              id="sexo"
              label="Sexo"
              placeholder="Sexo do paciente"
              ehCampoSenha={false}
              value={paciente.sexo}
              disabled={paciente.sexo ? true : false}
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
            <Editor
              id="quarto"
              label="Número do Quarto"
              placeholder="Número do Quarto"
              ehCampoSenha={false}
              value={paciente.qrt_numero?.toString()}
              disabled={paciente.qrt_numero ? true : false}
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
            <Editor
              id="leito"
              label="Leito"
              placeholder="Leito do paciente"
              ehCampoSenha={false}
              value={paciente.lto_lto_id?.toString()}
              disabled={paciente.lto_lto_id ? true : false}
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
            <Editor
              id="criticidadeAlergica"
              label="Criticidade Alérgica"
              placeholder="Criticidade Alérgica do paciente"
              ehCampoSenha={false}
              value={paciente.criticidade_alergica!}
              disabled={paciente.criticidade_alergica ? true : false}
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
            <Editor
              id="grauCerteza"
              label="Grau de Certeza"
              placeholder="Grau de Certeza"
              ehCampoSenha={false}
              value={paciente.grau_certeza!}
              disabled={paciente.grau_certeza ? true : false}
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
            <Editor
              id="medicamentos"
              label="Medicamentos em Uso"
              placeholder="Medicamentos em uso pelo paciente"
              ehCampoSenha={false}
              value={paciente.medicamento!}
              disabled={paciente.medicamento ? true : false}
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
            <Editor
              id="agenteCausador"
              label="Agente Causador"
              placeholder="Agente Causador"
              ehCampoSenha={false}
              value={paciente.agente_causador!}
              disabled={paciente.agente_causador ? true : false}
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
            <Editor
              id="classificacaoAlergica"
              label="Classificação Alérgica"
              placeholder="Classificação Alérgica"
              ehCampoSenha={false}
              value={paciente.classificacao_alergica!}
              disabled={paciente.classificacao_alergica ? true : false}
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
          </div>
        </TabsContent>

        <TabsContent value="lesoes">
          <div className="space-y-6">
            <p className="text-muted-foreground">Lesões do paciente</p>
            <CardLesao
              lesoes={lesoesNaoPrecisaAprovacao}
              onRefresh={() => setRefetchLesoes((prev) => !prev)}
            />
          </div>
        </TabsContent>

        <TabsContent value="pendencias">
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Lesões do paciente, cadastradas pelos acadêmicos, para revisão.
            </p>
            <CardLesao
              lesoes={lesoesPrecisaAprovacao}
              onRefresh={() => setRefetchLesoes((prev) => !prev)}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetalhesPacientePage;
