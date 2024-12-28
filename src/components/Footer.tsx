import { getUserAccounts } from "@/store/account/accountSlice";
import { setNavigationPath } from "@/store/auth/authSlice";
import { AppDispatch } from "@/store/store";
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Footer = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleNavigation = (path: string) => {
    dispatch(setNavigationPath(path));
    dispatch(getUserAccounts());
  };

  return (
    <footer className="bg-blue-900 text-white py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* About */}
          <div>
            <h2 className="text-xl font-bold mb-2">BankingApp</h2>
            <p className="text-sm text-gray-300">
              Your trusted partner in modern banking solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-blue-300"
                onClick={() => handleNavigation("/dashboard")}
              >
                Dashboard
              </Link>
              <Link
                to="/transactions"
                className="text-gray-300 hover:text-blue-300"
                onClick={() => handleNavigation("/transactions")}
              >
                Transactions
              </Link>
              <Link
                to="/payments"
                className="text-gray-300 hover:text-blue-300"
                onClick={() => handleNavigation("/payments")}
              >
                Payments
              </Link>
              <Link
                to="/cards"
                className="text-gray-300 hover:text-blue-300"
                onClick={() => handleNavigation("/cards")}
              >
                Cards
              </Link>
            </div>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Contact</h3>
            <div className="text-sm space-y-1">
              <p>1900-123-456</p>
              <a
                href="mailto:nqthai21@clc.fitus.edu.vn"
                className="text-gray-300 hover:text-blue-300"
              >
                nqthai21@clc.fitus.edu.vn
              </a>
              <div className="flex space-x-4 mt-2">
                {[FaFacebook, FaTwitter, FaLinkedin, FaEnvelope].map(
                  (Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="text-gray-300 hover:text-blue-300"
                    >
                      <Icon size={16} />
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-4 pt-4 text-center text-xs text-gray-300">
          © {new Date().getFullYear()} BankingApp. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
