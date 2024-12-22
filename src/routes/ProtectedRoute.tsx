import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { toast } from "react-toastify";
import { autoLogin } from "../store/auth/authSlice";
import { CircularProgress } from "@mui/material";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export default function ProtectedRoute({
  children,
  roles,
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading, navigationPath, role } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          try {
            await dispatch(autoLogin()).unwrap();
          } catch (error) {
            console.log(error);
            toast.error("Please login to access this page");
            navigate("/login", { replace: true });
          }
        } else {
          navigate("/login", { replace: true });
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, dispatch, navigate]);

  useEffect(() => {
    if (navigationPath) {
      navigate(navigationPath, { replace: true });
    }
  }, [navigationPath, navigate]);

  useEffect(() => {
    if (isAuthenticated && roles && role) {
      if (!roles.includes(role)) {
        // use timeout to avoid the error message from react-toastify
        setTimeout(() => {
          toast.error("You are not authorized to access this page");
        }, 2000);
        //toast.error("You are not authorized to access this page");
        console.log("You are not authorized to access this page");
        navigate("/unauthorized", { replace: true });
      }
    }
  }, [isAuthenticated, roles, role, navigate]);

  if (loading) {
    return (
      <div>
        <CircularProgress /> Loading...
      </div>
    ); // Or your loading component
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
