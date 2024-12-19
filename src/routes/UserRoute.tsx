import { RouteObject } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import Layout from "../components/Layout";
import ProtectedRoute from "./ProtectedRoute";
import CreateDebtPage from "@/pages/CreateDebtPage";
import { DebtManagementPage } from "@/pages/DebtManagementPage";
import TransferPage from "@/pages/TransferPage";
import RecipientListPage from "@/pages/RecipientListPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";

export const UserRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
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
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "transactions/internal",
        element: (
          <ProtectedRoute>
            <TransferPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "transactions",
        element: (
          <ProtectedRoute>
            <RecipientListPage />
          </ProtectedRoute>
        ),
        // children: [
        //   {
        //     path: "internal",
        //     element: (
        //       <ProtectedRoute>
        //         <TransferPage />
        //       </ProtectedRoute>
        //     ),
        //   },
        // ],
      },
      {
        path: "payments",
        // element: (
        //   <ProtectedRoute>
        //     <PaymentsPage />
        //   </ProtectedRoute>
        // ),
      },
      {
        path: "cards",
        // element: (
        //   <ProtectedRoute>
        //     <CardsPage />
        //   </ProtectedRoute>
        // ),
      },
      {
        path: "/debts",
        element: (
          <ProtectedRoute>
            <DebtManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/debts/create",
        element: (
          <ProtectedRoute>
            <CreateDebtPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
