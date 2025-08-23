interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  register?: any;
  focusColor?: string;
}

export const Input = ({
  label,
  error,
  register,
  focusColor = "#E6F2EC",
  disabled,
  ...props
}: InputProps) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-gray-700 font-medium">{label}</label>
      <input
        {...props}
        {...register}
        disabled={disabled}
        className={`border rounded px-4 py-2 transition-all duration-200 focus:outline-none ${
          error ? "border-red-500" : "border-gray-300"
        } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
        style={{ backgroundColor: disabled ? "#F3F4F6" : undefined }}
        onFocus={(e) => {
          if (!disabled) e.currentTarget.style.backgroundColor = focusColor;
        }}
        onBlur={(e) => {
          if (!disabled) e.currentTarget.style.backgroundColor = "";
          if (props.onBlur) props.onBlur(e); // repassa o onBlur se existir
        }}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};
