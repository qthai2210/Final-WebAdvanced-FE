import { RouteObject } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import Layout from "../components/Layout";
import ProtectedRoute from "./ProtectedRoute";

export const routes: RouteObject[] = [
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
    ],
  },
];
