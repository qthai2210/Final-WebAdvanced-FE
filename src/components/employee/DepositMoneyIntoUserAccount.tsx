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
import { depositMoney } from "@/store/employee/employeeSlice";
import { FormFieldNumber } from "../ui/form-field-number";

const depositMoneySchema = z.object({
  accountNumber: z
    .string()
    .min(10, "Account number must be at least 10 digits")
    .max(15, "Account number cannot exceed 15 digits")
    .regex(/^\d+$/, "Please enter a valid account number (digits only)")
    .optional(),

  username: z
    .string()
    .optional(),

  amount: z
  .number()
  .positive("Amount must be a positive number"),
})

export function DepositMoneyIntoUserAccount() {
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<DepositMoneyCreateDto>({
    resolver: zodResolver(depositMoneySchema),
    // defaultValues: {
    //   accountNumber: "",
    //   username: "",
    //   amount: 1,
    // },
    mode: "onChange"
  });

  const onSubmit = async (data: DepositMoneyCreateDto) => {
    try {
      const result = await dispatch(depositMoney(data)).unwrap();
      console.log("Submission result:", result);
      if (result) {
        form.reset();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  }

  return (<>
    <Card>
      <CardHeader>
        <CardTitle>Deposit Money into User Account</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField label="Account Number" name="accountNumber" form={form} />

          <FormField label="Full Name" name="username" form={form} />

          <FormFieldNumber label="Amount" name="amount" form={form} />

          <div className="mt-6 mb-6">
            <Button type="submit" className="w-full" disabled={!form.formState.isValid}>
              Deposit Money
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
      </CardContent>
    </Card>
  </>)
}