import { Input } from "./input";
import { Label } from "./label";
import { UseFormReturn } from "react-hook-form";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  form: UseFormReturn<any>;
  className?: string;
}

export function FormField({
  label,
  name,
  type = "text",
  form,
  className,
}: FormFieldProps) {
  return (
    <div className={`grid gap-2 ${className}`}>
      <Label htmlFor={name}>{label}</Label>
      <Input type={type} {...form.register(name)} />
      {form.formState.errors[name] && (
        <p className="text-red-500">
          {form.formState.errors[name]?.message as string}
        </p>
      )}
    </div>
  );
}
