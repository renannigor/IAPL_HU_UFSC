import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  register?: any;
  error?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

const LabelInput = ({
  label,
  id,
  register,
  error,
  inputClassName = "",
  labelClassName = "block text-sm font-medium text-gray-700 mb-1",
  errorClassName = "text-red-500 text-sm mt-1",
  ...props
}: LabelInputProps) => (
  <div>
    <Label htmlFor={id} className={labelClassName}>
      {label}
    </Label>
    <Input
      id={id}
      className={inputClassName}
      {...(register ? register : {})}
      {...props}
    />
    {error && <p className={errorClassName}>{error}</p>}
  </div>
);

export default LabelInput;
