import { RouteObject } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import Layout from "../components/Layout";
import ProtectedRoute from "./ProtectedRoute";
import CreateDebtPage from "@/pages/CreateDebtPage";
import { DebtManagementPage } from "@/pages/DebtManagementPage";
import RecipientListPage from "@/pages/RecipientListPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import ChangePasswordPage from "@/pages/ChangePasswordPage";
import InternalTransferPage from "@/pages/InternalTransferPage";
import ExternalTransferPage from "@/pages/ExternalTransferPage";
import TransactionHistoryPage from "@/pages/TransactionHistoryPage";

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
        path: "change-password",
        element: <ChangePasswordPage />,
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
            <InternalTransferPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "transactions/external",
        element: (
          <ProtectedRoute>
            <ExternalTransferPage />
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
        path: "history",
        element: (
          <ProtectedRoute>
            <TransactionHistoryPage />
          </ProtectedRoute>
        ),
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
