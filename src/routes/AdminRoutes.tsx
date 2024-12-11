import { RouteObject } from "react-router-dom";
import Layout from "../components/Layout";
import StaffManagement from "@/components/admin/StaffManagement";
import ProtectedRoute from "./ProtectedRoute";

export const AdminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <>
              <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
            </>
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
