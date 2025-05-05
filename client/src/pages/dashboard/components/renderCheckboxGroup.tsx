import { Control, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  control: Control<any>;
  fieldName: string;
  options: string[];
}

export function renderCheckboxGroup({ control, fieldName, options }: Props) {
  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field }) => {
        const selectedValues: string[] = field.value || [];

        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {options.map((option, i) => (
              <label key={`${option}-${i}`} className="flex items-center gap-2">
                <Checkbox
                  checked={selectedValues.includes(option)}
                  onCheckedChange={(checked) => {
                    const newValue = checked
                      ? [...selectedValues, option]
                      : selectedValues.filter((v) => v !== option);
                    field.onChange(newValue);
                  }}
                />
                {option}
              </label>
            ))}
          </div>
        );
      }}
    />
  );
}
