import * as React from "react";
import LoginForm from "../components/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
