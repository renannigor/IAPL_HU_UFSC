import { useEffect, useState } from "react";
import { Paciente } from "@/features/pacientes/types/Paciente";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { FileDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PacienteService from "@/features/pacientes/services/PacienteService";
import {
  atributosTabelaPacientes,
  cabecalhoPanilhaPacientes,
} from "../utils/PacientesTableConfig";
import { BreadcrumbNav } from "@/shared/components/layout/BreadcrumbNav";

const PacientesPage = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const [totalPacientes, setTotalPacientes] = useState<number>(0);

  const pacientesPorPagina = 8;
  const totalPaginas = Math.ceil(totalPacientes / pacientesPorPagina);

  const navigate = useNavigate();

  // Carrega pacientes paginados com total para paginação correta
  const carregarPacientes = async (): Promise<void> => {
    const data = await PacienteService.getPacientes(
      paginaAtual,
      pacientesPorPagina
    );
    setPacientes(data.pacientes || []);
    setTotalPacientes(data.total || 0);
  };

  // Exporta os dados da página atual em CSV
  const exportarCSV = (): void => {
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
      p.idade,
      p.imc,
      p.qrt_numero,
      p.lto_lto_id,
      p.criticidade_alergica,
      p.grau_certeza,
      p.medicamento,
      p.agente_causador,
      p.classificacao_alergica,
    ]);

    const csvContent = [cabecalhoPanilhaPacientes, ...rows]
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
    <div className="w-full max-w-full px-6 py-8 bg-white rounded shadow space-y-6">
      <BreadcrumbNav
        itens={[
          { titulo: "Home", href: "/" },
          { titulo: "Pacientes", href: "/dashboard/pacientes" },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pacientes</h2>
          <p className="text-muted-foreground">
            Lista dos pacientes cadastrados no sistema AGHU.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={exportarCSV}>
            <FileDown className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border rounded-xl">
        <CardContent className="overflow-auto p-0">
          <Table>
            <TableCaption>Pacientes internados avaliados.</TableCaption>
            <TableHeader>
              <TableRow>
                {atributosTabelaPacientes.map((coluna) => (
                  <TableHead key={coluna}>{coluna}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pacientes.map((paciente) => (
                <TableRow key={paciente.pac_codigo}>
                  <TableCell className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-semibold text-sm">
                      {paciente.nome.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">{paciente.nome}</span>
                      <span className="text-sm text-muted-foreground">
                        {paciente.idade} anos
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{paciente.internacao}</TableCell>
                  <TableCell>{paciente.nascimento}</TableCell>
                  <TableCell>{paciente.cor}</TableCell>
                  <TableCell>{paciente.qrt_numero}</TableCell>
                  <TableCell>{paciente.sexo}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      className="text-green-700 hover:text-green-800 hover:underline"
                      onClick={() =>
                        navigate(`/dashboard/pacientes/${paciente.pac_codigo}`)
                      }
                    >
                      Visualizar
                    </Button>
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
