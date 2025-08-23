import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import PacienteService from "../services/PacienteService";
import { cores } from "@/shared/constants/cores";
import { Paciente } from "../types/Paciente";
import { Lesao } from "@/features/lesoes/types/Lesao";
import LesaoService from "@/features/lesoes/services/LesaoService";
import BreadcrumbNav from "@/shared/components/BreadcrumbNav";
import Info from "../components/Info";
import LesaoCard from "@/features/lesoes/components/LesaoCard";

function DetalhesPacientePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [lesoesPrecisaAprovacao, setLesoesPrecisaAprovacao] = useState<Lesao[]>(
    []
  );
  const [lesoesNaoPrecisaAprovacao, setLesoesNaoPrecisaAprovacao] = useState<
    Lesao[]
  >([]);

  useEffect(() => {
    const fetchPaciente = async () => {
      const data = await PacienteService.getPaciente(id!);
      setPaciente(data);
    };
    if (id) fetchPaciente();
  }, [id]);

  useEffect(() => {
    const fetchLesoes = async () => {
      const [precisaAprovacao, naoPrecisaAprovacao] = await Promise.all([
        LesaoService.getLesoes(id!, true),
        LesaoService.getLesoes(id!, false),
      ]);
      setLesoesPrecisaAprovacao(
        Array.isArray(precisaAprovacao) ? precisaAprovacao : []
      );
      setLesoesNaoPrecisaAprovacao(
        Array.isArray(naoPrecisaAprovacao) ? naoPrecisaAprovacao : []
      );
    };
    if (id) fetchLesoes();
  }, [id]);

  if (!paciente) {
    return (
      <div className="p-6 text-gray-500">
        Carregando informações do paciente...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <BreadcrumbNav
          items={[
            { label: "Início", href: "/dashboard" },
            { label: "Pacientes", href: "/dashboard/pacientes" },
            { label: paciente.nome },
          ]}
        />

        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="bg-gray-200 p-4 rounded-full">
              <User size={48} className="text-gray-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {paciente.nome}
              </h2>
              <p className="text-gray-500 text-sm">{paciente.idade} anos</p>
            </div>
          </div>

          {/* Botão de cadastro de lesão */}
          <Button
            className="text-white"
            style={{ backgroundColor: cores.primary }}
            onClick={() =>
              navigate(`/dashboard/pacientes/${id}/lesoes/cadastrar`)
            }
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = cores.primaryLight)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = cores.primary)
            }
          >
            + Cadastrar Lesão
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="flex gap-2 border-b bg-transparent">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="lesoes">Lesões</TabsTrigger>
            <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          </TabsList>

          {/* Aba: Informações */}
          <TabsContent value="info">
            <Card className="mt-6 shadow-sm border rounded-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Informações do Paciente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  <Info label="Internação" value={paciente.internacao} />
                  <Info label="Nascimento" value={paciente.nascimento} />
                  <Info label="Sexo" value={paciente.sexo} />
                  <Info label="Cor" value={paciente.cor} />
                  <Info label="Quarto" value={paciente.qrt_numero || "-"} />
                  <Info label="Leito" value={paciente.lto_lto_id || "-"} />
                  <Info
                    label="Peso Consultado"
                    value={paciente.peso_consultada || "-"}
                  />
                  <Info
                    label="Altura Consultada"
                    value={paciente.altura_consultada || "-"}
                  />
                  <Info
                    label="Peso Controle"
                    value={paciente.peso_controle || "-"}
                  />
                  <Info
                    label="Altura Controle"
                    value={paciente.altura_controle || "-"}
                  />
                  <Info label="IMC" value={paciente.imc || "-"} />
                  <Info
                    label="Criticidade Alérgica"
                    value={paciente.criticidade_alergica || "-"}
                  />
                  <Info
                    label="Classificação Alérgica"
                    value={paciente.classificacao_alergica || "-"}
                  />
                  <Info
                    label="Grau de Certeza"
                    value={paciente.grau_certeza || "-"}
                  />
                  <Info
                    label="Medicamento"
                    value={paciente.medicamento || "-"}
                  />
                  <Info
                    label="Agente Causador"
                    value={paciente.agente_causador || "-"}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Lesões */}
          <TabsContent value="lesoes">
            <div className="mt-6 space-y-4">
              {lesoesNaoPrecisaAprovacao.length > 0 ? (
                lesoesNaoPrecisaAprovacao.map((lesao) => (
                  <LesaoCard key={lesao.id} lesao={lesao} tipo="normal" />
                ))
              ) : (
                <p className="text-gray-500">Nenhuma lesão registrada.</p>
              )}
            </div>
          </TabsContent>

          {/* Aba: Pendentes */}
          <TabsContent value="pendentes">
            <div className="mt-6 space-y-4">
              {lesoesPrecisaAprovacao.length > 0 ? (
                lesoesPrecisaAprovacao.map((lesao) => (
                  <LesaoCard key={lesao.id} lesao={lesao} tipo="pendente" />
                ))
              ) : (
                <p className="text-gray-500">Nenhuma lesão pendente.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
    </div>
  );
}

export default DetalhesPacientePage;
