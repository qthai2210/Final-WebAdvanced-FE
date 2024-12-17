import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Outlet } from "react-router-dom";

export function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
