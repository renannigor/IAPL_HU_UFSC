import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LesaoFormFields, LesaoFormSchema } from "@/schemas/lesaoSchema";
import { Helpers } from "@/utils/helpers";
import { ArrowLeft } from "lucide-react";
import { renderCheckboxGroup } from "./components/renderCheckboxGroup";

const LesaoFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
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

  const onSubmit = (data: LesaoFormFields) => {
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
          {renderCheckboxGroup({
            control,
            fieldName: "etiologias",
            options: Helpers.etiologiaLesoes,
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
            {renderCheckboxGroup({
              control,
              fieldName: "classificacoes",
              options: Helpers.classificacoesLesaoPorPressao,
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
          {renderCheckboxGroup({
            control,
            fieldName: "regioesPerilesionais",
            options: Helpers.regioesPerilesionais,
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
          {renderCheckboxGroup({
            control,
            fieldName: "bordas",
            options: Helpers.bordas,
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
              {renderCheckboxGroup({
                control,
                fieldName: "tecido.estruturasNobres",
                options: Helpers.estruturasNobres,
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
              {Helpers.porcentagens.map(([key, label]) => (
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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Cadastrar Lesão"}
        </Button>
      </form>
    </div>
  );
};

export default LesaoFormPage;
