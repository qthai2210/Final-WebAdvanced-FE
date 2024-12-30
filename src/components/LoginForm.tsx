import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import InputField from "./InputField";
import { LoginDto } from "../types/LoginDto";
import { autoLogin, loginWithCaptcha } from "../store/auth/authSlice";
import type { AppDispatch, RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";

interface LoginFormData extends LoginDto {
  remember_me?: boolean;
}

const LoginForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const methods = useForm<LoginFormData>({
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
      remember_me: false,
    },
  });
  const navigate = useNavigate();
  const [recaptchaToken, setRecaptchaToken] = React.useState<string | null>(
    localStorage.getItem("recaptchaToken") || null
  );

  console.log("AuthProvider");
  React.useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch(autoLogin());
      navigate("/dashboard", { replace: true });
    }
  }, [dispatch, navigate]);

  const onRecaptchaChange = (recaptchaToken: string | null) => {
    setRecaptchaToken(recaptchaToken);
  };

  const onSubmit = async (data: LoginFormData) => {
    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA verification.");
      return;
    } else {
      localStorage.setItem("recaptchaToken", recaptchaToken);
    }

    try {
      await dispatch(
        // recaptchaToken !== null
        //   ? login({
        //       username: data.username,
        //       password: data.password,
        //     }) :
        loginWithCaptcha({
          username: data.username,
          password: data.password,
          recaptchaToken,
        })
      ).unwrap();
      // check if the user is authenticated and redirect to the dashboard

      navigate("/dashboard", { replace: true });

      // Handle successful login (e.g., redirect)
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-auto relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"></div>
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>

        {/* Form header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-600">Please sign in to continue</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Input fields with enhanced styling */}
        <div className="space-y-6">
          <InputField
            name="username"
            label="Username"
            type="text"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            rules={{
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
              maxLength: {
                value: 20,
                message: "Username must not exceed 20 characters",
              },
            }}
          />
          <InputField
            name="password"
            label="Password"
            type="password"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                message:
                  "Password must contain at least one letter and one number",
              },
            }}
          />
        </div>

        {/* Remember me and Forgot password */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center">
            <input
              id="remember_me"
              {...methods.register("remember_me")}
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition duration-150 ease-in-out"
            />
            <label
              htmlFor="remember_me"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <a
              href="/forgot-password"
              className="font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out"
            >
              Forgot password?
            </a>
          </div>
        </div>

        {/* ReCAPTCHA */}
        <div className="flex justify-center mt-6">
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={onRecaptchaChange}
            className="transform scale-90"
          />
        </div>

        {/* Submit button */}
        <div className="mt-6">
          <Button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:scale-[1.02]"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
