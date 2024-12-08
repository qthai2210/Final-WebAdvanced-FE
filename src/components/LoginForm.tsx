import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import InputField from "./InputField";
import { LoginDto } from "../types/LoginDto";
import { login } from "../store/auth/authSlice";
import type { AppDispatch, RootState } from "../store/store";

interface LoginFormData extends LoginDto {
  remember_me?: boolean;
}

const LoginForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const methods = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(
        login({
          username: data.username,
          password: data.password,
        })
      ).unwrap();
      // Handle successful login (e.g., redirect)
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <InputField name="username" label="Username" type="text" />
        <InputField name="password" label="Password" type="password" />
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember_me"
              {...methods.register("remember_me")}
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="remember_me"
              className="block ml-2 text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Forgot your password?
            </a>
          </div>
        </div>
        <div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
