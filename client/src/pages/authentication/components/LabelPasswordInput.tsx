import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

interface LabelPasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  register?: any;
  error?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

const LabelPasswordInput = ({
  label,
  id,
  register,
  error,
  inputClassName = "",
  labelClassName = "block text-sm font-medium text-gray-700 mb-1",
  errorClassName = "text-red-500 text-sm mt-1",
  ...props
}: LabelPasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <Label htmlFor={id} className={labelClassName}>
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          className={inputClassName}
          {...(register ? register : {})}
          {...props}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-2 flex items-center text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className={errorClassName}>{error}</p>}
    </div>
  );
};

export default LabelPasswordInput;
