import ChangePasswordPage from "@/pages/ChangePasswordPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import LoginPage from "@/pages/LoginPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import WelcomePage from "@/pages/WelcomePage";
import GuestLayout from "@/components/GuestLayout"; // Fixed import
import { RouteObject } from "react-router-dom";

export const GuestRoutes: RouteObject[] = [
  {
    path: "/",
    element: <GuestLayout />, // Using the correct GuestLayout component
    children: [
      {
        index: true,
        element: <WelcomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },

      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "reset-password",
        element: <ResetPasswordPage />,
      },
      {
        path: "change-password",
        element: <ChangePasswordPage />,
      },
    ],
  },
];
