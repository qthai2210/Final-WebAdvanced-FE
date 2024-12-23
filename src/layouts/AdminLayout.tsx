import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { useSidebar } from "@/contexts/SidebarContext";

const AdminContent = () => {
  const { isExpanded } = useSidebar();

  return (
    <main
      className={`flex-1 transition-all duration-300 ease-in-out p-8 bg-gray-100 ${
        isExpanded ? "ml-64" : "ml-20"
      }`}
    >
      <Outlet />
    </main>
  );
};

export function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <AdminContent />
      </div>
    </SidebarProvider>
  );
}
