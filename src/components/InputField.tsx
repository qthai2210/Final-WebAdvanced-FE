import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";

interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  rules?: object;
  className?: string;
}

const InputField = ({
  name,
  label,
  type = "text",
  rules,
  className,
}: InputFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type}
        {...register(name, rules)}
        className={className}
      />
      {errors[name] && (
        <p className="text-sm text-red-500">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default InputField;
