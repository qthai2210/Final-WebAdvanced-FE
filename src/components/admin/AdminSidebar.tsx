import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { UserPlus, Users, Home, Settings, LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { logout, setNavigationPath } from "@/store/auth/authSlice";
import { useSidebar } from "@/contexts/SidebarContext";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/admin",
  },
  {
    title: "Employee Management",
    icon: Users,
    path: "/admin/employees",
  },
  {
    title: "Add Employee",
    icon: UserPlus,
    path: "/admin/employees/new",
  },
  {
    title: "User Management",
    icon: Users,
    path: "/admin/users",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/admin/settings",
  },
  {
    title: "Logout",
    icon: LogOut,
    path: "/login",
  },
];

export function AdminSidebar() {
  //const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { isExpanded, setIsExpanded } = useSidebar();

  return (
    <div
      className={cn(
        "min-h-screen bg-gray-900 text-white p-4 space-y-4 fixed left-0 top-0 transition-all duration-300 ease-in-out",
        isExpanded ? "w-64" : "w-20"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div
        className={cn(
          "text-xl font-bold pb-4 border-b border-gray-700 overflow-hidden whitespace-nowrap",
          !isExpanded && "text-center"
        )}
      >
        {isExpanded ? "Admin Panel" : "AP"}
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-gray-800",
              location.pathname === item.path && "bg-gray-800 text-white",
              !isExpanded && "justify-center p-2"
            )}
            onClick={() =>
              item.path === "/login"
                ? dispatch(logout())
                : dispatch(setNavigationPath(item.path))
            }
          >
            <item.icon className="h-5 w-5" />
            {isExpanded && (
              <span className="overflow-hidden whitespace-nowrap">
                {item.title}
              </span>
            )}
          </Button>
        ))}
      </nav>
    </div>
  );
}
