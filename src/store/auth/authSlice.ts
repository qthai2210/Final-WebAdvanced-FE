import { publicAxios, axiosInstance } from "@/lib/axios";
import { UserRole } from "@/types/Enums/User.enum";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { authService } from "@/services/auth.service";
import { toast } from "react-toastify";
import { ChangePasswordDto } from "@/types/user.types";

interface AuthState {
  username: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  status?: "active" | "locked" | "pending" | "nottransfer"; // Add this
  error: string | null;
  navigationPath: string | null; // Add this
  role: UserRole | null; // Add this
  changePasswordLoading: boolean;
  forgotPasswordLoading: boolean;
  verifyOTPLoading: boolean;
  resetPasswordLoading: boolean;
  lockTransactionLoading: boolean;
  unlockTransactionLoading: boolean;
  verifyUnlockLoading: boolean;
}

const initialState: AuthState = {
  username: null,
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: false,
  loading: false,
  error: null,
  navigationPath: null, // Add this
  role: null, // Add this
  changePasswordLoading: false,
  forgotPasswordLoading: false,
  verifyOTPLoading: false,
  resetPasswordLoading: false,
  lockTransactionLoading: false,
  unlockTransactionLoading: false,
  verifyUnlockLoading: false,
};

export interface RegisterDto {
  username: string;
  password: string;
  email: string;
  phone: string;
  fullName: string;
  identityNumber?: string;
  dateOfBirth?: Date;
  address?: string;
  role?: UserRole;
}

export const login = createAsyncThunk(
  "auth/login",
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await publicAxios.post("auth/login", {
        username,
        password,
      });
      const data = response.data.data;

      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);

      // Connect socket with a slight delay to ensure auth state is updated
      setTimeout(() => {
        connectSocket(data.user.username);
      }, 500);

      return data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
      return rejectWithValue((error.response?.data as any).message);
    }
  }
);

export const loginWithCaptcha = createAsyncThunk(
  "auth/login/secure",
  async (
    {
      username,
      password,
      recaptchaToken,
    }: { username: string; password: string; recaptchaToken: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await publicAxios.post("auth/login/secure", {
        username,
        password,
        recaptchaToken,
      });
      const data = response.data.data;
      console.log(data);
      // Store tokens immediately
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);

      return data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
      return rejectWithValue((error.response?.data as any).message);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    {
      email,
      password,
      username,
      phone,
      fullName,
      identityNumber,
      dateOfBirth,
      address,
      role,
    }: RegisterDto,
    { rejectWithValue }
  ) => {
    try {
      const response = await publicAxios.post("/auth/register", {
        email,
        password,
        username,
        phone,
        fullName,
        identityNumber,
        dateOfBirth,
        address,
        role,
      });
      localStorage.setItem("accessToken", response.data.access_token);
      localStorage.setItem("refreshToken", response.data.refresh_token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Optional: Call server-side logout endpoint if needed
      // await axiosInstance.post('/auth/logout');

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/verify-token");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Token verification failed"
      );
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const refresh_token = localStorage.getItem("refreshToken");
      const response = await axiosInstance.post("/auth/refresh-token", {
        refresh_token,
      });
      const data = response.data.data;
      localStorage.setItem("accessToken", data.access_token);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Token refresh failed"
      );
    }
  }
);

export const autoLogin = createAsyncThunk(
  "auth/autoLogin",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const verifyResult = await dispatch(verifyToken()).unwrap();
      console.log("autoLogin -> verifyResult", verifyResult);

      if (!verifyResult.isValid) {
        if (!verifyResult.isExpired) {
          // Token is invalid but not expired, try refresh
          console.log("autoLogin -> refreshToken");
          const refreshResult = await dispatch(refreshToken()).unwrap();
          if (refreshResult) {
            const response = await axiosInstance.post("/auth/relogin");
            return response.data.data;
          }
        }
        throw new Error("Token expired or invalid");
      }

      const response = await axiosInstance.post("/auth/relogin");
      return response.data.data;
    } catch (error: any) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return rejectWithValue(error.message || "Auto login failed");
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (changePasswordData: ChangePasswordDto, { rejectWithValue }) => {
    try {
      const response = await authService.changePassword(changePasswordData);

      if (response.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.error.message);
      }
    } catch (error: any) {
      toast.error("All password fields must have at least 6 characters");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      await authService.forgotPassword(email);
      toast.success("Password reset instructions sent to your email");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to send reset instructions"
      );
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const verifyOTPForgotPassword = createAsyncThunk(
  "auth/verifyOTP",
  async (
    { email, otp }: { email: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      await authService.verifyOTPForgotPassword(email, otp);
      toast.success("OTP verified successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    {
      email,
      newPassword,
      confirmPassword,
    }: {
      email: string;
      newPassword: string;
      confirmPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.resetPassword(
        email,
        newPassword,
        confirmPassword
      );

      if (response.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.error.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const lockTransaction = createAsyncThunk(
  "auth/lockTransaction",
  async (_, { rejectWithValue }) => {
    try {
      await authService.lockTransaction();
      toast.success("Your account has been locked for transactions");
      return "nottransfer";
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to lock transactions"
      );
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const unlockTransaction = createAsyncThunk(
  "auth/unlockTransaction",
  async (_, { rejectWithValue }) => {
    try {
      await authService.unlockTransaction();
      toast.success("Unlock request has been sent. Please check your mail");
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to request unlock");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const verifyUnlockTransaction = createAsyncThunk(
  "auth/verifyUnlockTransaction",
  async (otp: string, { rejectWithValue }) => {
    try {
      await authService.verifyUnlockTransaction(otp);
      toast.success("Your account has been unlocked");
      return "active";
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to verify unlock");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setNavigationPath: (state, action) => {
      state.navigationPath = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.username = action.payload.user.username;
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.role = action.payload.user.role; // Add this
        state.status = action.payload.user.status; // Add this
        // Connect socket after successful login
        connectSocket(action.payload.user.id);

        if (action.payload.user.role === UserRole.CUSTOMER) {
          state.navigationPath = "/dashboard";
        } else if (action.payload.user.role === UserRole.EMPLOYEE) {
          state.navigationPath = "/employee";
        } else {
          state.navigationPath = "/admin";
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login with reCAPTCHA
      .addCase(loginWithCaptcha.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithCaptcha.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.username = action.payload.user.username;
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.role = action.payload.user.role; // Add this
        state.status = action.payload.user.status; // Add this
        localStorage.removeItem("recaptchaToken");
        console.log("autoLogin -> action.payload", action.payload);
        if (action.payload.user.role === UserRole.CUSTOMER) {
          state.navigationPath = "/dashboard";
        } else if (action.payload.user.role === UserRole.EMPLOYEE) {
          state.navigationPath = "/employee";
        } else {
          state.navigationPath = "/admin";
        }
      })
      .addCase(loginWithCaptcha.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.username = action.payload.username;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Auto Login
      .addCase(autoLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(autoLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        console.log("autoLogin -> action.payload", action.payload);
        state.username = action.payload.user.username;
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.role = action.payload.user.role; // Add this
        state.status = action.payload.user.status; // Add this
        // Connect socket after successful auto login
        connectSocket(action.payload.user.id);

        // check role and redirect to the correct path
        console.log("autoLogin -> action.payload", action.payload);
        if (action.payload.user.role === UserRole.CUSTOMER) {
          state.navigationPath = "/dashboard";
        } else if (action.payload.user.role === UserRole.EMPLOYEE) {
          state.navigationPath = "/employee";
        } else {
          state.navigationPath = "/admin";
        }
      })
      .addCase(autoLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.navigationPath = "/login";
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.username = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.role = null; // Add this

        // Disconnect socket on logout
        disconnectSocket();

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        state.navigationPath = "/login";
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.access_token;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isAuthenticated = false;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.changePasswordLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.changePasswordLoading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.changePasswordLoading = false;
        state.error = action.payload as string;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotPasswordLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordLoading = false;
        state.error = action.payload as string;
      })

      // Verify OTP
      .addCase(verifyOTPForgotPassword.pending, (state) => {
        state.verifyOTPLoading = true;
        state.error = null;
      })
      .addCase(verifyOTPForgotPassword.fulfilled, (state) => {
        state.verifyOTPLoading = false;
      })
      .addCase(verifyOTPForgotPassword.rejected, (state, action) => {
        state.verifyOTPLoading = false;
        state.error = action.payload as string;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPasswordLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordLoading = false;
        state.error = action.payload as string;
      })

      // Lock Transaction
      .addCase(lockTransaction.pending, (state) => {
        state.lockTransactionLoading = true;
        state.error = null;
      })
      .addCase(lockTransaction.fulfilled, (state, action) => {
        state.lockTransactionLoading = false;
        state.status = action.payload;
      })
      .addCase(lockTransaction.rejected, (state, action) => {
        state.lockTransactionLoading = false;
        state.error = action.payload as string;
      })

      // Unlock Transaction Request
      .addCase(unlockTransaction.pending, (state) => {
        state.unlockTransactionLoading = true;
        state.error = null;
      })
      .addCase(unlockTransaction.fulfilled, (state) => {
        state.unlockTransactionLoading = false;
      })
      .addCase(unlockTransaction.rejected, (state, action) => {
        state.unlockTransactionLoading = false;
        state.error = action.payload as string;
      })

      // Verify Unlock Transaction
      .addCase(verifyUnlockTransaction.pending, (state) => {
        state.verifyUnlockLoading = true;
        state.error = null;
      })
      .addCase(verifyUnlockTransaction.fulfilled, (state, action) => {
        state.verifyUnlockLoading = false;
        state.status = action.payload;
      })
      .addCase(verifyUnlockTransaction.rejected, (state, action) => {
        state.verifyUnlockLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setNavigationPath } = authSlice.actions;
export default authSlice.reducer;
