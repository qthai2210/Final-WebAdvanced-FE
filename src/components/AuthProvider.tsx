import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { autoLogin } from "../store/auth/authSlice";
import { AppDispatch } from "@/store/store";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch<AppDispatch>();
  console.log("AuthProvider");
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch(autoLogin());
    }
  }, [dispatch]);

  return <>{children}</>;
};
