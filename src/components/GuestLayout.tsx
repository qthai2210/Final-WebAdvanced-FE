import { cn } from "@/lib/utils";
import { NavLink, Outlet } from "react-router-dom";

const GuestLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <NavLink to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">
                InterBanking
              </span>
            </NavLink>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  cn(
                    "px-4 py-2 rounded-md transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  )
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  cn(
                    "px-4 py-2 rounded-md transition-colors",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  )
                }
              >
                Register
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 InterBanking. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuestLayout;
