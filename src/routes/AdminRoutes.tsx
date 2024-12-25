import { RouteObject } from "react-router-dom";
import { AdminLayout } from "@/layouts/AdminLayout"; // Update this import path
import StaffManagement from "@/components/admin/StaffManagement";
import ProtectedRoute from "./ProtectedRoute";
import { EmployeeList } from "@/pages/admin/EmployeeList";

export const AdminRoutes: RouteObject[] = [
  {
    path: "/admin",

    children: [
      {
        element: (
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
            ),
          },
          {
            path: "employees",
            element: <EmployeeList />,
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
    ],
  },
];
