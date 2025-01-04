import { DepositMoneyCreateDto } from "@/types/transaction.types";
import { z } from "zod";
import { FormField } from "../ui/form-field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { CardContent } from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { Button } from "../ui/button";
import { depositMoney, getAccount } from "@/store/employee/employeeSlice";
import { FormFieldNumber } from "../ui/form-field-number";
import { useDebounce } from 'use-debounce';
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const depositMoneySchema = z.object({
  searchTerm: z
    .string()
    .min(1, "Please enter an account number or username"),

  amount: z
    .number()
    .positive("Amount must be a positive number"),
});

type FormData = {
  searchTerm: string;
  amount: number;
};

type AccountInfo = {
  nickname: string;
  accountNumber: string;
};

export function DepositMoneyIntoUserAccount() {
  const dispatch = useDispatch<AppDispatch>();
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(depositMoneySchema),
    defaultValues: {
      searchTerm: "",
      amount: 0,
    },
    mode: "onChange"
  });

  const searchTerm = form.watch("searchTerm");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (!debouncedSearchTerm) {
      setAccount(null);
      setError(null);
      return;
    }

    const isAccountNumber = /^\d{10,}$/.test(debouncedSearchTerm);
    const isUsername = !isAccountNumber && debouncedSearchTerm.length > 0;

    if (isAccountNumber || isUsername) {
      setIsLoading(true);
      setError(null);
      
      dispatch(getAccount(debouncedSearchTerm))
        .unwrap()
        .then((result) => {
          setAccount(result.data);
          setError(null);
        })
        .catch((error) => {
          setAccount(null);
          setError(error.message || "Failed to find account");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [debouncedSearchTerm, dispatch]);

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Data: " + data)
      const depositData: DepositMoneyCreateDto = {
        accountNumber: account?.accountNumber,
        username: account?.nickname,
        amount: data.amount
      };
      console.log("Deposit data: " + depositData.username + "\n" + depositData.accountNumber + "\n" + depositData.amount);
      const result = await dispatch(depositMoney(depositData)).unwrap();
      if (result) {
        form.reset();
        setAccount(null);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Deposit Money into User Account</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <FormField 
              label="Account Number or Username" 
              name="searchTerm" 
              form={form} 
            />
            {isLoading && (
              <div className="absolute right-3 top-9">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div className="font-semibold text-red-900">
                Account doesn't exist
              </div>
            </div>
          </div>
          )}

          {account && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-900">Account Found</h3>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="text-gray-600 font-medium">Username</div>
                <div className="text-gray-900">{account.nickname}</div>
                
                <div className="text-gray-600 font-medium">Account Number</div>
                <div className="text-gray-900">{account.accountNumber}</div>
              </div>
            </div>
          </div>
          )}

          <FormFieldNumber label="Amount" name="amount" form={form} />

          <Button 
            type="submit" 
            className="w-full"
            disabled={!form.formState.isValid || isLoading || !account}
          >
            Deposit Money
          </Button>
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
      </CardContent>
    </Card>
  );
}