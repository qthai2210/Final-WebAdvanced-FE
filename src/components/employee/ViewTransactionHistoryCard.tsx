import { TransactionHistoryQueryDto, TransactionType, TransactionItem } from "@/types/transaction.types";
import { z } from "zod";
import { FormField } from "../ui/form-field";
import { useForm } from "react-hook-form";
import { Label } from "@radix-ui/react-label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { CardContent } from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { Button } from "../ui/button";
import { fetchTransactionHistory } from "@/store/employee/employeeSlice";
import { useState } from "react";
import { TransactionHistoryItem } from "./TransactionHistoryItem";

const transactionHistorySchema = z.object({
  accountNumber: z
    .string()
    .min(10, "Account number must be at least 10 digits")
    .max(15, "Account number cannot exceed 15 digits")
    .regex(/^\d+$/, "Please enter a valid account number (digits only)"),

  type: z
    .nativeEnum(TransactionType)
    .transform((val) => val.toLowerCase()) // Transform to lowercase before sending
    .optional()
    .default(TransactionType.ALL),
})

export function ViewTransactionHistoryCard() {
  const dispatch = useDispatch<AppDispatch>();

  const [transactionHistories, setTransactionHistories] = useState<TransactionItem[]>([]);


  const form = useForm<TransactionHistoryQueryDto>({
    resolver: zodResolver(transactionHistorySchema),
    defaultValues: {
      accountNumber: "",
      page: 1,
      limit: 10,
      type: TransactionType.ALL.toLowerCase() as TransactionType, // Set lowercase default value
    },
  });

  const onSubmit = async (data: TransactionHistoryQueryDto) => {
    try {
      data.limit = 10;
      data.page = 1;
      const result = await dispatch(fetchTransactionHistory(data)).unwrap();
      setTransactionHistories(result.transaction);
      console.log("Submission result:", transactionHistories);
      if (transactionHistories) {
        form.reset();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  }

  return (<>
    <Card>
      <CardHeader>
        <CardTitle>View User's Transaction History</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField label="Account Number" name="accountNumber" form={form} />

          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <select {...form.register("type")} className="form-select">
              {Object.values(TransactionType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            <Button type="submit" className="w-full" disabled={!form.formState.isValid}>
              View Transaction History
            </Button>
          </div>
        </form>

        {/* Debug information */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 text-sm text-gray-500">
            <p>Form Valid: {form.formState.isValid ? "Yes" : "No"}</p>
            <p>
              Dirty Fields:{" "}
              {Object.keys(form.formState.dirtyFields).join(", ")}
            </p>
            <p>Errors: {Object.keys(form.formState.errors).join(", ")}</p>
          </div>
        )}

        {transactionHistories.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-bold">Transaction History:</h3>
            <ul className="space-y-2">
              {transactionHistories.map((item) => (
                <li key={item._id}>
                  <TransactionHistoryItem {...item} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  </>)
}