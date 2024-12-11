import * as React from "react";
import { useFormContext } from "react-hook-form";

interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  rules?: {
    required?: string | boolean;
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    pattern?: { value: RegExp; message: string };
  };
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  type = "text",
  rules,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        {...register(name, rules)}
        type={type}
        className={`w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 
          ${errors[name] ? "border-red-500" : "border-gray-300"}`}
      />
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default InputField;
