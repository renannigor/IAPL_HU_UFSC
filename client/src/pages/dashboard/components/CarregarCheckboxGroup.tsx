import { Control, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import React from "react";
import { Opcao } from "@/types/Opcao";

interface Props {
  control: Control<any>;
  fieldName: string;
  options: Opcao[];
  errorClassName?: string;
  error?: string;
}

export const CarregarCheckboxGroup: React.FC<Props> = ({
  control,
  fieldName,
  options,
  errorClassName,
  error,
}) => {
  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field }) => {
        const selectedValues: number[] = field.value || [];
        const isSingleColumn = options.length < 5;

        return (
          <div>
            <div
              className={
                isSingleColumn
                  ? "flex flex-col gap-2 mt-4"
                  : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-4"
              }
            >
              {options.map((option, _) => (
                <Label
                  htmlFor={`${fieldName}-${option.id}`}
                  key={`${option.nome}-${option.id}`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedValues.includes(option.id)}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...selectedValues, option.id]
                        : selectedValues.filter((v) => v !== option.id);
                      field.onChange(newValue);
                    }}
                    id={`${fieldName}-${option.id}`}
                  />
                  {option.nome}
                </Label>
              ))}
            </div>
            {error && (
              <p className={errorClassName ?? "text-sm text-red-500 mt-1"}>
                {error}
              </p>
            )}
          </div>
        );
      }}
    />
  );
};
