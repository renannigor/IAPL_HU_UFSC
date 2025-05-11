import { useForm, Controller, useWatch, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LesaoFormFields, LesaoFormSchema } from "@/schemas/LesaoSchema";
import { Utilitarios } from "@/utils/utilitarios";
import { ArrowLeft } from "lucide-react";
import { carregarCheckboxGroup } from "@/pages/dashboard/components/CarregarCheckboxGroup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LesaoFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LesaoFormFields>({
    resolver: zodResolver(LesaoFormSchema),
    defaultValues: {
      etiologias: [],
      classificacoes: [],
      regioesPerilesionais: [],
      outraRegiaoPerilesional: "",
      bordas: [],
      tecido: {
        estruturasNobres: [],
        outroEstruturaNobre: "",
        epitelizado: 0,
        granulacao: 0,
        hipergranulacao: 0,
        necroseSeca: 0,
        necroseUmida: 0,
        esfacelo: 0,
      },
    },
  });

  const etiologias = useWatch({ control, name: "etiologias" });
  const regioesPerilesionais = useWatch({
    control,
    name: "regioesPerilesionais",
  });
  const estruturasNobres = useWatch({
    control,
    name: "tecido.estruturasNobres",
  });

  const onSubmit: SubmitHandler<LesaoFormFields> = async (data) => {
    console.log(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate(`/dashboard/pacientes/${id}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      <h1 className="text-2xl font-bold text-green-700">Cadastro de Lesão</h1>
      <p className="text-sm text-gray-600">
        Preencha os campos abaixo para registrar as informações da lesão.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Etiologias */}
        <div className="border rounded p-4 mb-6">
          <p className="text-green-700 font-semibold mb-2">
            Etiologia da Lesão
          </p>
          {carregarCheckboxGroup({
            control,
            fieldName: "etiologias",
            options: Utilitarios.etiologiaLesoes,
          })}
          {errors.etiologias && (
            <p className="text-red-500 text-sm mt-1">
              {errors.etiologias.message}
            </p>
          )}
        </div>

        {/* Classificações (condicional) */}
        {etiologias.includes("Lesão por Pressão") && (
          <div className="border rounded p-4 mb-6">
            <p className="text-green-700 font-semibold mb-2">
              Classificação da Lesão por Pressão
            </p>
            {carregarCheckboxGroup({
              control,
              fieldName: "classificacoes",
              options: Utilitarios.classificacoesLesaoPorPressao,
            })}
            {errors.classificacoes && (
              <p className="text-red-500 text-sm mt-1">
                {errors.classificacoes.message}
              </p>
            )}
          </div>
        )}

        {/* Regiões Perilesionais */}
        <div className="border rounded p-4 mb-6">
          <p className="text-green-700 font-semibold mb-2">
            Região Perilesional
          </p>
          {carregarCheckboxGroup({
            control,
            fieldName: "regioesPerilesionais",
            options: Utilitarios.regioesPerilesionais,
          })}

          {regioesPerilesionais.includes("Outro") && (
            <Controller
              name="outraRegiaoPerilesional"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Informe a outra região perilesional"
                  className="mt-2"
                />
              )}
            />
          )}
          {errors.regioesPerilesionais && (
            <p className="text-red-500 text-sm mt-1">
              {errors.regioesPerilesionais.message}
            </p>
          )}

          {errors.outraRegiaoPerilesional &&
            regioesPerilesionais.includes("Outro") && (
              <p className="text-red-500 text-sm mt-1">
                {errors.outraRegiaoPerilesional.message}
              </p>
            )}
        </div>

        {/* Bordas */}
        <div className="border rounded p-4 mb-6">
          <p className="text-green-700 font-semibold mb-2">Bordas</p>
          {carregarCheckboxGroup({
            control,
            fieldName: "bordas",
            options: Utilitarios.bordas,
          })}
          {errors.bordas && (
            <p className="text-red-500 text-sm mt-1">{errors.bordas.message}</p>
          )}
        </div>

        {/* Tecido */}
        <div className="border rounded p-4 mb-6 space-y-4">
          <p className="text-green-700 font-semibold mb-2">Tecido</p>

          {/* Estruturas Nobres e Porcentagens lado a lado em telas maiores */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Estruturas Nobres */}
            <div className="flex-1">
              <p className="text-green-700 mb-2">
                Exposição de Estruturas Nobres
              </p>
              {carregarCheckboxGroup({
                control,
                fieldName: "tecido.estruturasNobres",
                options: Utilitarios.estruturasNobres,
              })}

              {estruturasNobres.includes("Outro") && (
                <Controller
                  name="tecido.outroEstruturaNobre"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Informe outra estrutura nobre"
                      className="mt-2"
                    />
                  )}
                />
              )}
              {errors.tecido?.outroEstruturaNobre &&
                estruturasNobres.includes("Outro") && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.tecido.outroEstruturaNobre.message}
                  </p>
                )}

              {errors.tecido?.estruturasNobres && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tecido.estruturasNobres.message}
                </p>
              )}
            </div>

            {/* Porcentagens */}
            <div className="flex-1">
              <p className="text-green-700 mb-2">Porcentagens (0 a 100%)</p>
              {errors.tecido && (
                <p className="text-red-500 text-sm">{errors.tecido.message}</p>
              )}
              {Utilitarios.porcentagens.map(([key, label]) => (
                <div key={key} className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <Controller
                    name={`tecido.${key}`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        {...field}
                        value={field.value ?? ""}
                        placeholder="0 a 100%"
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        className={errors.tecido?.[key] ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.tecido?.[key] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.tecido[key]?.message}
                    </p>
                  )}
                </div>
              ))}

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
                  <p className={`text-sm font-medium mt-4 ${corSoma}`}>
                    Soma das porcentagens: {soma}%
                    {soma > 100 && " (excede 100%)"}
                    {soma === 100 && " (ok!)"}
                  </p>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Exsudato, Odor e Tamanho */}
        <div className="border rounded p-4 mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Coluna 1: Quantidade de Exsudato e Odor */}
            <div className="flex-1 space-y-4">
              {/* Quantidade de Exsudato */}
              <div>
                <Controller
                  name="exsudato"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Label className="text-green-700 font-semibold mb-2">
                        Exsudato
                      </Label>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {Utilitarios.exsudato.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                {errors.exsudato && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.exsudato.message}
                  </p>
                )}
              </div>

              {/* Odor */}
              <div>
                <Controller
                  name="odor"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Label className="text-green-700 font-semibold mb-2">
                        Odor
                      </Label>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {Utilitarios.odores.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                {errors.odor && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.odor.message}
                  </p>
                )}
              </div>
            </div>

            {/* Coluna 2: Tipo de Exsudato e Tamanho */}
            <div className="flex-1 space-y-4">
              {/* Tipo de Exsudato */}
              <div>
                <Controller
                  name="tipoExsudato"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Label className="text-green-700 font-semibold mb-2">
                        Tipo de Exsudato
                      </Label>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {Utilitarios.tiposExsudato.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                {errors.tipoExsudato && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.tipoExsudato.message}
                  </p>
                )}
              </div>

              {/* Tamanho */}
              <div className="flex gap-2">
                {/* Comprimento */}
                <div className="flex-1">
                  <Label className="text-green-700 font-semibold mb-2">
                    Comprimento (cm)
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    {...register("tamanho.comprimento", {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.tamanho?.comprimento && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.tamanho.comprimento.message}
                    </p>
                  )}
                </div>

                {/* Largura */}
                <div className="flex-1">
                  <Label className="text-green-700 font-semibold mb-2">
                    Largura (cm)
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    {...register("tamanho.largura", { valueAsNumber: true })}
                  />
                  {errors.tamanho?.largura && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.tamanho.largura.message}
                    </p>
                  )}
                </div>

                {/* Profundidade */}
                <div className="flex-1">
                  <Label className="text-green-700 font-semibold mb-2">
                    Profundidade (cm)
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    {...register("tamanho.profundidade", {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.tamanho?.profundidade && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.tamanho.profundidade.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Cadastrar Lesão"}
        </Button>
      </form>
    </div>
  );
};

export default LesaoFormPage;
