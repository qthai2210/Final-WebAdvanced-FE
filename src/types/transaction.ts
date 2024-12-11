export type Transaction = {
  id: number;
  description: string;
  amount: string;
  date: string;
  type: "credit" | "debit";
};

export const mockTransactions: readonly Transaction[] = [
  {
    id: 1,
    description: "Deposit from Bank Transfer",
    amount: "1,250.00",
    date: "Today, 2:45 PM",
    type: "credit",
  },
  // add more mock data
  {
    id: 2,
    description: "Payment for groceries",
    amount: "250.00",
    date: "Today, 1:45 PM",
    type: "debit",
  },

  // ...existing mock data...
] as const;
