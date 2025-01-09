import { RouteObject } from "react-router-dom";
import { AdminLayout } from "@/layouts/AdminLayout"; // Update this import path

import ProtectedRoute from "./ProtectedRoute";
import { EmployeeList } from "@/pages/admin/EmployeeList";
import { Reconciliation } from "@/pages/admin/Reconciliation";

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
            element: <Reconciliation />,
          },
          {
            path: "employees",
            element: <EmployeeList />,
          },
          {
            // path: "dashboard",
            // element: <Reconciliation />,
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
