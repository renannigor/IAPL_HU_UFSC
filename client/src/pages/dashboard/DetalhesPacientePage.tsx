import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Paciente } from "@/types/paciente";
import { Lesao } from "@/types/lesao";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Editor from "@/components/shared/Editor";
import { Button } from "@/components/ui/button";
import { UserIcon, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import PacienteService from "@/services/PacienteService";
import LesaoService from "@/services/LesaoService";
import CardLesao from "./components/CardLesao";
import { BreadcrumbNav } from "@/pages/dashboard/components/BreadcrumbNav";

const DetalhesPacientePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [lesoesAcademicos, setLesoesAcademicos] = useState<Lesao[]>([]);
  const [lesoesNaoAcademicos, setLesoesNaoAcademicos] = useState<Lesao[]>([]);

  useEffect(() => {
    const fetchPaciente = async () => {
      const data = await PacienteService.obterPaciente(id!);
      setPaciente(data);
    };

    if (id) fetchPaciente();
  }, [id]);

  useEffect(() => {
    const fetchLesoes = async () => {
      const [academicos, naoAcademicos] = await Promise.all([
        LesaoService.obterTodasLesoes(id!, true),
        LesaoService.obterTodasLesoes(id!, false),
      ]);
      setLesoesAcademicos(Array.isArray(academicos) ? academicos : []);
      setLesoesNaoAcademicos(Array.isArray(naoAcademicos) ? naoAcademicos : []);
    };

    fetchLesoes();
  }, []);

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
            <p className="text-lg font-semibold">{paciente.nome_completo}</p>
            <p className="text-sm text-muted-foreground">
              {paciente.idade} anos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-green-800 text-white hover:bg-green-900 h-fit"
            onClick={() =>
              navigate(`/dashboard/pacientes/${id}/lesoes/cadastrar`)
            }
          >
            Cadastrar Lesão
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gray-300">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => alert("Gerar ficha em construção")}
              >
                Gerar ficha
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="info">Informações do Paciente</TabsTrigger>
          <TabsTrigger value="lesoes">Lesões</TabsTrigger>
          <TabsTrigger value="pendencias">Pendências</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Editor
              id="dataNascimento"
              label="Data de Nascimento"
              placeholder="Data de nascimento do paciente"
              ehCampoSenha={false}
              value={paciente.data_nascimento}
              disabled
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
            <Editor
              id="alergias"
              label="Alergias"
              placeholder="Alergias do paciente"
              ehCampoSenha={false}
              value={paciente.alergias}
              disabled
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
            <Editor
              id="cor"
              label="Cor da Pele"
              placeholder="Cor da pele do paciente"
              ehCampoSenha={false}
              value={paciente.cor_pele}
              disabled
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
            <Editor
              id="altura"
              label="Altura"
              placeholder="Altura do paciente"
              ehCampoSenha={false}
              value={paciente.altura?.toString()}
              disabled
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
            <Editor
              id="peso"
              label="Peso"
              placeholder="Peso do paciente"
              ehCampoSenha={false}
              value={paciente.peso?.toString()}
              disabled
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
            <Editor
              id="imc"
              label="IMC"
              placeholder="IMC do paciente"
              ehCampoSenha={false}
              value={paciente.imc?.toString()}
              disabled
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
            <Editor
              id="comorbidades"
              label="Comorbidades"
              placeholder="Comorbidades do paciente"
              ehCampoSenha={false}
              value={paciente.comorbidades}
              disabled
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
            <Editor
              id="medicamentos"
              label="Medicamentos em Uso"
              placeholder="Medicamentos em uso pelo paciente"
              ehCampoSenha={false}
              value={paciente.medicamentos_uso}
              disabled
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
            <Editor
              id="motivoInternacao"
              label="Motivo de Internação"
              placeholder="Motivo de internação do paciente"
              ehCampoSenha={false}
              value={paciente.motivo_internacao}
              disabled
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
          </div>
        </TabsContent>

        <TabsContent value="lesoes">
          <div className="space-y-6">
            <p className="text-muted-foreground">Lesões do paciente</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CardLesao lesoes={lesoesNaoAcademicos} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pendencias">
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Informações sobre as lesões do paciente, cadastradas pelos
              acadêmicos, para revisão.
            </p>

            <div>
              <CardLesao lesoes={lesoesAcademicos} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetalhesPacientePage;
