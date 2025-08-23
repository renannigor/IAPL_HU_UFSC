import { Opcao } from "@/types/Opcao";

interface SelectProps {
  label: string;
  options: Opcao[];
  error?: string;
  register?: any;
  disabled?: boolean;
}

export const Select = ({
  label,
  options,
  error,
  register,
  disabled = false,
}: SelectProps) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-gray-700 font-medium">{label}</label>
      <select
        {...register}
        disabled={disabled}
        className={`border rounded px-4 py-2 transition-all duration-200 focus:outline-none ${
          error ? "border-red-500" : "border-gray-300"
        } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
      >
        <option value="">Selecione...</option>
        {options.map((opcao) => (
          <option key={opcao.id} value={opcao.id}>
            {opcao.nome}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};
