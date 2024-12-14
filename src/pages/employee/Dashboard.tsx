import { UserCreationForm } from "@/components/employee/UserCreationForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

export function EmployeeDashboard() {
  return (
    <Container className="py-6">
      <div className="grid gap-6">
        <h1 className="text-3xl font-bold">Employee Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>{/* Add stats here */}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>{/* Add activity list here */}</CardContent>
          </Card>
        </div>

        <UserCreationForm />
      </div>
    </Container>
  );
}
