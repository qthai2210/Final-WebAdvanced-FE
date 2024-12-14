import { FormField } from "@/components/ui/form-field";
import { UseFormReturn } from "react-hook-form";
import { UserRole } from "@/types/user.types";
import { Label } from "../ui/label";

interface UserFormContentProps {
  form: UseFormReturn<any>;
  type: "basic" | "additional";
}

export function UserFormContent({ form, type }: UserFormContentProps) {
  if (type === "basic") {
    return (
      <div className="grid gap-4">
        <FormField label="Username" name="username" form={form} />
        <FormField label="Email" name="email" type="email" form={form} />
        <FormField label="Phone Number" name="phone" form={form} />
        <FormField label="Full Name" name="fullName" form={form} />
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <FormField label="Identity Number" name="identityNumber" form={form} />
      <FormField
        label="Date of Birth"
        name="dateOfBirth"
        type="date"
        form={form}
      />
      <FormField label="Address" name="address" form={form} />
      <div className="grid gap-2">
        <Label htmlFor="role">Role</Label>
        <select {...form.register("role")} className="form-select">
          {Object.values(UserRole).map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
