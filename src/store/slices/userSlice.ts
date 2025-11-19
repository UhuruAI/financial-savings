import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, Achievement, Notification } from '../../types';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants';

interface UserState {
  profile: User | null;
  achievements: Achievement[];
  notifications: Notification[];
  unreadNotifications: number;
  preferences: {
    notificationsEnabled: boolean;
    darkMode: boolean;
    biometricEnabled: boolean;
    currency: string;
    language: string;
  };
  statistics: {
    totalSaved: number;
    goalsCompleted: number;
    currentStreak: number;
    totalInvested: number;
  };
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: UserState = {
  profile: null,
  achievements: [],
  notifications: [],
  unreadNotifications: 0,
  preferences: {
    notificationsEnabled: true,
    darkMode: true,
    biometricEnabled: false,
    currency: 'USD',
    language: 'en',
  },
  statistics: {
    totalSaved: 0,
    goalsCompleted: 0,
    currentStreak: 0,
    totalInvested: 0,
  },
  isLoading: false,
  error: null,
  successMessage: null,
};

// Async thunks (placeholder - implement when user API is ready)
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await userApi.getProfile();

      throw new Error('Not implemented');
    } catch (error: any) {
      return rejectWithValue(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (data: Partial<User>, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await userApi.updateProfile(data);

      throw new Error('Not implemented');
    } catch (error: any) {
      return rejectWithValue(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const fetchAchievements = createAsyncThunk(
  'user/fetchAchievements',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await userApi.getAchievements();

      const mockAchievements: Achievement[] = [];
      return mockAchievements;
    } catch (error: any) {
      return rejectWithValue(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const fetchNotifications = createAsyncThunk(
  'user/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await userApi.getNotifications();

      const mockNotifications: Notification[] = [];
      return mockNotifications;
    } catch (error: any) {
      return rejectWithValue(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  'user/markNotificationRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await userApi.markNotificationRead(notificationId);

      return notificationId;
    } catch (error: any) {
      return rejectWithValue(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    updatePreferences: (
      state,
      action: PayloadAction<Partial<UserState['preferences']>>
    ) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    updateStatistics: (
      state,
      action: PayloadAction<Partial<UserState['statistics']>>
    ) => {
      state.statistics = { ...state.statistics, ...action.payload };
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadNotifications += 1;
      }
    },
    markAllNotificationsRead: (state) => {
      state.notifications = state.notifications.map((n) => ({ ...n, read: true }));
      state.unreadNotifications = 0;
    },
  },
  extraReducers: (builder) => {
    // Fetch profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.successMessage = SUCCESS_MESSAGES.PROFILE_UPDATED;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch achievements
    builder
      .addCase(fetchAchievements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.achievements = action.payload;
        state.error = null;
      })
      .addCase(fetchAchievements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch notifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
        state.unreadNotifications = action.payload.filter((n) => !n.read).length;
        state.error = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Mark notification read
    builder
      .addCase(markNotificationRead.pending, (state) => {
        // No loading state for marking read
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const notification = state.notifications.find((n) => n.id === action.payload);
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadNotifications = Math.max(0, state.unreadNotifications - 1);
        }
      })
      .addCase(markNotificationRead.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearSuccessMessage,
  updatePreferences,
  updateStatistics,
  addNotification,
  markAllNotificationsRead,
} = userSlice.actions;
export default userSlice.reducer;
