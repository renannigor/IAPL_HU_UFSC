import { Control, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

interface Props {
  control: Control<any>;
  fieldName: string;
  options: string[];
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
        const selectedValues: string[] = field.value || [];
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
              {options.map((option, i) => (
                <label
                  key={`${option}-${i}`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedValues.includes(option)}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...selectedValues, option]
                        : selectedValues.filter((v) => v !== option);
                      field.onChange(newValue);
                    }}
                    id={`${fieldName}-${option}`}
                  />
                  <span>{option}</span>
                </label>
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
