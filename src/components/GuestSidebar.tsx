import { cn } from "@/lib/utils";
import {
  Home,
  LogIn,
  ShieldQuestion,
  Info,
  HelpCircle,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const GuestSidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const routes = [
    {
      title: "Welcome",
      icon: Home,
      href: "/",
    },
    {
      title: "Sign In",
      icon: LogIn,
      href: "/login",
    },
    {
      title: "Reset Password",
      icon: ShieldQuestion,
      href: "/forgot-password",
    },
    {
      title: "Help Center",
      icon: HelpCircle,
      href: "/help",
    },
    {
      title: "About Us",
      icon: Info,
      href: "/about",
    },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <div
      className={cn(
        "border-r bg-background top-0 z-30 h-full",
        isCollapsed ? "w-[72px]" : "w-[240px]",
        "flex flex-col p-3 pt-4 transition-all duration-300 ease-in-out"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate("/")}
          className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "px-2"
          )}
        >
          <div className="rounded-full w-8 h-8 bg-primary flex items-center justify-center text-white font-bold">
            IB
          </div>
          {!isCollapsed && (
            <span className="ml-2 text-xl font-semibold">InterBank</span>
          )}
        </button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-all",
              isCollapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      <ScrollArea className="flex-1 -mr-4 py-2">
        <nav className="grid gap-1 px-2">
          {routes.map((route) => (
            <button
              key={route.href}
              onClick={() => navigate(route.href)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground w-full",
                "transition-all hover:text-foreground hover:bg-accent",
                isActivePath(route.href) && "bg-accent text-foreground",
                isCollapsed && "justify-center px-2"
              )}
            >
              <route.icon className="h-4 w-4" />
              {!isCollapsed && <span>{route.title}</span>}
            </button>
          ))}
        </nav>
      </ScrollArea>

      <div className={cn("mt-4 border-t pt-4", isCollapsed && "items-center")}>
        <div
          className={cn(
            "px-3 text-xs text-muted-foreground",
            isCollapsed && "hidden"
          )}
        >
          <p>© 2024 InterBank</p>
          <p className="mt-1">All rights reserved</p>
        </div>
      </div>
    </div>
  );
};

export default GuestSidebar;
