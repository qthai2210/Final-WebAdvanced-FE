import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { fetchTransactionHistory } from "@/store/employee/employeeSlice";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { CardContent } from "@mui/material";
import { TransactionHistoryItem } from "./TransactionHistoryItem";
import { FormField } from "../ui/form-field";
import { Label } from "@radix-ui/react-label";
import { TransactionHistoryQueryDto, TransactionType, TransactionItem } from "@/types/transaction.types";

const transactionHistorySchema = z.object({
  accountNumber: z
    .string()
    .min(10, "Account number must be at least 10 digits")
    .max(15, "Account number cannot exceed 15 digits")
    .regex(/^\d+$/, "Please enter a valid account number (digits only)"),
  type: z.nativeEnum(TransactionType).optional(),
});

export function ViewTransactionHistoryCard() {
  const dispatch = useDispatch<AppDispatch>();
  const [transactionHistories, setTransactionHistories] = useState<TransactionItem[]>([]);
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [currentPage, setCurrentPage] = useState(1); // Current page

  const form = useForm<TransactionHistoryQueryDto>({
    resolver: zodResolver(transactionHistorySchema),
    defaultValues: {
      accountNumber: "",
      type: TransactionType.ALL,
    },
  });

  const fetchPageData = async (page: number) => {
    try {
      const data = {
        ...form.getValues(),
        page,
        limit: 4, // Fixed limit per page
      };
      const result = await dispatch(fetchTransactionHistory(data)).unwrap();
      setTransactionHistories(result.transaction);
      setTotalPages(result.totalPages || 1); // Assuming `totalPages` is returned by your API
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    }
  };

  const onSubmit = async (data: TransactionHistoryQueryDto) => {
    setCurrentPage(1); // Reset to the first page on new search
    fetchPageData(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchPageData(page);
  };

  return (
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

        {transactionHistories.length > 0 && (
          <>
            <div className="mt-4">
              <h3 className="text-lg font-bold my-6">Transaction History:</h3>
              <ul className="space-y-2">
                {transactionHistories.map((item) => (
                  <li key={item._id}>
                    <TransactionHistoryItem {...item} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4 space-x-2">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {[...Array(totalPages).keys()].map((_, index) => (
                <Button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  disabled={currentPage === index + 1}
                  variant={currentPage === index + 1 ? "default" : "outline"}
                >
                  {index + 1}
                </Button>
              ))}
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
