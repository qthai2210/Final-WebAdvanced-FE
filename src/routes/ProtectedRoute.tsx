import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { toast } from "react-toastify";
import { autoLogin } from "../store/auth/authSlice";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading, navigationPath } = useSelector(
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
        }
        // else {
        //   toast.error("Please login to access this page");
        //   navigate("/login", { replace: true });
        // }
      }
    };

    checkAuth();
  }, [isAuthenticated, dispatch, navigate]);

  useEffect(() => {
    if (navigationPath) {
      navigate(navigationPath, { replace: true });
    }
  }, [navigationPath, navigate]);

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
