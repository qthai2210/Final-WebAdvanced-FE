import * as React from "react";
import { Link } from "react-router-dom";
import { Bell, User, Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { logout, setNavigationPath } from "../store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  fetchNotifications,
  fetchUnreadCount,
} from "@/store/notifications/notificationSlice";
import { getUserAccounts } from "@/store/account/accountSlice";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);
  const notificationsRef = React.useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, username } = useSelector(
    (state: RootState) => state.auth
  );
  const { notifications, unreadCount } = useSelector(
    (state: RootState) => state.notifications
  );
  const { account } = useSelector((state: RootState) => state.account);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications());
      dispatch(fetchUnreadCount());
    }
  }, [isAuthenticated, dispatch]);

  const handleLogout = async () => {
    await dispatch(logout());
    dispatch(getUserAccounts());
    navigate("/login");
  };

  const handleNavigation = (path: string) => {
    dispatch(setNavigationPath(path));
    dispatch(getUserAccounts());
  };

  const handleMarkAsRead = (notificationId: string) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  // Add helper function to generate unique keys
  const generateUniqueKey = (notification: any) => {
    return `${notification._id}-${notification.createdAt}-${notification.type}`;
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-blue-600 text-xl font-bold">BankApp</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-blue-600"
              onClick={() => handleNavigation("/dashboard")}
            >
              Dashboard
            </Link>
            <Link
              to="/transactions"
              className="text-gray-700 hover:text-blue-600"
              onClick={() => handleNavigation("/transactions")}
            >
              Transactions
            </Link>
            <Link
              to="/payments"
              className="text-gray-700 hover:text-blue-600"
              onClick={() => handleNavigation("/payments")}
            >
              Payments
            </Link>
            <Link
              to="/debts"
              className="text-gray-700 hover:text-blue-600"
              onClick={() => handleNavigation("/debts")}
            >
              Debt Management
            </Link>
            <Link
              to="/cards"
              className="text-gray-700 hover:text-blue-600"
              onClick={() => handleNavigation("/cards")}
            >
              Cards
            </Link>
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Quick Balance */}
            <div className="text-sm">
              <span className="text-gray-500">Balance:</span>
              <span className="ml-2 font-semibold">
                $
                {account?.balance
                  ? new Intl.NumberFormat().format(account.balance)
                  : 0}
              </span>
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="text-gray-500 hover:text-blue-600 relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="flex justify-between items-center px-4 py-2 border-b">
                    <h3 className="text-sm font-medium">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <div
                          key={generateUniqueKey(notification) || index}
                          onClick={() => handleMarkAsRead(notification._id)}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                            !notification.isRead ? "bg-blue-50" : ""
                          }`}
                        >
                          <p className="text-sm text-gray-900">
                            {notification.content}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(
                              notification.createdAt || ""
                            ).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No notifications
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center text-gray-700 hover:text-blue-600"
              >
                <User size={20} />
                <span className="ml-2">{username || "Profile"}</span>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    Welcome, {username}
                  </div>
                  {isAuthenticated ? (
                    <div>
                      <div className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Link
                          to="/change-password"
                          onClick={() => handleNavigation("/change-password")}
                        >
                          Change password
                        </Link>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Link to="/login">Login</Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-blue-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          isMenuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/dashboard"
            className="block px-3 py-2 text-gray-700 hover:text-blue-600"
            onClick={() => handleNavigation("/dashboard")}
          >
            Dashboard
          </Link>
          <Link
            to="/transactions"
            className="block px-3 py-2 text-gray-700 hover:text-blue-600"
            onClick={() => handleNavigation("/transactions")}
          >
            Transactions
          </Link>
          <Link
            to="/payments"
            className="block px-3 py-2 text-gray-700 hover:text-blue-600"
            onClick={() => handleNavigation("/payments")}
          >
            Payments
          </Link>
          <Link
            to="/debts"
            className="block px-3 py-2 text-gray-700 hover:text-blue-600"
            onClick={() => handleNavigation("/debts")}
          >
            Debt Management
          </Link>
          <Link
            to="/cards"
            className="block px-3 py-2 text-gray-700 hover:text-blue-600"
            onClick={() => handleNavigation("/cards")}
          >
            Cards
          </Link>
          <hr className="bg-gray-700" />
          {isAuthenticated ? (
            <div>
              <div className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Link
                  to="/change-password"
                  onClick={() => handleNavigation("/change-password")}
                >
                  Change password
                </Link>
              </div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <Link to="/login">Login</Link>
            </div>
          )}
          <div className="px-3 py-2">
            <div className="text-sm">
              <span className="text-gray-500">Balance:</span>
              <span className="ml-2 font-semibold">
                $
                {account?.balance
                  ? new Intl.NumberFormat().format(account.balance)
                  : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
