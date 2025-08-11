import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormLesaoSchema,
  FormLesaoFields,
  Tecido,
  Cobertura,
  TipoFechamentoCurativo,
} from "@/features/lesoes/schemas/LesaoSchema";
import DadosFormLesaoService from "@/features/lesoes/services/DadosFormLesaoService";
import { CarregarCheckboxGroup } from "@/features/lesoes/components/CarregarCheckboxGroup";
import Editor from "@/shared/components/form/Editor";
import { useAuth } from "@/providers/AuthProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { Button } from "@/ui/button";
import { Calendar } from "@/ui/calendar";
import { cn } from "@/lib/utils";
import { Label } from "@/ui/label";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Slider } from "@/ui/slider";
import { DadosFormLesao } from "@/features/lesoes/types/DadosFormLesao";
import { CamposCondicionaisFormulario } from "@/features/lesoes/types/CamposCondicionaisFormulario";
import { ChevronDownIcon, Pencil, Plus } from "lucide-react";
import { ZodSchema } from "zod";
import { toast } from "sonner";
import LesaoService from "../services/LesaoService";
import { CamposFormulario } from "../constants/camposFormulario.enum";
import { useFormularioWatch } from "../hooks/useFormularioWatch";
import { BreadcrumbNav } from "@/shared/components/layout/BreadcrumbNav";

const FormLesaoPage = () => {
  const { id_lesao, id_paciente } = useParams();
  const isEditMode = !!id_lesao;
  const navigate = useNavigate();
  const { usuarioAtual } = useAuth();

  const [camposCondicionaisForm, setCamposCondicionaisForm] =
    useState<CamposCondicionaisFormulario>({});

  const [dadosForm, setDadosForm] = useState<DadosFormLesao>({
    etiologias: [],
    classificacoesLesaoPressao: [],
    regioesPerilesionais: [],
    bordas: [],
    estruturasNobres: [],
    tecidos: [],
    classificacoesDor: [],
    quantidadesExsudato: [],
    tiposExsudato: [],
    odores: [],
    limpezas: [],
    desbridamentos: [],
    protecoes: [],
    coberturas: [],
    tiposFechamentoCurativo: [],
  });

  const [schema, setSchema] = useState<ZodSchema<FormLesaoFields> | null>(null);

  const form = useForm<FormLesaoFields>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: {
      tecidos: [],
      coberturas: [],
      tiposFechamentoCurativo: [],
    },
  });

  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  // Carregar dados da lesão (edição)
  useEffect(() => {
    if (!isEditMode) return;
    const fetchLesao = async () => {
      const { dados } = await LesaoService.getLesaoPorId(id_lesao!);

      reset(dados);
    };
    fetchLesao();
  }, [isEditMode, id_lesao, reset]);

  // Carregar opções dos checkboxes e selects
  useEffect(() => {
    const fetchDadosForm = async () => {
      try {
        // Recebendo os dados
        const response = await DadosFormLesaoService.getDadosFormLesao();

        // Atualizando os valores iniciais dos tecidos
        const tecidosComValor = response.tecidos.map((item) => ({
          id: item.id,
          nome: item.nome,
          valor: 0,
        }));

        // Atualizando os valores iniciais das coberturas
        const coberturasComValor = response.coberturas.map((item) => ({
          id: item.id,
          nome: item.nome,
          valor: 0,
        }));

        // Atualizando os valores iniciais dos tipos de fechamento de curativo
        const tiposFechamentoCurativoComValor =
          response.tiposFechamentoCurativo.map((item) => ({
            id: item.id,
            nome: item.nome,
            valor: 0,
          }));

        // Atualiza os dados condicionais e schema
        const novosCamposCondicionais: CamposCondicionaisFormulario = {
          etiologiaLesaoPorPressao: response.etiologias.find(
            (op) =>
              op.nome.toLowerCase() === CamposFormulario.OpcaoLesaoPorPressao
          ),
          regiaoPerilesionalOutro: response.regioesPerilesionais.find(
            (op) => op.nome.toLowerCase() === CamposFormulario.OpcaoOutro
          ),
          estruturaNobreOutro: response.estruturasNobres.find(
            (op) => op.nome.toLowerCase() === CamposFormulario.OpcaoOutro
          ),
          limpezaOutro: response.limpezas.find(
            (op) => op.nome.toLowerCase() === CamposFormulario.OpcaoOutro
          ),
          desbridamentoOutro: response.desbridamentos.find(
            (op) => op.nome.toLowerCase() === CamposFormulario.OpcaoOutro
          ),
          protecaoOutro: response.protecoes.find(
            (op) => op.nome.toLowerCase() === CamposFormulario.OpcaoOutro
          ),
        };

        setCamposCondicionaisForm(novosCamposCondicionais);
        setSchema(FormLesaoSchema(novosCamposCondicionais));

        // Atualiza os dados de formulário
        setDadosForm({
          ...response,
        });

        if (!isEditMode) {
          // Resetando o formulário com os dados carregados
          reset({
            tecidos: tecidosComValor,
            coberturas: coberturasComValor,
            tiposFechamentoCurativo: tiposFechamentoCurativoComValor,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados do formulário", error);
      }
    };
    fetchDadosForm();
  }, [reset]);

  // Submissão do formulário de cadastro de lesão
  const onSubmit: SubmitHandler<FormLesaoFields> = async (data) => {
    if (isEditMode) {
      // Atualizando a lesão
      await LesaoService.atualizarLesao(usuarioAtual?.cpf!, id_lesao, data);
    } else {
      // Cadastrando a lesão
      await LesaoService.cadastrarLesao(usuarioAtual?.cpf!, id_paciente!, data);
    }
    // Retornando a tela com a listagem das lesões do paciente
    navigate(`/dashboard/pacientes/${id_paciente}`);
  };

  // Observa os valores dos campos do formulário em tempo real (useWatch)
  const {
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
    somaTecidos,
    volume,
    algumValorPreenchido,
  } = useFormularioWatch(control);

  const corSoma =
    somaTecidos > 100
      ? "text-red-600"
      : somaTecidos === 100
      ? "text-green-600"
      : "text-gray-700";

  const mensagemSoma =
    somaTecidos > 100 ? " (excede 100%)" : somaTecidos === 100 ? " (ok!)" : "";

  return (
    <div className="space-y-8">
      <div>
        <BreadcrumbNav
          itens={[
            { titulo: "Home", href: "/" },
            { titulo: "Pacientes", href: "/dashboard/pacientes" },
            {
              titulo: id_paciente!,
              href: `/dashboard/pacientes/${id_paciente}`,
            },
            {
              titulo: isEditMode ? "Editar Lesão" : "Cadastrar Lesão",
              href: `/dashboard/pacientes/${id_paciente}/lesoes/${
                isEditMode ? `${id_lesao}/editar` : "cadastrar"
              }`,
            },
          ]}
        />
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[#1F4D2C]">
          {isEditMode ? "Editar" : "Cadastrar"} Lesão
        </h1>
        <p className="text-sm text-gray-600">
          Preencha os campos abaixo para salvar as informações da lesão.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.log("Erros no formulário:", errors);
          // Aviso para preenchimento dos campos obrigatórios
          toast("Preencha todos os campos obrigatórios.");
        })}
        className="space-y-6"
      >
        <div className="border rounded p-4 mb-6">
          <h2 className="text-xl font-bold mb-4 text-[#1F4D2C]">Etiologia</h2>
          {/* Etiologia */}
          <CarregarCheckboxGroup
            control={control}
            fieldName="etiologias"
            options={dadosForm.etiologias}
            error={errors.etiologias?.message}
            errorClassName="mt-4 text-red-500 text-sm"
          />
        </div>

        {/* Classificações (condicional) */}
        {etiologias.includes(
          camposCondicionaisForm.etiologiaLesaoPorPressao?.id!
        ) && (
          <div className="border rounded p-4 mb-6">
            <h2 className="text-xl font-bold mb-4 text-[#1F4D2C]">
              Classificação da Lesão Por Pressão
            </h2>

            {/* Classificação Lesão Por Pressão */}
            <CarregarCheckboxGroup
              control={control}
              fieldName="classificacoesLesaoPressao"
              options={dadosForm.classificacoesLesaoPressao}
              error={errors.classificacoesLesaoPressao?.message}
              errorClassName="mt-4 text-red-500 text-sm"
            />
          </div>
        )}

        <div className="border rounded p-4 mb-6">
          <h2 className="text-xl font-bold mb-4 text-[#1F4D2C]">
            Região Perilesional
          </h2>
          {/* Região Perilesional */}
          <CarregarCheckboxGroup
            control={control}
            fieldName="regioesPerilesionais"
            options={dadosForm.regioesPerilesionais}
            error={errors.regioesPerilesionais?.message}
            errorClassName="mt-4 text-red-500 text-sm"
          />

          {regioesPerilesionais.includes(
            camposCondicionaisForm.regiaoPerilesionalOutro?.id!
          ) && (
            <div className="mt-4">
              <Editor
                id="regiaoPerilesionalOutro"
                label="Região Perilesional"
                ehCampoSenha={false}
                register={control.register("regiaoPerilesionalOutro")}
                error={errors.regiaoPerilesionalOutro?.message}
                placeholder="Região Perilesional"
                className="h-12 w-full border p-2 rounded-md"
                labelClassName="block font-medium mb-1"
                errorClassName="text-red-500 text-sm mt-1"
              />
            </div>
          )}
        </div>

        <div className="border rounded p-4 mb-6">
          <h2 className="text-xl font-bold mb-4 text-[#1F4D2C]">Borda</h2>
          {/* Borda */}
          <CarregarCheckboxGroup
            control={control}
            fieldName="bordas"
            options={dadosForm.bordas}
            error={errors.bordas?.message}
            errorClassName="mt-4 text-red-500 text-sm"
          />
        </div>

        {/* Tecido */}
        <div className="border rounded p-4 mb-6">
          <h2 className="text-xl font-bold mb-4 text-[#1F4D2C]">Tecido</h2>

          <div className="flex flex-col lg:flex-row flex-wrap gap-8">
            {/* Estruturas Nobres */}
            <div className="flex-1 min-w-[250px]">
              <Label className="block font-medium text-gray-500 mb-1">
                Estruturas Nobres
              </Label>
              <CarregarCheckboxGroup
                control={control}
                fieldName="estruturasNobres"
                options={dadosForm.estruturasNobres}
                error={errors.estruturasNobres?.message}
                errorClassName="mt-4 text-red-500 text-sm"
              />
              {estruturasNobres.includes(
                camposCondicionaisForm.estruturaNobreOutro?.id!
              ) && (
                <div className="mt-4">
                  <Editor
                    id="estruturaNobreOutro"
                    label="Estrutura Nobre"
                    ehCampoSenha={false}
                    register={control.register("estruturaNobreOutro")}
                    error={errors.estruturaNobreOutro?.message}
                    placeholder="Estrutura Nobre"
                    className="h-12 w-full border p-2 rounded-md"
                    labelClassName="block font-medium mb-1"
                    errorClassName="text-red-500 text-sm mt-1"
                  />
                </div>
              )}
            </div>

            {/* Porcentagens */}
            <div className="flex-1 min-w-[250px]">
              <Label className="block text-sm font-normal text-gray-400 mb-1">
                Porcentagens (0 a 100%)
              </Label>
              <div className="space-y-3 mt-2">
                {tecidos.map((item: Tecido, index: number) => {
                  const errorMessage = errors.tecidos?.[index]?.valor?.message;

                  return (
                    <Editor
                      key={`${item.id}-${item.nome}`}
                      id={`${item.id}-${item.nome}`}
                      label={item.nome}
                      ehCampoSenha={false}
                      register={control.register(`tecidos.${index}.valor`, {
                        valueAsNumber: true,
                      })}
                      error={errorMessage}
                      placeholder={item.nome}
                      className="h-12 w-full border p-2 rounded-md"
                      labelClassName="block font-medium mb-1"
                      errorClassName="text-red-500 text-sm mt-1"
                    />
                  );
                })}
              </div>

              {errors.tecidos?.root && (
                <p className="text-red-500 text-sm mt-3">
                  {errors.tecidos?.root?.message}
                </p>
              )}
            </div>
          </div>

          {/* Soma das porcentagens */}
          <p className={`text-sm font-medium mt-6 ${corSoma}`}>
            Soma das porcentagens: {somaTecidos}%{mensagemSoma}
          </p>
        </div>

        <div className="border rounded p-4 mb-6">
          <h2 className="text-xl font-bold mb-4 text-[#1F4D2C]">
            Presença de Túnel
          </h2>

          {/* RadioGroup */}
          <div>
            <Controller
              name="presencaTunel"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                  defaultValue={field.value}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sim" id="presencaTunelSim" />
                    <Label htmlFor="presencaTunelSim">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nao" id="presencaTunelNao" />
                    <Label htmlFor="presencaTunelNao">Não</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.presencaTunel && (
              <p className="text-red-500 text-sm mt-1">
                {errors.presencaTunel.message}
              </p>
            )}
          </div>
        </div>

        {/* Dor */}
        <div className="border rounded p-4 mb-6">
          <h2 className="text-xl font-bold mb-4 text-[#1F4D2C]">Dor</h2>

          <div className="flex flex-col gap-6">
            {/* RadioGroup */}
            <div>
              <Controller
                name="dor"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                    defaultValue={field.value}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sim" id="dorSim" />
                      <Label htmlFor="dorSim">Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nao" id="dorNao" />
                      <Label htmlFor="dorNao">Não</Label>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.dor && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dor.message}
                </p>
              )}
            </div>

            {/* Campos adicionais se dor == sim */}
            {dor === CamposFormulario.OpcaoSim && (
              <div className="flex flex-col gap-6 lg:flex-row">
                {/* Classificação */}
                <div className="flex-1">
                  <Label className="block mb-2">Classificação</Label>
                  <CarregarCheckboxGroup
                    control={control}
                    fieldName="classificacoesDor"
                    options={dadosForm.classificacoesDor}
                    error={errors.classificacoesDor?.message}
                    errorClassName="mt-2 text-red-500 text-sm"
                  />
                </div>

                {/* Nível de dor */}
                <div className="flex-1">
                  <Controller
                    control={control}
                    name="escalaNumericaDor"
                    defaultValue={0}
                    render={({ field }) => (
                      <div>
                        <Label
                          htmlFor="escalaNumericaDor"
                          className="block mb-2"
                        >
                          Escala Numérica da Dor
                        </Label>
                        <Slider
                          id="escalaNumericaDor"
                          min={0}
                          max={10}
                          step={1}
                          value={[field.value!]}
                          onValueChange={(val) => field.onChange(val[0])}
                        />
                        <p className="text-sm mt-2">
                          Valor selecionado: {field.value}
                        </p>
                      </div>
                    )}
                  />
                  {errors.escalaNumericaDor && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.escalaNumericaDor.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border rounded p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-x-6 gap-y-6">
            <div className="flex-1 space-y-6">
              {/* Quantidade de Exsudato */}
              <Controller
                control={control}
                name="quantidadeExsudato"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label className="text-xl font-bold mb-4 text-[#1F4D2C]">
                      Quantidade de Exsudato
                    </Label>
                    <Select
                      value={String(field.value ?? "")}
                      onValueChange={(val) => field.onChange(Number(val))}
                    >
                      <SelectTrigger className="min-h-[48px] w-full border p-2 rounded-md">
                        <SelectValue placeholder="Selecione a quantidade de exsudato" />
                      </SelectTrigger>
                      <SelectContent>
                        {dadosForm.quantidadesExsudato.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.quantidadeExsudato && (
                      <p className="text-red-500 text-sm">
                        {errors.quantidadeExsudato.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Tipo de Exsudato */}
              <Controller
                control={control}
                name="tipoExsudato"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label className="text-xl font-bold mb-4 text-[#1F4D2C]">
                      Tipo de Exsudato
                    </Label>
                    <Select
                      value={String(field.value ?? "")}
                      onValueChange={(val) => field.onChange(Number(val))}
                    >
                      <SelectTrigger className="min-h-[48px] w-full border p-2 rounded-md">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {dadosForm.tiposExsudato.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.tipoExsudato && (
                      <p className="text-red-500 text-sm">
                        {errors.tipoExsudato.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="flex-1 space-y-6">
              {/* Odor */}
              <Controller
                control={control}
                name="odor"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label className="text-xl font-bold mb-4 text-[#1F4D2C]">
                      Odor
                    </Label>
                    <Select
                      value={String(field.value ?? "")}
                      onValueChange={(val) => field.onChange(Number(val))}
                    >
                      <SelectTrigger className="min-h-[48px] w-full border p-2 rounded-md">
                        <SelectValue placeholder="Selecione o odor" />
                      </SelectTrigger>
                      <SelectContent>
                        {dadosForm.odores.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.odor && (
                      <p className="text-red-500 text-sm">
                        {errors.odor.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Tamanho */}
              <div>
                <Label className="text-xl font-bold mb-4 text-[#1F4D2C]">
                  Tamanho (em centímetros)
                </Label>
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Comprimento */}
                  <Editor
                    id="comprimento"
                    ehCampoSenha={false}
                    helperText="Comprimento"
                    register={control.register("tamanho.comprimento", {
                      valueAsNumber: true,
                    })}
                    error={errors.tamanho?.comprimento?.message}
                    placeholder="Comprimento da Lesão"
                    className="h-12 w-full border p-2 rounded-md"
                    labelClassName="block font-medium mb-1"
                    errorClassName="text-red-500 text-sm mt-1"
                  />

                  {/* Largura */}
                  <Editor
                    id="largura"
                    ehCampoSenha={false}
                    helperText="Largura"
                    register={control.register("tamanho.largura", {
                      valueAsNumber: true,
                    })}
                    error={errors.tamanho?.largura?.message}
                    placeholder="Largura da Lesão"
                    className="h-12 w-full border p-2 rounded-md"
                    labelClassName="block font-medium mb-1"
                    errorClassName="text-red-500 text-sm mt-1"
                  />

                  {/* Profundidade */}
                  <Editor
                    id="profundidade"
                    ehCampoSenha={false}
                    helperText="Profundidade"
                    register={control.register("tamanho.profundidade", {
                      valueAsNumber: true,
                    })}
                    error={errors.tamanho?.profundidade?.message}
                    placeholder="Profundidade da Lesão"
                    className="h-12 w-full border p-2 rounded-md"
                    labelClassName="block font-medium mb-1"
                    errorClassName="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {algumValorPreenchido && (
            <p className="text-sm text-muted-foreground mt-2 text-right">
              Volume estimado:{" "}
              <span className="font-semibold">{volume.toFixed(2)} cm³</span>
            </p>
          )}
        </div>

        <div className="border rounded p-4 mb-6 space-y-8">
          <h2 className="text-xl font-bold mb-4 text-[#1F4D2C]">
            Preparo do Leito
          </h2>

          <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
            <div className="w-full lg:w-1/2">
              <Label className="block font-medium text-gray-500 mb-1">
                Limpeza
              </Label>
              {/* Limpeza */}
              <CarregarCheckboxGroup
                control={control}
                fieldName="limpezas"
                options={dadosForm.limpezas}
                error={errors.limpezas?.message}
                errorClassName="mt-4 text-red-500 text-sm"
              />

              {limpezas.includes(camposCondicionaisForm.limpezaOutro?.id!) && (
                <div className="mt-4">
                  <Editor
                    id="limpezaOutro"
                    label="Limpeza"
                    ehCampoSenha={false}
                    register={control.register("limpezaOutro")}
                    error={errors.limpezaOutro?.message}
                    placeholder="Limpeza"
                    className="h-12 w-full border p-2 rounded-md"
                    labelClassName="block font-medium mb-1"
                    errorClassName="text-red-500 text-sm mt-1"
                  />
                </div>
              )}
            </div>

            <div className="w-full lg:w-1/2">
              <Label className="block font-medium text-gray-500 mb-1">
                Desbridamento
              </Label>
              {/* Desbridamento */}
              <CarregarCheckboxGroup
                control={control}
                fieldName="desbridamentos"
                options={dadosForm.desbridamentos}
                error={errors.desbridamentos?.message}
                errorClassName="mt-4 text-red-500 text-sm"
              />

              {desbridamentos.includes(
                camposCondicionaisForm.desbridamentoOutro?.id!
              ) && (
                <div className="mt-4">
                  <Editor
                    id="desbridamentoOutro"
                    label="Desbridamento"
                    ehCampoSenha={false}
                    register={control.register("desbridamentoOutro")}
                    error={errors.desbridamentoOutro?.message}
                    placeholder="Desbridamento"
                    className="h-12 w-full border p-2 rounded-md"
                    labelClassName="block font-medium mb-1"
                    errorClassName="text-red-500 text-sm mt-1"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border rounded p-4 mb-6 space-y-8">
          <h2 className="text-xl font-bold mb-4 text-[#1F4D2C]">
            Prevenção e Tratamento de Lesões
          </h2>

          <div>
            <Label className="block font-medium text-gray-500 mb-1">
              Proteção
            </Label>
            {/* Proteção */}
            <CarregarCheckboxGroup
              control={control}
              fieldName="protecoes"
              options={dadosForm.protecoes}
              error={errors.protecoes?.message}
              errorClassName="mt-4 text-red-500 text-sm"
            />

            {protecoes.includes(camposCondicionaisForm.protecaoOutro?.id!) && (
              <div className="mt-4">
                <Editor
                  id="protecaoOutro"
                  label="Proteção"
                  ehCampoSenha={false}
                  register={control.register("protecaoOutro")}
                  error={errors.protecaoOutro?.message}
                  placeholder="Proteção"
                  className="h-12 w-full border p-2 rounded-md"
                  labelClassName="block font-medium mb-1"
                  errorClassName="text-red-500 text-sm mt-1"
                />
              </div>
            )}
          </div>

          <div>
            <Label className="block font-medium text-gray-500 mb-1">
              Cobertura Utilizada
            </Label>
            {/* Cobertura Utilizada */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {coberturas.map((item: Cobertura, index: number) => {
                const errorMessage = errors.coberturas?.[index]?.valor?.message;

                return (
                  <Editor
                    key={`${item.id}-${item.nome}`}
                    id={`${item.id}-${item.nome}`}
                    label={item.nome}
                    ehCampoSenha={false}
                    register={control.register(`coberturas.${index}.valor`, {
                      valueAsNumber: true,
                    })}
                    error={errorMessage}
                    placeholder={item.nome}
                    className="h-12 w-full border p-2 rounded-md"
                    labelClassName="block font-medium mb-1"
                    errorClassName="text-red-500 text-sm mt-1"
                  />
                );
              })}
            </div>
          </div>

          <div>
            <Label className="block font-medium text-gray-500 mb-1">
              Fechamento do curativo
            </Label>
            {/* Fechamento do curativo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {tiposFechamentoCurativo.map(
                (item: TipoFechamentoCurativo, index: number) => {
                  const errorMessage =
                    errors.tiposFechamentoCurativo?.[index]?.valor?.message;

                  return (
                    <Editor
                      key={`${item.id}-${item.nome}`}
                      id={`${item.id}-${item.nome}`}
                      label={item.nome}
                      ehCampoSenha={false}
                      register={control.register(
                        `tiposFechamentoCurativo.${index}.valor`,
                        {
                          valueAsNumber: true,
                        }
                      )}
                      error={errorMessage}
                      placeholder={item.nome}
                      className="h-12 w-full border p-2 rounded-md"
                      labelClassName="block font-medium mb-1"
                      errorClassName="text-red-500 text-sm mt-1"
                    />
                  );
                }
              )}
            </div>
          </div>
        </div>

        <div className="border rounded p-4 mb-6 space-y-8">
          <h2 className="text-xl font-bold mb-4 text-[#1F4D2C]">
            Informações adicionais
          </h2>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Data da Próxima Avaliação */}
            <div className="flex-1 flex flex-col gap-3">
              <Label className="block font-medium text-gray-500 mb-1">
                Data da Próxima Avaliação
              </Label>

              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full md:w-48 justify-between font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    {selectedDate
                      ? selectedDate.toLocaleDateString()
                      : "Selecionar data"}
                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    captionLayout="dropdown"
                    disabled={(date) => date < new Date()}
                    onSelect={(date) => {
                      if (date) {
                        setValue("dataProximaAvaliacao", date, {
                          shouldValidate: true,
                        });
                        setOpen(false);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>

              {errors.dataProximaAvaliacao && (
                <span className="text-sm text-red-500">
                  {errors.dataProximaAvaliacao.message}
                </span>
              )}
            </div>

            {/* Localização da Lesão */}
            <div className="flex-1">
              <Label className="block font-medium text-gray-500 mb-1">
                Localização da Lesão
              </Label>
              <Editor
                id="localizacaoLesao"
                ehCampoSenha={false}
                helperText="Localização da Lesão"
                register={control.register("localizacaoLesao")}
                error={errors.localizacaoLesao?.message}
                placeholder="Localização da Lesão"
                className="h-12 w-full border p-2 rounded-md"
                labelClassName="block font-medium mb-1"
                errorClassName="text-red-500 text-sm mt-1"
              />
            </div>
          </div>
        </div>

        {errors.root && (
          <p className="text-red-500 text-sm">{errors.root.message}</p>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="fixed bottom-8 right-8 w-[60px] h-[60px] rounded-full shadow-xl text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#1F4D2C" }}
                aria-label={isEditMode ? "Atualizar" : "Cadastrar"}
              >
                {isEditMode ? (
                  <Pencil className="w-7 h-7" />
                ) : (
                  <Plus className="w-7 h-7" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{isEditMode ? "Atualizar" : "Cadastrar"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </form>
    </div>
  );
};

export default FormLesaoPage;
