import { useEffect, useState } from "react";
import { Paciente } from "@/types/Paciente";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Utilitarios } from "../../utils/utilitarios";
import PacienteService from "@/services/PacienteService";
import { BreadcrumbNav } from "@/pages/dashboard/components/BreadcrumbNav";

const PacientesPage = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const [totalPacientes, setTotalPacientes] = useState<number>(0);

  const pacientesPorPagina = 8;
  const totalPaginas = Math.ceil(totalPacientes / pacientesPorPagina);

  const navigate = useNavigate();

  const carregarPacientes = async (): Promise<void> => {
    const data = await PacienteService.carregarPacientes(paginaAtual);

    const pacientesData = Array.isArray(data) ? data : [];

    setPacientes(pacientesData);
    setTotalPacientes(pacientesData.length);
  };

  const gerarDocumento = (paciente: Paciente): void => {
    console.log("Gerar documento para paciente:", paciente.nome);
  };

  const exportarCSV = (): void => {
    const header = [
      "Nome Completo",
      "Data de Nascimento",
      "Idade",
      "Sexo",
      "Quarto",
      "Unidade de Internação",
      "Data de Internação",
      "Data de Avaliação GICPel",
      "Alergias",
      "Cor da Pele",
      "Altura (cm)",
      "Peso (kg)",
      "IMC",
      "Motivo da Internação",
      "Comorbidades",
      "Medicamentos em Uso",
    ];

    const rows = pacientes.map((p) => [
      p.internacao,
      p.pac_codigo,
      p.nome,
      p.nascimento,
      p.cor,
      p.sexo,
      p.altura_consultada,
      p.peso_consultada,
      p.altura_controle,
      p.peso_controle,
      p.qrt_numero,
      p.lto_lto_id,
      p.criticidade_alergica,
      p.grau_certeza,
      p.medicamento,
      p.agente_causador,
      p.classificacao_alergica,
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pacientes.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    carregarPacientes();
  }, [paginaAtual]);

  return (
    <div className="space-y-4">
      <div>
        <BreadcrumbNav
          itens={[
            { titulo: "Home", href: "/" },
            { titulo: "Pacientes", href: "/dashboard/pacientes" },
          ]}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pacientes</h2>
          <p className="text-muted-foreground">
            Lista dos pacientes cadastrados no sistema AGHU.
          </p>
        </div>

        {/* Botão de Exportar */}
        <Button variant="outline" onClick={exportarCSV}>
          📁 Exportar CSV
        </Button>
      </div>

      <Card className="p-4">
        <CardContent className="overflow-auto">
          <Table>
            <TableCaption>Pacientes internados avaliados.</TableCaption>
            <TableHeader>
              <TableRow>
                {Utilitarios.atributosTabelaPacientes.map((coluna) => (
                  <TableHead key={coluna}>{coluna}</TableHead>
                ))}
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pacientes.map((paciente) => (
                <TableRow key={paciente.pac_codigo}>
                  <TableCell>{paciente.nome}</TableCell>
                  <TableCell>{paciente.internacao}</TableCell>
                  <TableCell>{paciente.nascimento}</TableCell>
                  <TableCell>{paciente.cor}</TableCell>
                  <TableCell>{paciente.qrt_numero}</TableCell>
                  <TableCell>{paciente.sexo}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded hover:bg-gray-100">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem
                          onClick={() => {
                            navigate(
                              `/dashboard/pacientes/${paciente.pac_codigo}`
                            );
                            console.log("Ver detalhes:", paciente.nome);
                          }}
                        >
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => gerarDocumento(paciente)}
                        >
                          Gerar ficha
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between px-4 py-2 mt-4 border-t">
            <span className="text-sm text-muted-foreground">
              {`${(paginaAtual - 1) * pacientesPorPagina + 1} - ${Math.min(
                paginaAtual * pacientesPorPagina,
                totalPacientes
              )} de ${totalPacientes} pacientes`}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPaginaAtual(paginaAtual - 1)}
                disabled={paginaAtual === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                onClick={() => setPaginaAtual(paginaAtual + 1)}
                disabled={paginaAtual === totalPaginas}
              >
                Próximo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PacientesPage;
