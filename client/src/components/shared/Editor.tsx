import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface EditorProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  helperText?: string;
  placeholder: string;
  ehCampoSenha: boolean;
  register?: UseFormRegisterReturn;
  error?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

const Editor = ({
  id,
  label,
  helperText,
  placeholder,
  ehCampoSenha,
  inputClassName = "",
  labelClassName = "block text-sm font-medium text-gray-700 mb-1",
  errorClassName = "text-red-500 text-sm mt-1",
  error,
  register,
  ...props
}: EditorProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      {label && (
        <Label htmlFor={id} className={labelClassName}>
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          id={id}
          type={ehCampoSenha ? (showPassword ? "text" : "password") : "text"}
          placeholder={placeholder}
          className={inputClassName}
          {...register}
          {...props}
        />
        {ehCampoSenha && (
          <button
            type="button"
            className="absolute inset-y-0 right-2 flex items-center text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {helperText && <p className="text-sm text-gray-500 mt-1">{helperText}</p>}
      {error && <p className={errorClassName}>{error}</p>}
    </div>
  );
};

export default Editor;
