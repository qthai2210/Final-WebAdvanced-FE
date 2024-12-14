import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserFormContent } from "./user-form-content";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  createUserAccount,
  verifyUserOtp,
} from "@/store/employee/employeeSlice";
import { toast } from "react-toastify";
import * as z from "zod";
import { RegisterWithoutPasswordDto, UserRole } from "@/types/user.types";
import { OtpVerificationDialog } from "./OtpVerificationDialog";
import { useState } from "react";

const userFormSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens"
    ),

  email: z
    .string()
    .email("Please enter a valid email address")
    .min(5, "Email is too short")
    .max(100, "Email cannot exceed 100 characters"),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .regex(/^[0-9+()-\s]+$/, "Please enter a valid phone number"),

  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Full name can only contain letters, spaces, hyphens and apostrophes"
    ),

  identityNumber: z
    .string()
    .min(9, "Identity number must be at least 9 characters")
    .max(12, "Identity number cannot exceed 12 characters")
    .regex(/^[0-9]+$/, "Identity number must contain only numbers")
    .optional(),

  dateOfBirth: z
    .string()
    .refine((date) => {
      if (!date) return true;
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18;
    }, "Must be at least 18 years old")
    .optional(),

  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address cannot exceed 200 characters")
    .optional(),

  role: z
    .nativeEnum(UserRole)
    .transform((val) => val.toLowerCase()) // Transform to lowercase before sending
    .optional()
    .default(UserRole.CUSTOMER),
});

export function UserCreationForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { userCreationLoading } = useSelector(
    (state: RootState) => state.employee
  );
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const form = useForm<RegisterWithoutPasswordDto>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      role: UserRole.CUSTOMER.toLowerCase() as UserRole, // Set lowercase default value
    },
  });

  const onSubmit = async (data: RegisterWithoutPasswordDto) => {
    try {
      console.log("Form data being submitted:", data);
      const result = await dispatch(createUserAccount(data)).unwrap();
      console.log("Submission result:", result);
      if (result) {
        setRegisteredEmail(data.email);
        setShowOtpDialog(true);
        form.reset();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleVerifyOtp = async (email: string, otp: string) => {
    try {
      await dispatch(verifyUserOtp({ email, otp })).unwrap();
      setShowOtpDialog(false); // Close dialog on success
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Create New User Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="additional">
                Additional Information
              </TabsTrigger>
            </TabsList>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <TabsContent value="basic">
                <UserFormContent form={form} type="basic" />
              </TabsContent>

              <TabsContent value="additional">
                <UserFormContent form={form} type="additional" />
              </TabsContent>

              <div className="mt-6">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!form.formState.isValid || userCreationLoading}
                >
                  {userCreationLoading
                    ? "Creating Account..."
                    : "Create Account"}
                </Button>
              </div>

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
            </form>
          </Tabs>
        </CardContent>
      </Card>

      <OtpVerificationDialog
        isOpen={showOtpDialog}
        onClose={() => setShowOtpDialog(false)}
        email={registeredEmail}
        onVerify={handleVerifyOtp}
      />
    </>
  );
}
