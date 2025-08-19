import { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import {
  Cobertura,
  FormLesaoFields,
  FormLesaoSchema,
  Tecido,
  TipoFechamentoCurativo,
} from "../schemas/LesaoSchema";
import DadosFormLesaoService from "../services/DadosFormLesaoService";
import LesaoService from "../services/LesaoService";
import BreadcrumbNav from "@/shared/components/layout/BreadcrumbNav";
import { cores } from "@/shared/constants/cores";
import { CamposCondicionaisFormulario } from "../types/CamposCondicionaisFormulario";
import { CamposFormulario } from "../constants/camposFormulario.enum";
import { DadosFormLesao } from "../types/DadosFormLesao";
import { useFormularioWatch } from "../hooks/useFormularioWatch";
import { Input } from "@/shared/components/form/Input";
import { Opcao } from "@/types/Opcao";
import { Check, Plus } from "lucide-react";
import { toast } from "sonner";
import CheckboxGroup from "../components/CheckboxGroup";
import PacienteService from "@/features/pacientes/services/PacienteService";
import { Paciente } from "@/features/pacientes/types/Paciente";

// Formulário de lesão
function FormLesaoPage() {
  const { id_lesao, id_paciente } = useParams();
  const isEditMode = !!id_lesao;
  const navigate = useNavigate();
  const { usuarioAtual } = useAuth();

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
  const [schema, setSchema] = useState<any>(null);
  const [camposCondicionaisForm, setCamposCondicionaisForm] =
    useState<CamposCondicionaisFormulario>({});
  const [paciente, setPaciente] = useState<Paciente | null>(null);

  const form = useForm<FormLesaoFields>({
    resolver: schema ? zodResolver(schema) : undefined,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  // Carregando os dados do formulário
  useEffect(() => {
    const fetchDados = async () => {
      const response = await DadosFormLesaoService.getDadosFormLesao();
      setDadosForm(response);

      // Atualiza os dados condicionais do formulário e schema para validação
      const camposCondicionais: CamposCondicionaisFormulario = {
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

      setCamposCondicionaisForm(camposCondicionais);
      setSchema(FormLesaoSchema(camposCondicionais));

      if (!isEditMode) {
        reset({
          tecidos: response.tecidos.map((t: any) => ({ ...t, valor: 0 })),
          coberturas: response.coberturas.map((c: any) => ({ ...c, valor: 0 })),
          tiposFechamentoCurativo: response.tiposFechamentoCurativo.map(
            (c: any) => ({ ...c, valor: 0 })
          ),
        });
      }
    };

    fetchDados();
  }, [reset, isEditMode]);

  useEffect(() => {
    if (!isEditMode) return;

    // Carregando os dados da lesão para edição
    const fetchLesao = async () => {
      const { dados } = await LesaoService.getLesaoPorId(id_lesao!);
      reset(dados);
    };

    fetchLesao();
  }, [id_lesao, isEditMode, reset]);

  useEffect(() => {
    const fetchPaciente = async () => {
      const data = await PacienteService.getPaciente(id_paciente!);
      setPaciente(data);
    };
    if (id_paciente) fetchPaciente();
  }, [id_paciente]);

  // Submissão dos dados do formulário
  const onSubmit: SubmitHandler<FormLesaoFields> = async (data) => {
    const payload = {
      ...data,
      tamanho: {
        comprimento: data.tamanho.comprimento,
        largura: data.tamanho.comprimento,
        profundidade: data.tamanho.profundidade
          ? Number(data.tamanho.profundidade)
          : undefined,
      },
      dataProximaAvaliacao: data.dataProximaAvaliacao
        ? new Date(data.dataProximaAvaliacao)
        : undefined,
    };

    if (isEditMode) {
      // Atualizando a lesão
      await LesaoService.atualizarLesao(usuarioAtual?.cpf!, id_lesao, payload);
    } else {
      // Cadastrando a lesão
      await LesaoService.cadastrarLesao(
        usuarioAtual?.cpf!,
        id_paciente!,
        payload
      );
    }
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
    <div className="min-h-screen" style={{ backgroundColor: cores.background }}>
      <BreadcrumbNav
        items={[
          { label: "Início", href: "/dashboard" },
          { label: "Pacientes", href: "/dashboard/pacientes" },
          {
            label: paciente?.nome!,
            href: `/dashboard/pacientes/${id_paciente}`,
          },
          {
            label: isEditMode ? "Editar Lesão" : "Cadastrar Lesão",
          },
        ]}
      />

      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-10">
        {isEditMode ? "Editar Lesão" : "Cadastrar Lesão"}
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.log("Erros no formulário:", errors);
          // Aviso para preenchimento dos campos obrigatórios
          toast("Preencha todos os campos obrigatórios.");
        })}
        className="grid grid-cols-1 md:grid-cols-1 gap-8"
      >
        {/* Etiologia */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition border border-gray-200">
          {dadosForm.etiologias && (
            <Controller
              name="etiologias"
              control={control}
              render={({ field }) => (
                <CheckboxGroup
                  options={dadosForm.etiologias}
                  value={field.value || []}
                  onChange={field.onChange}
                  label="Etiologias"
                  error={errors.etiologias?.message?.toString()}
                />
              )}
            />
          )}
        </div>

        {/* Classificação Lesão Por Pressão */}
        {etiologias.includes(
          camposCondicionaisForm.etiologiaLesaoPorPressao?.id!
        ) && (
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition border border-gray-200">
            {dadosForm.classificacoesLesaoPressao && (
              <Controller
                name="classificacoesLesaoPressao"
                control={control}
                render={({ field }) => (
                  <CheckboxGroup
                    options={dadosForm.classificacoesLesaoPressao}
                    value={field.value || []}
                    onChange={field.onChange}
                    label=" Classificação da Lesão Por Pressão"
                    error={errors.classificacoesLesaoPressao?.message?.toString()}
                  />
                )}
              />
            )}
          </div>
        )}

        {/* Região Perilesional */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition border border-gray-200">
          {dadosForm.regioesPerilesionais && (
            <Controller
              name="regioesPerilesionais"
              control={control}
              render={({ field }) => (
                <CheckboxGroup
                  options={dadosForm.regioesPerilesionais}
                  value={field.value || []}
                  onChange={field.onChange}
                  label="Região Perilesional"
                  error={errors.regioesPerilesionais?.message?.toString()}
                />
              )}
            />
          )}

          {regioesPerilesionais.includes(
            camposCondicionaisForm.regiaoPerilesionalOutro?.id!
          ) && (
            <Input
              label="Outra Região Perilesional"
              placeholder="Digite uma outra região perilesional"
              error={errors.regiaoPerilesionalOutro?.message}
              register={control.register("regiaoPerilesionalOutro")}
              focusColor={cores.primaryLighter}
            />
          )}
        </div>

        {/* Borda */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition border border-gray-200">
          {dadosForm.bordas && (
            <Controller
              name="bordas"
              control={control}
              render={({ field }) => (
                <CheckboxGroup
                  options={dadosForm.bordas}
                  value={field.value || []}
                  onChange={field.onChange}
                  label="Bordas"
                  error={errors.bordas?.message?.toString()}
                />
              )}
            />
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition border border-gray-200">
          {/* Estruturas Nobres */}
          <div>
            {dadosForm.estruturasNobres && (
              <Controller
                name="estruturasNobres"
                control={control}
                render={({ field }) => (
                  <CheckboxGroup
                    options={dadosForm.estruturasNobres}
                    value={field.value || []}
                    onChange={field.onChange}
                    label="Estruturas Nobres"
                    error={errors.estruturasNobres?.message?.toString()}
                  />
                )}
              />
            )}

            {estruturasNobres.includes(
              camposCondicionaisForm.estruturaNobreOutro?.id!
            ) && (
              <Input
                label="Outra Estrutura Nobre"
                placeholder="Digite uma outra estrutura nobre"
                error={errors.estruturaNobreOutro?.message}
                register={control.register("estruturaNobreOutro")}
                focusColor={cores.primaryLighter}
              />
            )}
          </div>

          {/* Porcentagens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {tecidos.map((item: Tecido, index: number) => {
              const errorMessage = errors.tecidos?.[index]?.valor?.message;

              return (
                <Input
                  key={item.id}
                  label={item.nome}
                  placeholder={item.nome}
                  error={errorMessage}
                  register={control.register(`tecidos.${index}.valor`, {
                    valueAsNumber: true,
                  })}
                  focusColor={cores.primaryLighter}
                />
              );
            })}
          </div>

          {errors.tecidos?.root && (
            <p className="text-red-500 text-sm mt-3">
              {errors.tecidos?.root?.message}
            </p>
          )}

          {/* Soma das porcentagens */}
          <p className={`text-sm font-medium mt-6 ${corSoma}`}>
            Soma das porcentagens: {somaTecidos}%{mensagemSoma}
          </p>
        </div>

        {/* Presença de Túnel */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition border border-gray-200">
          <label className="font-semibold text-gray-700 mb-2 block">
            Presença de Túnel
          </label>

          <Controller
            name="presencaTunel"
            control={control}
            render={({ field }) => (
              <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="sim"
                    checked={field.value === "sim"}
                    onChange={() => field.onChange("sim")}
                    className="h-4 w-4 text-green-700 border-gray-300"
                  />
                  <span className="text-gray-600">Sim</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="nao"
                    checked={field.value === "nao"}
                    onChange={() => field.onChange("nao")}
                    className="h-4 w-4 text-green-700 border-gray-300"
                  />
                  <span className="text-gray-600">Não</span>
                </label>
              </div>
            )}
          />

          {errors.presencaTunel && (
            <p className="text-red-500 text-sm mt-1">
              {errors.presencaTunel.message?.toString()}
            </p>
          )}
        </div>

        {/* Dor */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition border border-gray-200 space-y-4">
          <label className="font-semibold text-gray-700 mb-2 block">Dor</label>

          <Controller
            name="dor"
            control={control}
            render={({ field }) => (
              <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="sim"
                    checked={field.value === "sim"}
                    onChange={() => field.onChange("sim")}
                    className="h-4 w-4 text-green-700 border-gray-300"
                  />
                  <span className="text-gray-600">Sim</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="nao"
                    checked={field.value === "nao"}
                    onChange={() => field.onChange("nao")}
                    className="h-4 w-4 text-green-700 border-gray-300"
                  />
                  <span className="text-gray-600">Não</span>
                </label>
              </div>
            )}
          />
          {errors.dor && (
            <p className="text-red-500 text-sm mt-1">
              {errors.dor.message?.toString()}
            </p>
          )}

          {dor === CamposFormulario.OpcaoSim && (
            <div className="space-y-4 mt-4">
              {/* Classificação da dor */}
              {dadosForm.classificacoesDor && (
                <Controller
                  name="classificacoesDor"
                  control={control}
                  render={({ field }) => (
                    <CheckboxGroup
                      options={dadosForm.classificacoesDor}
                      value={field.value || []}
                      onChange={field.onChange}
                      label="Classificação da Dor"
                      error={errors.classificacoesDor?.message?.toString()}
                    />
                  )}
                />
              )}

              {/* Escala Numérica da Dor */}
              <div>
                <label className="font-semibold text-gray-700 mb-2 block">
                  Escala Numérica da Dor (1 a 10)
                </label>
                <Controller
                  name="escalaNumericaDor"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-3">
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(
                        (num) => (
                          <label key={num} className="flex items-center gap-2">
                            <input
                              type="radio"
                              value={num}
                              checked={field.value === num}
                              onChange={() => field.onChange(num)}
                              className="h-4 w-4 text-green-700 border-gray-300"
                            />
                            <span className="text-gray-600">{num}</span>
                          </label>
                        )
                      )}
                    </div>
                  )}
                />
                {errors.escalaNumericaDor && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.escalaNumericaDor.message?.toString()}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition border border-gray-200 space-y-6">
          {/* Grid de selects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quantidade de Exsudato */}
            {dadosForm.quantidadesExsudato && (
              <Controller
                name="quantidadeExsudato"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="font-semibold text-gray-700 mb-2 block">
                      Quantidade de Exsudato
                    </label>
                    <select
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                    >
                      <option value="">Selecione</option>
                      {dadosForm.quantidadesExsudato.map((opt: Opcao) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.nome}
                        </option>
                      ))}
                    </select>
                    {errors.quantidadeExsudato && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.quantidadeExsudato.message?.toString()}
                      </p>
                    )}
                  </div>
                )}
              />
            )}

            {/* Tipo de Exsudato */}
            {dadosForm.tiposExsudato && (
              <Controller
                name="tipoExsudato"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="font-semibold text-gray-700 mb-2 block">
                      Tipo de Exsudato
                    </label>
                    <select
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                    >
                      <option value="">Selecione</option>
                      {dadosForm.tiposExsudato.map((opt: Opcao) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.nome}
                        </option>
                      ))}
                    </select>
                    {errors.tipoExsudato && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.tipoExsudato.message?.toString()}
                      </p>
                    )}
                  </div>
                )}
              />
            )}

            {/* Odor */}
            {dadosForm.odores && (
              <Controller
                name="odor"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="font-semibold text-gray-700 mb-2 block">
                      Odor
                    </label>
                    <select
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                    >
                      <option value="">Selecione</option>
                      {dadosForm.odores.map((opt: Opcao) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.nome}
                        </option>
                      ))}
                    </select>
                    {errors.odor && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.odor.message?.toString()}
                      </p>
                    )}
                  </div>
                )}
              />
            )}
          </div>

          {/* Tamanho */}
          <div>
            <label className="font-semibold text-gray-700 mb-2 block">
              Tamanho (em cm)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Comprimento"
                placeholder="Digite o comprimento"
                error={errors.tamanho?.comprimento?.message}
                register={control.register("tamanho.comprimento", {
                  valueAsNumber: true,
                })}
                focusColor={cores.primaryLighter}
              />
              <Input
                label="Largura"
                placeholder="Digite a largura"
                error={errors.tamanho?.largura?.message}
                register={control.register("tamanho.largura", {
                  valueAsNumber: true,
                })}
                focusColor={cores.primaryLighter}
              />
              <Input
                label="Profundidade"
                placeholder="Digite a profundidade"
                error={errors.tamanho?.profundidade?.message}
                register={control.register("tamanho.profundidade")}
                focusColor={cores.primaryLighter}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition border border-gray-200 space-y-6">
          <label className="font-semibold text-gray-700 mb-2 block">
            Preparo de Leito
          </label>

          <div>
            {dadosForm.limpezas && (
              <Controller
                name="limpezas"
                control={control}
                render={({ field }) => (
                  <CheckboxGroup
                    options={dadosForm.limpezas}
                    value={field.value || []}
                    onChange={field.onChange}
                    label="Limpeza"
                    error={errors.limpezas?.message?.toString()}
                  />
                )}
              />
            )}

            {limpezas.includes(camposCondicionaisForm.limpezaOutro?.id!) && (
              <Input
                label="Outra Limpeza"
                placeholder="Digite uma outra limpeza"
                error={errors.limpezaOutro?.message}
                register={control.register("limpezaOutro")}
                focusColor={cores.primaryLighter}
              />
            )}
          </div>

          <div>
            {dadosForm.desbridamentos && (
              <Controller
                name="desbridamentos"
                control={control}
                render={({ field }) => (
                  <CheckboxGroup
                    options={dadosForm.desbridamentos}
                    value={field.value || []}
                    onChange={field.onChange}
                    label="Desbridamento"
                    error={errors.desbridamentos?.message?.toString()}
                  />
                )}
              />
            )}

            {desbridamentos.includes(
              camposCondicionaisForm.desbridamentoOutro?.id!
            ) && (
              <Input
                label="Outro Desbridamento"
                placeholder="Digite um outro desbridamento"
                error={errors.desbridamentoOutro?.message}
                register={control.register("desbridamentoOutro")}
                focusColor={cores.primaryLighter}
              />
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition border border-gray-200 space-y-6">
          <label className="font-semibold text-gray-700 mb-2 block">
            Prevenção e Tratamento de Lesões
          </label>

          <div>
            {dadosForm.protecoes && (
              <Controller
                name="protecoes"
                control={control}
                render={({ field }) => (
                  <CheckboxGroup
                    options={dadosForm.protecoes}
                    value={field.value || []}
                    onChange={field.onChange}
                    label="Proteção"
                    error={errors.protecoes?.message?.toString()}
                  />
                )}
              />
            )}

            {protecoes.includes(camposCondicionaisForm.protecaoOutro?.id!) && (
              <Input
                label="Outra Proteção"
                placeholder="Digite uma outra proteção"
                error={errors.protecaoOutro?.message}
                register={control.register("protecaoOutro")}
                focusColor={cores.primaryLighter}
              />
            )}
          </div>

          {/* Cobertura Utilizada */}
          <div>
            <label className="font-semibold text-gray-700 mb-2 block">
              Cobertura Utilizada
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {coberturas.map((item: Cobertura, index: number) => {
                const errorMessage = errors.coberturas?.[index]?.valor?.message;

                return (
                  <Input
                    key={item.id}
                    label={item.nome}
                    placeholder={item.nome}
                    error={errorMessage}
                    register={control.register(`coberturas.${index}.valor`, {
                      valueAsNumber: true,
                    })}
                    focusColor={cores.primaryLighter}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-700 mb-2 block">
              Fechamento do curativo
            </label>
            {/* Fechamento do curativo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {tiposFechamentoCurativo.map(
                (item: TipoFechamentoCurativo, index: number) => {
                  const errorMessage =
                    errors.tiposFechamentoCurativo?.[index]?.valor?.message;

                  return (
                    <Input
                      key={item.id}
                      label={item.nome}
                      placeholder={item.nome}
                      error={errorMessage}
                      register={control.register(
                        `tiposFechamentoCurativo.${index}.valor`,
                        {
                          valueAsNumber: true,
                        }
                      )}
                      focusColor={cores.primaryLighter}
                    />
                  );
                }
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition border border-gray-200 space-y-6">
          <label className="font-semibold text-gray-700 mb-2 block">
            Informações adicionais
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Data da Próxima Avaliação */}
            <div>
              <label className="font-semibold text-gray-700 mb-2 block">
                Data da Próxima Avaliação
              </label>
              <input
                type="date"
                {...control.register("dataProximaAvaliacao")}
                min={new Date().toISOString().split("T")[0]}
                className="w-full border border-gray-300 rounded px-4 h-10 focus:outline-none focus:ring-2 focus:ring-green-700"
              />
              {errors.dataProximaAvaliacao && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dataProximaAvaliacao.message?.toString()}
                </p>
              )}
            </div>

            {/* Localização da Lesão */}
            <div>
              <Input
                label="Localização"
                placeholder="Digite a localização da lesão"
                error={errors.localizacaoLesao?.message}
                register={control.register("localizacaoLesao")}
                focusColor={cores.primaryLighter}
              />
            </div>
          </div>
        </div>

        {/* Botão flutuante */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="fixed bottom-8 right-8 p-4 rounded-full shadow-lg text-white flex items-center justify-center"
          style={{ backgroundColor: cores.primary }}
          title={isEditMode ? "Atualizar Lesão" : "Cadastrar Lesão"} // tooltip
        >
          {isEditMode ? <Check size={24} /> : <Plus size={24} />}
        </button>
      </form>
    </div>
  );
}

export default FormLesaoPage;
