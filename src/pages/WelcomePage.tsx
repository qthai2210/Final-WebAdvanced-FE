import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  Wallet,
  Clock,
  CreditCard,
  Phone,
  Users,
} from "lucide-react";

const WelcomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Shield className="w-12 h-12 text-blue-600" />,
      title: "Secure Banking",
      description:
        "Advanced encryption and security measures to protect your financial data",
    },
    {
      icon: <Wallet className="w-12 h-12 text-blue-600" />,
      title: "Smart Transfers",
      description: "Easy money transfers between accounts and to other banks",
    },
    {
      icon: <Clock className="w-12 h-12 text-blue-600" />,
      title: "24/7 Access",
      description:
        "Access your accounts anytime, anywhere with our online banking",
    },
    {
      icon: <CreditCard className="w-12 h-12 text-blue-600" />,
      title: "Card Management",
      description: "Control your cards and manage limits with ease",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-blue-900 mb-6">
              Welcome to InterBanking
            </h1>
            <p className="text-xl text-blue-700 mb-12">
              Your secure solution for seamless banking transactions and
              financial management
            </p>

            <div className="grid gap-8 md:grid-cols-2 max-w-2xl mx-auto">
              <div className="p-8 bg-white rounded-xl shadow-lg transform transition hover:scale-105">
                <h3 className="text-2xl font-semibold text-blue-800 mb-4">
                  Personal Banking
                </h3>
                <p className="text-gray-600 mb-6">
                  Access your accounts, transfer money, and manage your finances
                  with our intuitive platform
                </p>
                <Button
                  onClick={() => navigate("/login")}
                  className="w-full bg-blue-600 hover:bg-blue-700 group"
                >
                  Login to Your Account
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                </Button>
              </div>

              <div className="p-8 bg-white rounded-xl shadow-lg transform transition hover:scale-105">
                <h3 className="text-2xl font-semibold text-blue-800 mb-4">
                  Need Help?
                </h3>
                <p className="text-gray-600 mb-6">
                  Forgot your password or having trouble logging in? We're here
                  to assist you
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate("/forgot-password")}
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 group"
                  >
                    Reset Password
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                  </Button>
                  <Button
                    onClick={() => navigate("/contact")}
                    variant="ghost"
                    className="w-full text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
            Why Choose InterBanking?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 text-center rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-blue-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-blue-900 mb-8">
              Need Assistance?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
                <Phone className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-blue-800 mb-2">
                  24/7 Support
                </h3>
                <p className="text-gray-600">
                  Call us anytime at{" "}
                  <span className="font-semibold">1-800-BANKING</span>
                </p>
              </div>
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
                <Users className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-blue-800 mb-2">
                  Visit a Branch
                </h3>
                <p className="text-gray-600">
                  Find your nearest branch and meet our team
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WelcomePage;
