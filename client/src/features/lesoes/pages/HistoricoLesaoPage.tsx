import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import LesaoService from "../services/LesaoService";
import { BreadcrumbNav } from "@/shared/components/layout/BreadcrumbNav";
import { Lesao } from "../types/Lesao";
import { HistoricoItem } from "../types/HistoricoItem";
import CardLesaoHistorico from "../components/CardLesaoHistorico";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import { Trash2 } from "lucide-react";

export default function HistoricoPacientePage() {
  const { id_lesao, id_paciente } = useParams();
  const { usuarioAtual } = useAuth();

  const [lesaoOriginal, setLesaoOriginal] = useState<Lesao>();
  const [historicoLesoes, setHistoricoLesoes] = useState<
    { item: HistoricoItem; dados: Lesao }[]
  >([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [lesaoIdParaDeletar, setLesaoIdParaDeletar] = useState<string | null>(
    null
  );

  async function fetchHistorico() {
    try {
      const historico = await LesaoService.getHistoricoLesao(id_lesao!);
      const historicoComDados = await Promise.all(
        historico.map(async (item: HistoricoItem) => {
          const dados = await LesaoService.getLesao(item.lesao_versao_id);
          return { item, dados };
        })
      );

      setHistoricoLesoes(
        historicoComDados.sort(
          (a, b) =>
            new Date(b.item.data_criacao).getTime() -
            new Date(a.item.data_criacao).getTime()
        )
      );
    } catch {
      toast.error("Erro ao carregar o histórico da lesão");
    }
  }

  async function fetchLesaoOriginal() {
    try {
      const dados = await LesaoService.getLesao(id_lesao!);
      setLesaoOriginal(dados);
    } catch {
      toast.error("Erro ao carregar a lesão original");
    }
  }

  useEffect(() => {
    fetchLesaoOriginal();
    fetchHistorico();
  }, [id_lesao, id_paciente]);

  async function handleDuplicar(idVersao: string) {
    try {
      await LesaoService.duplicarLesao(
        usuarioAtual?.cpf!,
        id_paciente!,
        lesaoOriginal!.id,
        idVersao
      );
      fetchHistorico();
    } catch {
      toast.error("Erro ao duplicar lesão");
    }
  }

  async function handleDeletar() {
    if (!lesaoIdParaDeletar) return;

    console.log("Excluindo lesão com ID:", lesaoIdParaDeletar);

    try {
      await LesaoService.deletarLesao(lesaoIdParaDeletar);
      fetchHistorico();
    } catch {
      toast.error("Erro ao excluir lesão");
    } finally {
      setOpenDialog(false);
      setLesaoIdParaDeletar(null);
    }
  }

  if (!lesaoOriginal)
    return <div className="p-6 text-gray-500">Carregando...</div>;

  return (
    <div className="space-y-8 px-4 md:px-6 pb-12">
      <BreadcrumbNav
        itens={[
          { titulo: "Home", href: "/" },
          { titulo: "Pacientes", href: "/dashboard/pacientes" },
          { titulo: id_paciente!, href: `/dashboard/pacientes/${id_paciente}` },
          {
            titulo: "Histórico",
            href: `/dashboard/pacientes/${id_paciente}/lesoes/${id_lesao}/historico`,
          },
        ]}
      />

      {/* Histórico */}
      <div className="relative border-l border-gray-300 ml-4 pl-6 space-y-8">
        {historicoLesoes.map(({ item, dados }) => (
          <div key={item.id} className="relative">
            <span className="absolute -left-[9px] top-2 h-3 w-3 rounded-full bg-blue-600" />
            <CardLesaoHistorico
              titulo={`Versão criada em ${item.data_criacao}`}
              dados={dados}
              lesaoId={item.lesao_versao_id}
              onDuplicar={() => handleDuplicar(item.lesao_versao_id)}
              onExcluir={() => {
                setLesaoIdParaDeletar(item.lesao_versao_id);
                console.log(item.lesao_versao_id);
                setOpenDialog(true);
              }}
              usuarioAtual={usuarioAtual}
            />
          </div>
        ))}
      </div>

      {/* Original */}
      <div className="pt-8">
        <CardLesaoHistorico
          titulo="Lesão Original"
          dados={lesaoOriginal}
          lesaoId={lesaoOriginal.id}
          onDuplicar={() => handleDuplicar(lesaoOriginal.id)}
          usuarioAtual={usuarioAtual}
        />
      </div>

      <ConfirmDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        title="Deseja realmente excluir esta lesão?"
        description="Essa ação não poderá ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={handleDeletar}
        confirmColor="danger"
        icon={<Trash2 className="w-5 h-5 text-red-600" />}
      />
    </div>
  );
}
