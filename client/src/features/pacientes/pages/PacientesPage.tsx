import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paciente } from "../types/Paciente";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import PacienteService from "../services/PacienteService";
import { atributosTabelaPacientes } from "../utils/PacientesTableConfig";

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const [totalPacientes, setTotalPacientes] = useState<number>(0);

  const pacientesPorPagina = 8;
  const totalPaginas = Math.ceil(totalPacientes / pacientesPorPagina);

  const navigate = useNavigate();

  const carregarPacientes = async (): Promise<void> => {
    const data = await PacienteService.getPacientes(
      paginaAtual,
      pacientesPorPagina
    );
    setPacientes(data.pacientes || []);
    setTotalPacientes(data.total || 0);
  };

  useEffect(() => {
    carregarPacientes();
  }, [paginaAtual]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <div className="mb-6 text-center max-w-[1600px] mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Pacientes
        </h2>
        <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
          Visualize e gerencie os pacientes cadastrados no sistema AGHU.
        </p>
      </div>

      <Card className="shadow-sm border rounded-xl max-w-[1600px] mx-auto">
        <CardContent className="overflow-x-auto p-2 sm:p-4">
          <Table className="w-full min-w-[600px] sm:min-w-[900px]">
            <TableCaption className="text-left">
              Pacientes internados avaliados.
            </TableCaption>
            <TableHeader>
              <TableRow>
                {atributosTabelaPacientes.map((coluna) => (
                  <TableHead key={coluna}>{coluna}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pacientes.map((paciente) => (
                <TableRow
                  key={paciente.pac_codigo}
                  className="hover:bg-gray-50"
                >
                  <TableCell className="flex items-center gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-semibold text-xs sm:text-sm">
                      {paciente.nome.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm sm:text-base">
                        {paciente.nome}
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {paciente.idade} anos
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm sm:text-base">
                    {paciente.internacao}
                  </TableCell>
                  <TableCell className="text-sm sm:text-base">
                    {paciente.nascimento}
                  </TableCell>
                  <TableCell className="text-sm sm:text-base">
                    {paciente.cor}
                  </TableCell>
                  <TableCell className="text-sm sm:text-base">
                    {paciente.qrt_numero || "-"}
                  </TableCell>
                  <TableCell className="text-sm sm:text-base">
                    {paciente.sexo}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      className="text-green-700 hover:text-green-800 hover:underline text-xs sm:text-sm"
                      onClick={() =>
                        navigate(`/dashboard/pacientes/${paciente.pac_codigo}`)
                      }
                    >
                      Visualizar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {pacientes.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-gray-500 text-sm sm:text-base"
                  >
                    Nenhum paciente encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Paginação */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-4 py-2 mt-4 border-t gap-2 sm:gap-0">
            <span className="text-xs sm:text-sm text-muted-foreground">
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
                size="sm"
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                onClick={() => setPaginaAtual(paginaAtual + 1)}
                disabled={paginaAtual === totalPaginas}
                size="sm"
              >
                Próximo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
