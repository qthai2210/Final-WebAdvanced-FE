import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { UserPlus, Users, Home, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { setNavigationPath } from "@/store/auth/authSlice";
import { useState } from "react";

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
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "min-h-screen bg-gray-900 text-white p-4 space-y-4 fixed left-0 top-0 transition-all duration-300",
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
              "w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-gray-800 overflow-hidden",
              location.pathname === item.path && "bg-gray-800 text-white",
              !isExpanded && "justify-center"
            )}
            onClick={() => dispatch(setNavigationPath(item.path))}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {isExpanded && (
              <span className="transition-opacity">{item.title}</span>
            )}
          </Button>
        ))}
      </nav>
    </div>
  );
}
