import { RouteObject } from "react-router-dom";
import Layout from "../components/Layout";
import StaffManagement from "@/components/admin/StaffManagement";
import { EmployeeDashboard } from "@/pages/employee/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

export const EmployeeRoutes: RouteObject[] = [
  {
    path: "/employee",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <EmployeeDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "staff",
        element: <StaffManagement />,
      },
      {
        path: "users",
        // element: <UserManagement />
      },
      {
        path: "settings",
        // element: <AdminSettings />
      },
    ],
  },
];
