import { getUserAccounts } from "@/store/account/accountSlice";
import { setNavigationPath } from "@/store/auth/authSlice";
import { AppDispatch } from "@/store/store";
import { FaFacebook, FaTwitter } from "react-icons/fa";
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
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        {/* Logo and About Section */}
        <div>
          <h2 className="text-xl font-bold">BankingApp</h2>
          <p className="mt-2 text-sm">
            BankingApp is a reliable financial solution, providing modern, safe,
            and convenient banking services.
          </p>
        </div>

        {/* Services Section */}
        <div>
          <h3 className="text-lg font-semibold">Services</h3>
          <ul className="mt-2 space-y-2">
            <li>
              <Link
                to="/dashboard"
                className="hover:text-blue-600"
                onClick={() => handleNavigation("/dashboard")}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/transactions"
                className="hover:text-blue-600"
                onClick={() => handleNavigation("/transactions")}
              >
                Transactions
              </Link>
            </li>
            <li>
              <Link
                to="/payments"
                className="hover:text-blue-600"
                onClick={() => handleNavigation("/payments")}
              >
                Payments
              </Link>
            </li>
            <li>
              <Link
                to="/debts"
                className="hover:text-blue-600"
                onClick={() => handleNavigation("/debts")}
              >
                Debt Management
              </Link>
            </li>
            <li>
              <Link
                to="/cards"
                className="hover:text-blue-600"
                onClick={() => handleNavigation("/cards")}
              >
                Cards
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-semibold">Contact us</h3>
          <p className="mt-2 text-sm">Hotline: 1900-123-456</p>
          <p className="text-sm">
            Email:{" "}
            <a
              href="mailto:nqthai21@clc.fitus.edu.vn"
              className="hover:text-blue-500"
            >
              nqthai21@clc.fitus.edu.vn
            </a>
          </p>
          <div className="mt-2 flex justify-center md:justify-start space-x-4">
            <a
              href="https://facebook.com"
              className="hover:text-blue-500"
              aria-label="Facebook"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://twitter.com"
              className="hover:text-blue-500"
              aria-label="Twitter"
            >
              <FaTwitter size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm">
        © 2024 BankingApp. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
