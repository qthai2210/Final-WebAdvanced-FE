import { RouteObject } from "react-router-dom";
import EmployeeLayout from "@/components/employee/EmployeeLayout";
import ProtectedRoute from "./ProtectedRoute";
import { EmployeeDashboard } from "@/pages/employee/Dashboard";
import { CreateCustomerPage } from "@/pages/employee/CreateCustomer";
import { TransactionHistoryPage } from "@/pages/employee/TransactionHistory";

export const EmployeeRoutes: RouteObject[] = [
  {
    path: "/employee",
    element: (
      <ProtectedRoute>
        <EmployeeLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <EmployeeDashboard></EmployeeDashboard>, // Replace with actual components
      },
      {
        path: "create-customer",
        element: <CreateCustomerPage></CreateCustomerPage>,
      },
      {
        path: "transaction-history",
        element: <TransactionHistoryPage></TransactionHistoryPage>,
      },
      {
        path: "reports",
        element: <div>Reports</div>,
      },
      {
        path: "transaction/history",
        // element: (
        //   <ProtectedRoute>

        //   </ProtectedRoute>
        // )
      },
    ],
  },
];
