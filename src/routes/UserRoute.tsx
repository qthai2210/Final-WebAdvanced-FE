import { RouteObject } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import Layout from "../components/Layout";
import ProtectedRoute from "./ProtectedRoute";
import CreateDebtPage from "@/pages/CreateDebtPage";
import { DebtManagementPage } from "@/pages/DebtManagementPage";
import { RecipientsListPage } from "@/pages/RecipientsListPage";

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
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/recipients",
        element: (
          <ProtectedRoute>
            <RecipientsListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "transactions",
        // element: (
        //   <ProtectedRoute>
        //     <TransactionsPage />
        //   </ProtectedRoute>
        // ),
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
