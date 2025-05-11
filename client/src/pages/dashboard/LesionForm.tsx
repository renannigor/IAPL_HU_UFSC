// src/pages/LesionForm.tsx
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LesaoFormSchema, LesaoFormFields } from "@/schemas/LesaoSchema";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import LesaoService from "@/services/LesaoService";

const LesaoFormPage = () => {
  const { id_lesao } = useParams(); // id_lesao -> edição
  const { id_paciente } = useParams(); // id_paciente -> cadastro
  const isEditMode = !!id_lesao;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LesaoFormFields>({
    resolver: zodResolver(LesaoFormSchema),
    defaultValues: {},
  });

  // Carrega dados se for edição
  useEffect(() => {
    const fetchLesao = async () => {
      const data = await LesaoService.obterLesao(id_lesao!);
      reset(data); // preenche os campos com os dados da API
    };
    if (isEditMode) fetchLesao();
  }, [id_lesao, isEditMode, reset]);

  const onSubmit: SubmitHandler<LesaoFormFields> = async (data) => {
    if (isEditMode) {
      await LesaoService.atualizarInfoLesao(id_lesao, data);
    } else {
      await LesaoService.cadastrarLesao(data);
    }
    navigate(`/dashboard/pacientes/${id_paciente}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-md mx-auto"
    >
      <div></div>

      <Button type="submit" disabled={isSubmitting}>
        {isEditMode ? "Atualizar" : "Cadastrar"}
      </Button>
    </form>
  );
};

export default LesaoFormPage;
