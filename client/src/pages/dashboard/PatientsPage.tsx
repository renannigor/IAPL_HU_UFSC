import { useEffect, useState } from "react";
import { Paciente } from "../../types/patient";
import api from "../../api/api";
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
import { Helpers } from "../../utils/helpers";

const PatientsPage = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const [totalPacientes, setTotalPacientes] = useState<number>(0);

  const pacientesPorPagina = 8;
  const totalPaginas = Math.ceil(totalPacientes / pacientesPorPagina);

  const navigate = useNavigate();

  const carregarPacientes = async (): Promise<void> => {
    try {
      const res = await api.get("/api/pacientes/todos", {
        params: {
          pagina: paginaAtual,
        },
      });

      const pacientesData = Array.isArray(res.data) ? res.data : [];

      setPacientes(pacientesData);
      setTotalPacientes(pacientesData.length);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
    }
  };

  const gerarDocumento = (paciente: Paciente): void => {
    console.log("Gerar documento para paciente:", paciente.nome_completo);
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
      p.nome_completo,
      p.data_nascimento,
      p.idade.toString(),
      p.sexo,
      p.quarto,
      p.unidade_internacao,
      p.data_internacao,
      p.data_avaliacao_gicpel,
      p.alergias,
      p.cor_pele,
      p.altura.toString(),
      p.peso.toString(),
      p.imc.toFixed(2),
      p.motivo_internacao,
      p.comorbidades.join("; "),
      p.medicamentos_uso.join("; "),
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
                {Helpers.atributosTabelaPacientes.map((coluna) => (
                  <TableHead key={coluna}>
                    {coluna
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </TableHead>
                ))}
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pacientes.map((paciente) => (
                <TableRow key={paciente.id}>
                  <TableCell>{paciente.nome_completo}</TableCell>
                  <TableCell>{paciente.idade}</TableCell>
                  <TableCell>{paciente.data_internacao}</TableCell>
                  <TableCell>{paciente.quarto}</TableCell>
                  <TableCell>{paciente.unidade_internacao}</TableCell>
                  <TableCell>{paciente.sexo}</TableCell>
                  <TableCell>{paciente.data_avaliacao_gicpel}</TableCell>
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
                            navigate(`/dashboard/pacientes/${paciente.id}`);
                            console.log(
                              "Ver detalhes:",
                              paciente.nome_completo
                            );
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

export default PatientsPage;
