import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi, LoginResponse, RegisterResponse } from '../../api/auth';
import { secureStorage } from '../../utils/storage';
import { STORAGE_KEYS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants';
import { User, LoginFormData, RegisterFormData } from '../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  successMessage: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginFormData, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);

      if (response.success && response.data) {
        const { user, token, refreshToken } = response.data;

        // Store tokens securely
        await secureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        await secureStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

        return { user, token };
      }

      return rejectWithValue(response.error || ERROR_MESSAGES.INVALID_CREDENTIALS);
    } catch (error: any) {
      return rejectWithValue(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegisterFormData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(data);

      if (response.success && response.data) {
        const { user, token, refreshToken } = response.data;

        // Store tokens securely
        await secureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        await secureStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

        return { user, token };
      }

      return rejectWithValue(response.error || ERROR_MESSAGES.VALIDATION_ERROR);
    } catch (error: any) {
      return rejectWithValue(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();

      // Clear stored tokens
      await secureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await secureStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      await secureStorage.removeItem(STORAGE_KEYS.USER_DATA);

      return null;
    } catch (error: any) {
      // Even if API call fails, clear local tokens
      await secureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await secureStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      await secureStorage.removeItem(STORAGE_KEYS.USER_DATA);

      return null;
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = await secureStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const userData = await secureStorage.getItem(STORAGE_KEYS.USER_DATA);

      if (token && userData) {
        const user: User = JSON.parse(userData);
        return { user, token };
      }

      return rejectWithValue('No authentication data found');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.successMessage = SUCCESS_MESSAGES.LOGIN_SUCCESS;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        state.user = null;
        state.token = null;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.successMessage = SUCCESS_MESSAGES.REGISTER_SUCCESS;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        state.user = null;
        state.token = null;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Still clear auth state even if API call fails
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
        state.successMessage = null;
      });

    // Check auth status
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearError, clearSuccessMessage, updateUser, setAuthToken } = authSlice.actions;
export default authSlice.reducer;
