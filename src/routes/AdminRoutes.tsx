import { RouteObject } from "react-router-dom";

import { AdminLayout } from "@/components/admin/AdminLayout";
import StaffManagement from "@/components/admin/StaffManagement";
import ProtectedRoute from "./ProtectedRoute";

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
    ],
  },
];
