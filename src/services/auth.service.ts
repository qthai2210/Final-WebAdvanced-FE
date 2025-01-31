import { RegisterDto } from "../types/RegisterDto";
import { LoginDto, LoginWithRecaptchaDto } from "../types/LoginDto";
import axiosInstance from "../lib/axios";
import { ChangePasswordDto } from "@/types/user.types";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/login",
      data
    );
    return response.data;
  },

  loginWithCaptcha: async (
    data: LoginWithRecaptchaDto
  ): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/login/secure",
      data
    );
    return response.data;
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      "/auth/register",
      data
    );
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>("/auth/refresh", {
      refreshToken,
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  changePassword: async (data: ChangePasswordDto) => {
    const response = await axiosInstance.post("/auth/change-password", data);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    await axiosInstance.post("/auth/forgot-password", { email });
  },

  verifyOTPForgotPassword: async (email: string, otp: string) => {
    await axiosInstance.post("/auth/verify-otp", {
      email,
      otp,
    });
  },

  resetPassword: async (
    email: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    const response = await axiosInstance.post("/auth/reset-password", {
      email,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

  lockTransaction: async () => {
    await axiosInstance.post("/auth/lock-account");
  },

  unlockTransaction: async () => {
    await axiosInstance.post("/auth/request-unlock");
  },

  verifyUnlockTransaction: async (otp: string) => {
    await axiosInstance.post("/auth/verify-unlock", { otp });
  },
};
