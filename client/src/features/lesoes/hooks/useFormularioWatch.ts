import { useWatch, Control } from "react-hook-form";
import { CamposFormulario } from "@/features/lesoes/constants/camposFormulario.enum";
import { Tecido } from "../schemas/LesaoSchema";

export function useFormularioWatch(control: Control<any>) {
  const etiologias =
    useWatch({ control, name: CamposFormulario.Etiologias }) || [];
  const regioesPerilesionais =
    useWatch({ control, name: CamposFormulario.RegioesPerilesionais }) || [];
  const estruturasNobres =
    useWatch({ control, name: CamposFormulario.EstruturasNobres }) || [];
  const dor = useWatch({ control, name: CamposFormulario.Dor }) || "";
  const limpezas = useWatch({ control, name: CamposFormulario.Limpezas }) || [];
  const desbridamentos =
    useWatch({ control, name: CamposFormulario.Desbridamentos }) || [];
  const protecoes =
    useWatch({ control, name: CamposFormulario.Protecoes }) || [];
  const tecidos = useWatch({ control, name: CamposFormulario.Tecidos }) || [];
  const coberturas =
    useWatch({ control, name: CamposFormulario.Coberturas }) || [];
  const tiposFechamentoCurativo =
    useWatch({ control, name: CamposFormulario.TiposFechamentoCurativo }) || [];
  const selectedDate = useWatch({
    control,
    name: CamposFormulario.DataProximaAvaliacao,
  });

  const somaTecidos = tecidos.reduce(
    (acc: number, t: Tecido) => acc + (Number.isNaN(t.valor) ? 0 : t.valor),
    0
  );

  const tamanho = useWatch({ control, name: CamposFormulario.Tamanho });
  const comprimento = Number(tamanho?.comprimento) || 1;
  const largura = Number(tamanho?.largura) || 1;
  const profundidade = Number(tamanho?.profundidade) || 1;
  const volume = comprimento * largura * profundidade;
  const algumValorPreenchido =
    tamanho?.comprimento != null ||
    tamanho?.largura != null ||
    tamanho?.profundidade != null;

  return {
    etiologias,
    regioesPerilesionais,
    estruturasNobres,
    dor,
    limpezas,
    desbridamentos,
    protecoes,
    tecidos,
    coberturas,
    tiposFechamentoCurativo,
    selectedDate,
    tamanho,
    comprimento,
    largura,
    profundidade,
    somaTecidos,
    volume,
    algumValorPreenchido,
  };
}
