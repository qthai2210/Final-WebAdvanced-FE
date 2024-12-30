import { UserCreationForm } from "@/components/employee/UserCreationForm";
import { Container } from "@/components/ui/container";

export function CreateCustomerPage() {
  return (
    <Container className="py-6">
      <div className="grid gap-6">
        <h1 className="text-3xl font-bold">Create New Customer</h1>
        <UserCreationForm />
      </div>
    </Container>
  );
}
