import { publicAxios, axiosInstance } from "@/lib/axios";
import { UserRole } from "@/types/Enums/User.enum";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { connectSocket, disconnectSocket } from "@/lib/socket";

import { toast } from "react-toastify";

interface AuthState {
  username: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  navigationPath: string | null; // Add this
  role: UserRole | null; // Add this
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

        // Connect socket after successful login
        connectSocket(action.payload.user.id);

        console.log("autoLogin -> action.payload", action.payload);
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
        state.username = action.payload.username;
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.role = action.payload.user.role; // Add this

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
      });
  },
});

export const { clearError, setNavigationPath } = authSlice.actions;
export default authSlice.reducer;
