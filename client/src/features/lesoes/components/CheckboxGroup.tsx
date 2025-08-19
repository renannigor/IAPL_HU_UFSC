// Checkbox genérico
interface CheckboxGroupProps {
  options: { id: number; nome: string }[];
  value: number[];
  onChange: (selected: number[]) => void;
  label: string;
  error?: string;
}

function CheckboxGroup({
  options,
  value,
  onChange,
  label,
  error,
}: CheckboxGroupProps) {
  const toggle = (id: number) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className="mb-4">
      <label className="font-semibold text-gray-700">{label}</label>
      <div className="flex flex-wrap gap-3 mt-2">
        {options.map((opt) => (
          <label key={opt.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.includes(opt.id)}
              onChange={() => toggle(opt.id)}
              className="h-4 w-4 text-green-700 border-gray-300 rounded"
            />
            <span className="text-gray-600">{opt.nome}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default CheckboxGroup;
