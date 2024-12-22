import { RegisterDto } from "../types/RegisterDto";
import { LoginDto, LoginWithRecaptchaDto } from "../types/LoginDto";
import axiosInstance from "../lib/axios";

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
};
