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
import Editor from "@/components/shared/Editor";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Utilitarios } from "@/utils/utilitarios";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

const LesaoFormPage = () => {
  const { id_lesao, id_paciente } = useParams();
  const isEditMode = !!id_lesao;
  const navigate = useNavigate();
  const { usuarioAtual } = useAuth();

  const [dadosForm, setDadosForm] = useState<{
    etiologias: string[];
    classificacoesLesaoPressao: string[];
    regioesPerilesionais: string[];
    bordas: string[];
    estruturasNobres: string[];
    quantificacoesDor: string[];
    exsudatos: string[];
    tiposExsudato: string[];
    odores: string[];
  }>({
    etiologias: [],
    classificacoesLesaoPressao: [],
    regioesPerilesionais: [],
    bordas: [],
    estruturasNobres: [],
    quantificacoesDor: [],
    exsudatos: [],
    tiposExsudato: [],
    odores: [],
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LesaoFormFields>({
    resolver: zodResolver(LesaoFormSchema),
    defaultValues: {},
  });

  // Carregar dados da lesão (edição)
  useEffect(() => {
    if (!isEditMode) return;
    const fetchLesao = async () => {
      const data = await LesaoService.obterLesao(id_lesao!);
      reset(data.dados);
    };
    fetchLesao();
  }, [isEditMode, id_lesao, reset]);

  // Carregar opções dos checkboxes
  useEffect(() => {
    const fetchDadosForm = async () => {
      try {
        const response = await DadosFormService.obterDadosForm();
        setDadosForm({
          etiologias: response.etiologias.map((e: any) => e.nome),
          classificacoesLesaoPressao: response.classificacoesLesaoPressao.map(
            (e: any) => e.nome
          ),
          regioesPerilesionais: response.regioesPerilesionais.map(
            (e: any) => e.nome
          ),
          bordas: response.bordas.map((e: any) => e.nome),
          estruturasNobres: response.estruturasNobres.map((e: any) => e.nome),
          quantificacoesDor: response.quantificacoesDor.map((e: any) => e.nome),
          exsudatos: response.exsudatos.map((e: any) => e.nome),
          tiposExsudato: response.tiposExsudato.map((e: any) => e.nome),
          odores: response.odores.map((e: any) => e.nome),
        });
      } catch (error) {
        console.error("Erro ao carregar dados do formulário", error);
      }
    };
    fetchDadosForm();
  }, []);

  const onSubmit: SubmitHandler<LesaoFormFields> = async (data) => {
    console.log(data);
    if (isEditMode) {
      await LesaoService.atualizarLesao(id_lesao, data);
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
      name: "tecido.estruturasNobres",
    }) || [];
  const dor = useWatch({ control, name: "dor" }) || "";

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <Button
          variant="outline"
          onClick={() => navigate(`/dashboard/pacientes/${id_paciente}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[#1F4D2C]">
          {isEditMode ? "Editar" : "Cadastrar"} Lesão
        </h1>
        <p className="text-sm text-gray-600">
          Preencha os campos abaixo para salvar as informações da lesão.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
        {etiologias.includes("Lesão por Pressão") && (
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

          {regioesPerilesionais.includes("Outro") && (
            <div className="mt-4">
              <Editor
                id="outraRegiaoPerilesional"
                label="Região Perilesional"
                ehCampoSenha={false}
                register={control.register("outraRegiaoPerilesional")}
                error={errors.outraRegiaoPerilesional?.message}
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
                fieldName="tecido.estruturasNobres"
                options={dadosForm.estruturasNobres}
                error={errors.tecido?.estruturasNobres?.message}
                errorClassName="mt-4 text-red-500 text-sm"
              />
              {estruturasNobres.includes("Outro") && (
                <div className="mt-4">
                  <Editor
                    id="outraEstruturaNobre"
                    label="Estrutura Nobre"
                    ehCampoSenha={false}
                    register={control.register("tecido.outraEstruturaNobre")}
                    error={errors.tecido?.outraEstruturaNobre?.message}
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
              <Label className="block font-medium text-gray-500 mb-1">
                Porcentagens (0 a 100%)
              </Label>
              <div className="space-y-3 mt-2">
                {Utilitarios.porcentagens.map(([key, label]) => (
                  <Editor
                    key={key}
                    id={key}
                    label={label}
                    ehCampoSenha={false}
                    register={control.register(`tecido.${key}`, {
                      valueAsNumber: true,
                    })}
                    error={errors.tecido?.[key]?.message}
                    placeholder={label}
                    className="h-12 w-full border p-2 rounded-md"
                    labelClassName="block font-medium mb-1"
                    errorClassName="text-red-500 text-sm mt-1"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Soma das porcentagens */}
          {(() => {
            const porcentagens = useWatch({
              control,
              name: [
                "tecido.epitelizado",
                "tecido.granulacao",
                "tecido.hipergranulacao",
                "tecido.necroseSeca",
                "tecido.necroseUmida",
                "tecido.esfacelo",
              ],
            });

            const soma = porcentagens.reduce(
              (acc, val) => acc + (Number(val) || 0),
              0
            );
            const corSoma =
              soma > 100
                ? "text-red-600"
                : soma === 100
                ? "text-green-600"
                : "text-gray-700";

            return (
              <p className={`text-sm font-medium mt-6 ${corSoma}`}>
                Soma das porcentagens: {soma}%{soma > 100 && " (excede 100%)"}
                {soma === 100 && " (ok!)"}
              </p>
            );
          })()}

          <div>
            {errors.tecido && (
              <p className="text-red-500 text-sm mt-1">
                {errors.tecido.message}
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
                    value={field.value}
                    defaultValue={field.value}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sim" id="sim" />
                      <Label htmlFor="sim">Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nao" id="nao" />
                      <Label htmlFor="nao">Não</Label>
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
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tipo de exsudato" />
                      </SelectTrigger>
                      <SelectContent>
                        {dadosForm.exsudatos.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
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
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {dadosForm.tiposExsudato.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
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
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o odor" />
                      </SelectTrigger>
                      <SelectContent>
                        {dadosForm.odores.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
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
            Materias Utilizados
          </h2>
          <div>
            <Label className="block font-medium text-gray-500 mb-1">
              Cobertura Utilizada
            </Label>
            {/* Cobertura Utilizada */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {Utilitarios.coberturaUtilizada.map(([key, label]) => (
                <div key={key} className="mb-3">
                  <Editor
                    id={key}
                    label={label}
                    ehCampoSenha={false}
                    register={control.register(`coberturaUtilizada.${key}`, {
                      valueAsNumber: true,
                    })}
                    error={errors.coberturaUtilizada?.[key]?.message}
                    placeholder={label}
                    className="h-12 w-full border p-2 rounded-md"
                    labelClassName="block font-medium mb-1"
                    errorClassName="text-red-500 text-sm mt-1"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="block font-medium text-gray-500 mb-1">
              Fechamento do curativo
            </Label>
            {/* Fechamento do curativo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {Utilitarios.fechamentoCurativo.map(([key, label]) => (
                <div key={key} className="mb-3">
                  <Editor
                    id={key}
                    label={label}
                    ehCampoSenha={false}
                    register={control.register(`fechamentoCurativo.${key}`, {
                      valueAsNumber: true,
                    })}
                    error={errors.fechamentoCurativo?.[key]?.message}
                    placeholder={label}
                    className="h-12 w-full border p-2 rounded-md"
                    labelClassName="block font-medium mb-1"
                    errorClassName="text-red-500 text-sm mt-1"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {errors.root && (
          <p className="text-red-500 text-sm">{errors.root.message}</p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isEditMode ? "Atualizar" : "Cadastrar"}
        </Button>
      </form>
    </div>
  );
};

export default LesaoFormPage;
