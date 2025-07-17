import { SubmitHandler, useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LesaoFormSchema, LesaoFormFields } from "@/schemas/LesaoSchema";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LesaoService from "@/services/LesaoService";
import DadosFormService from "@/services/DadosFormService";
import { CarregarCheckboxGroup } from "@/pages/dashboard/components/CarregarCheckboxGroup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Editor from "@/components/shared/Editor";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/components/auth/AuthProvider";
import { DadosFormulario } from "@/types/DadosFormulario";
import { DadosEspeciaisFormulario } from "@/types/DadosEspeciaisFormulario";
import { BreadcrumbNav } from "@/pages/dashboard/components/BreadcrumbNav";
import { Pencil, Plus } from "lucide-react";
import { ZodSchema } from "zod";

const LesaoFormPage = () => {
  const { id_lesao, id_paciente } = useParams();
  const isEditMode = !!id_lesao;
  const navigate = useNavigate();
  const { usuarioAtual } = useAuth();

  const [dadosEspeciaisForm, setDadosEspeciaisForm] =
    useState<DadosEspeciaisFormulario>({});

  const [dadosForm, setDadosForm] = useState<DadosFormulario>({
    etiologias: [],
    classificacoesLesaoPressao: [],
    regioesPerilesionais: [],
    bordas: [],
    estruturasNobres: [],
    tecidos: [],
    quantificacoesDor: [],
    exsudatos: [],
    tiposExsudato: [],
    odores: [],
    limpezas: [],
    desbridamentos: [],
    protecoes: [],
    coberturas: [],
    tiposFechamentoCurativo: [],
  });

  const [schema, setSchema] = useState<ZodSchema<LesaoFormFields> | null>(null);

  const form = useForm<LesaoFormFields>({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: {
      tecidos: [],
      coberturas: [],
      tiposFechamentoCurativo: [],
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  // Carregar dados da lesão (edição)
  useEffect(() => {
    if (!isEditMode) return;
    const fetchLesao = async () => {
      const data = await LesaoService.getLesaoComIds(id_lesao!);
      console.log("OBTENDO LESÃO: ", data.dados);
      reset(data.dados);
    };
    fetchLesao();
  }, [isEditMode, id_lesao, reset]);

  // Carregar opções dos checkboxes e selects
  useEffect(() => {
    const fetchDadosForm = async () => {
      try {
        // Recebendo os dados
        const response = await DadosFormService.obterDadosForm();

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

        // Atualiza os dados especiais e schema
        const novosDadosEspeciais: DadosEspeciaisFormulario = {
          etiologiaLesaoPorPressao: response.etiologias.find(
            (op) => op.nome.toLowerCase() === "lesão por pressão"
          ),
          regiaoPerilesionalOutro: response.regioesPerilesionais.find(
            (op) => op.nome.toLowerCase() === "outro"
          ),
          estruturaNobreOutro: response.estruturasNobres.find(
            (op) => op.nome.toLowerCase() === "outro"
          ),
          limpezaOutro: response.limpezas.find(
            (op) => op.nome.toLowerCase() === "outro"
          ),
          desbridamentoOutro: response.desbridamentos.find(
            (op) => op.nome.toLowerCase() === "outro"
          ),
          protecaoOutro: response.protecoes.find(
            (op) => op.nome.toLowerCase() === "outro"
          ),
        };

        setDadosEspeciaisForm(novosDadosEspeciais);
        setSchema(LesaoFormSchema(novosDadosEspeciais));

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

  const onSubmit: SubmitHandler<LesaoFormFields> = async (data) => {
    console.log(data);
    if (isEditMode) {
      await LesaoService.atualizarLesao(usuarioAtual?.cpf!, id_lesao, data);
    } else {
      await LesaoService.cadastrarLesao(usuarioAtual?.cpf!, id_paciente!, data);
    }
    navigate(`/dashboard/pacientes/${id_paciente}`);
  };

  const etiologias = useWatch({ control, name: "etiologias" }) || [];
  const regioesPerilesionais =
    useWatch({
      control,
      name: "regioesPerilesionais",
    }) || [];
  const estruturasNobres =
    useWatch({
      control,
      name: "estruturasNobres",
    }) || [];
  const dor = useWatch({ control, name: "dor" }) || "";
  const limpezas = useWatch({ control, name: "limpezas" }) || [];
  const desbridamentos = useWatch({ control, name: "desbridamentos" }) || [];
  const protecoes = useWatch({ control, name: "protecoes" }) || [];
  const tecidos = useWatch({ control, name: "tecidos" }) || [];
  const coberturas = useWatch({ control, name: "coberturas" }) || [];
  const tiposFechamentoCurativo =
    useWatch({ control, name: "tiposFechamentoCurativo" }) || [];

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
          dadosEspeciaisForm.etiologiaLesaoPorPressao?.id!
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
            dadosEspeciaisForm.regiaoPerilesionalOutro?.id!
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
                dadosEspeciaisForm.estruturaNobreOutro?.id!
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
                {tecidos.map((item, index) => {
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
          {(() => {
            const somaTecidos = tecidos.reduce(
              (acc, t) => acc + (Number.isNaN(t.valor) ? 0 : t.valor),
              0
            );

            const corSoma =
              somaTecidos > 100
                ? "text-red-600"
                : somaTecidos === 100
                ? "text-green-600"
                : "text-gray-700";

            return (
              <p className={`text-sm font-medium mt-6 ${corSoma}`}>
                Soma das porcentagens: {somaTecidos}%
                {somaTecidos > 100 && " (excede 100%)"}
                {somaTecidos === 100 && " (ok!)"}
              </p>
            );
          })()}
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
            {dor === "sim" && (
              <div className="flex flex-col gap-6 lg:flex-row">
                {/* Quantificação */}
                <div className="flex-1">
                  <Label className="block mb-2">Quantificação</Label>
                  <CarregarCheckboxGroup
                    control={control}
                    fieldName="quantificacoesDor"
                    options={dadosForm.quantificacoesDor}
                    error={errors.quantificacoesDor?.message}
                    errorClassName="mt-2 text-red-500 text-sm"
                  />
                </div>

                {/* Nível de dor */}
                <div className="flex-1">
                  <Controller
                    control={control}
                    name="nivelDor"
                    defaultValue={0}
                    render={({ field }) => (
                      <div>
                        <Label htmlFor="nivelDor" className="block mb-2">
                          Nível de Dor
                        </Label>
                        <Slider
                          id="nivelDor"
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
                  {errors.nivelDor && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.nivelDor.message}
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
              {/* Exsudato */}
              <Controller
                control={control}
                name="exsudato"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label className="text-xl font-bold mb-4 text-[#1F4D2C]">
                      Exsudato
                    </Label>
                    <Select
                      value={String(field.value ?? "")}
                      onValueChange={(val) => field.onChange(Number(val))}
                    >
                      <SelectTrigger className="min-h-[48px] w-full border p-2 rounded-md">
                        <SelectValue placeholder="Selecione o tipo de exsudato" />
                      </SelectTrigger>
                      <SelectContent>
                        {dadosForm.exsudatos.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.exsudato && (
                      <p className="text-red-500 text-sm">
                        {errors.exsudato.message}
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
                  Tamanho
                </Label>
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Comprimento */}
                  <Editor
                    id="comprimento"
                    ehCampoSenha={false}
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

              {limpezas.includes(dadosEspeciaisForm.limpezaOutro?.id!) && (
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
                dadosEspeciaisForm.desbridamentoOutro?.id!
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

            {protecoes.includes(dadosEspeciaisForm.protecaoOutro?.id!) && (
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
              {coberturas.map((item, index) => {
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
              {tiposFechamentoCurativo.map((item, index) => {
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
              })}
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

export default LesaoFormPage;
