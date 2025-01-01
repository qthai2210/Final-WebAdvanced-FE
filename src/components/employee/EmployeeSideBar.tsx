import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useLocation } from "react-router-dom";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { setNavigationPath } from "@/store/auth/authSlice";
import {
  ChevronLeft,
  LayoutDashboard,
  Users,
  ScrollText,
  FileSpreadsheet,
  BellRing,
  LogOut,
  Menu,
  CircleDollarSign,
  AlertCircle,
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { useSidebar } from "@/contexts/SidebarContext";

const navigationItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/employee/dashboard",
  },
  {
    title: "Customer Management",
    icon: Users,
    href: "/employee/customers",
  },
  {
    title: "Create Customer",
    icon: Users,
    href: "/employee/create-customer",
  },
  {
    title: "Transactions",
    icon: CircleDollarSign,
    href: "/employee/transactions",
  },
  {
    title: "Deposit Money",
    icon: CircleDollarSign,
    href: "/employee/deposit-money",
  },
  {
    title: "Transaction History",
    icon: ScrollText,
    href: "/employee/transaction-history",
  },
  {
    title: "Reports",
    icon: FileSpreadsheet,
    href: "/employee/reports",
  },
  {
    title: "Approvals",
    icon: ScrollText,
    href: "/employee/approvals",
  },
  {
    title: "Notifications",
    icon: BellRing,
    href: "/employee/notifications",
  },
  {
    title: "Support Tickets",
    icon: AlertCircle,
    href: "/employee/support",
  },
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onLogout: () => void;
}

export function EmployeeSidebar({
  className,
  isCollapsed,
  setIsCollapsed,
  onLogout,
}: SidebarProps) {
  const dispatch = useDispatch<AppDispatch>();
  //const navigate = useNavigate();
  const location = useLocation();
  //const { isExpanded, setIsExpanded } = useSidebar();

  // Check if current path matches the navigation item
  const isActivePath = (path: string) => location.pathname === path;

  return (
    <div
      className={cn(
        "relative border-r border-border bg-background",
        "flex flex-col p-4 h-screen",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold">Employee Portal</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 -mx-4">
        <div className="space-y-1 px-2">
          {navigationItems.map((item) => (
            <Button
              key={item.href}
              onClick={() => dispatch(setNavigationPath(item.href))}
              variant="ghost"
              className={cn(
                "w-full flex items-center gap-3 rounded-lg px-3 py-2",
                "transition-all hover:text-foreground hover:bg-accent",
                isActivePath(item.href) && "bg-accent text-foreground",
                isCollapsed && "justify-center px-2"
              )}
            >
              <item.icon className={cn("h-5 w-5", isCollapsed && "h-5 w-5")} />
              {!isCollapsed && <span>{item.title}</span>}
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Logout Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onLogout}
        className={cn(
          "mt-4 w-full flex items-center gap-3 justify-start",
          "text-muted-foreground hover:text-foreground hover:bg-accent",
          isCollapsed && "justify-center px-2"
        )}
      >
        <LogOut className="h-5 w-5" />
        {!isCollapsed && <span>Logout</span>}
      </Button>
    </div>
  );
}