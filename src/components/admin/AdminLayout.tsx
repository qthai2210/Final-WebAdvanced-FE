import { AdminSidebar } from "./AdminSidebar";
import { Outlet } from "react-router-dom";

export function AdminLayout() {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
