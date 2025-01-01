import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { EmployeeSidebar } from "./EmployeeSideBar";
import { useDispatch } from "react-redux";
import { logout } from "@/store/auth/authSlice";
import { AppDispatch } from "@/store/store";

const EmployeeLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      <EmployeeSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        onLogout={handleLogout}
        className={isCollapsed ? "w-[72px]" : "w-[240px]"}
      />
      <main className="flex-1 overflow-hidden bg-background/95">
        <div className="container mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default EmployeeLayout;
