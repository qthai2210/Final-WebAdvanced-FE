import { ViewTransactionHistoryCard } from "@/components/employee/ViewTransactionHistoryCard";
import { Container } from "@/components/ui/container";

export function TransactionHistoryPage() {
  return (
    <Container className="py-6">
      <div className="grid gap-6">
        <h1 className="text-3xl font-bold">Transaction History</h1>
        <ViewTransactionHistoryCard />
      </div>
    </Container>
  );
}
