import { useEffect, useState } from "react";
import { Usuario } from "../../types/usuario";
import api from "../../api/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, ChevronUp, MoreVertical } from "lucide-react";
import { useAuth } from "../../components/auth/AuthProvider";
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
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StatusChip from "./components/StatusChip";
import { Utilitarios } from "../../utils/utilitarios";

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const [totalUsuarios, setTotalUsuarios] = useState<number>(0);
  const [ordenarPor, setOrdenarPor] = useState<string>("nome");
  const [ordem, setOrdem] = useState<"asc" | "desc">("asc");
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState<Usuario | null>(
    null
  );
  const [alertaAberto, setAlertaAberto] = useState<boolean>(false);
  const { usuarioAtual } = useAuth();

  const usuariosPorPagina = 8;
  const totalPaginas = Math.ceil(totalUsuarios / usuariosPorPagina);

  const carregarUsuarios = async (): Promise<void> => {
    try {
      const res = await api.get(`/api/usuarios`, {
        params: {
          orderBy: ordenarPor,
          ordem,
          pagina: paginaAtual,
          cpfLogado: usuarioAtual?.cpf,
        },
      });

      setUsuarios(res.data.usuarios as Usuario[]);
      setTotalUsuarios(res.data.total);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, [ordenarPor, ordem, paginaAtual]);

  const alternarOrdem = (coluna: string): void => {
    if (ordenarPor === coluna) {
      setOrdem(ordem === "asc" ? "desc" : "asc");
    } else {
      setOrdenarPor(coluna);
      setOrdem("asc");
    }
    setPaginaAtual(1);
  };

  const atualizarAcesso = async (
    cpf: string,
    novoValor: boolean
  ): Promise<void> => {
    try {
      await api.patch(`/api/usuarios/${cpf}/permissao`, {
        possui_acesso: novoValor,
      });
      carregarUsuarios();
    } catch (error) {
      console.error("Erro ao atualizar permissão:", error);
    }
  };

  const excluirUsuario = async (cpf: string): Promise<void> => {
    try {
      await api.delete(`/api/usuarios/${cpf}`);
      carregarUsuarios();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  };

  const renderOrdenacaoIcone = (coluna: string) => {
    if (ordenarPor !== coluna) return null;
    return ordem === "asc" ? (
      <ChevronUp className="inline w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="inline w-4 h-4 ml-1" />
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Usuários</h2>
        <p className="text-muted-foreground">
          Gerencie os usuários cadastrados no sistema.
        </p>
      </div>

      <Card className="p-4">
        <CardContent className="overflow-auto">
          <Table>
            <TableCaption>Lista de usuários cadastrados.</TableCaption>
            <TableHeader>
              <TableRow>
                {Utilitarios.atributosTabelaUsuarios.map((coluna) => (
                  <TableHead
                    key={coluna}
                    className="cursor-pointer select-none"
                    onClick={() => alternarOrdem(coluna)}
                  >
                    {coluna.charAt(0).toUpperCase() +
                      coluna.slice(1).replace("_", " ")}
                    {renderOrdenacaoIcone(coluna)}
                  </TableHead>
                ))}
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.cpf}>
                  <TableCell className="py-4">{usuario.nome}</TableCell>
                  <TableCell className="py-4">{usuario.email}</TableCell>
                  <TableCell className="py-4">
                    <StatusChip ativo={usuario.online!} />
                  </TableCell>
                  <TableCell className="py-4">
                    <Switch
                      checked={usuario.possui_acesso}
                      onCheckedChange={(val: boolean) =>
                        atualizarAcesso(usuario.cpf!, val)
                      }
                    />
                  </TableCell>
                  <TableCell className="py-4">{usuario.tipo}</TableCell>
                  <TableCell className="py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded hover:bg-gray-100">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem
                          onClick={() => {
                            setUsuarioParaExcluir(usuario);
                            setTimeout(() => setAlertaAberto(true), 10);
                          }}
                        >
                          Excluir usuário
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
              {`${(paginaAtual - 1) * usuariosPorPagina + 1} - ${Math.min(
                paginaAtual * usuariosPorPagina,
                totalUsuarios
              )} de ${totalUsuarios} usuários`}
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

        {/* ALERT DIALOG PARA EXCLUSÃO */}
        {usuarioParaExcluir && (
          <AlertDialog open={alertaAberto} onOpenChange={setAlertaAberto}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir este usuário? Essa ação é
                  irreversível.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    if (usuarioParaExcluir) {
                      excluirUsuario(usuarioParaExcluir.cpf!);
                    }
                    setAlertaAberto(false);
                  }}
                >
                  Confirmar Exclução
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </Card>
    </div>
  );
};

export default UsuariosPage;
