import { useEffect } from "react";
import { useSelector } from "react-redux";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout: React.FC = () => {
  const { username, isAuthenticated, navigationPath } = useSelector(
    (state: any) => state.auth
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (navigationPath) {
      console.log("Navigating to: ", navigationPath);
      navigate(navigationPath, { replace: true });
    }
  }, [navigationPath, navigate]);
  useEffect(() => {
    if (isAuthenticated && username) {
      const socket = connectSocket(username);

      return () => {
        disconnectSocket();
      };
    }
  }, [isAuthenticated, username]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto w-full py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
