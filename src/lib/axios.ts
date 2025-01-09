import axios from "axios";
import { store } from "../store/store";
import { logout, refreshToken } from "../store/auth/authSlice";

const baseURL = import.meta.env.VITE_API_URL;

// New instance for public endpoints (no auth required)
export const publicAxios = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Protected instance (requires authentication)
export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor only to protected instance
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor only to protected instance
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("error.response", error.response);
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        try {
          const verifyResponse = await axiosInstance.post("/auth/verify-token");
          const verifyData = verifyResponse.data.data;

          if (!verifyData.isValid && !verifyData.isExpired) {
            // Try refresh token
            await store.dispatch(refreshToken()).unwrap();
            // Retry original request
            return axiosInstance(error.config);
          } else {
            // Token is invalid and expired
            store.dispatch(logout());
            window.location.href = "/login";
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          store.dispatch(logout());
          window.location.href = "/login";
        }
      } else {
        store.dispatch(logout());
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
