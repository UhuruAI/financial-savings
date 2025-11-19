import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { goalsApi, CreateGoalData, UpdateGoalData, AddToGoalData } from '../../api/goals';
import { Goal } from '../../types';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants';

interface GoalsState {
  goals: Goal[];
  currentGoal: Goal | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

const initialState: GoalsState = {
  goals: [],
  currentGoal: null,
  isLoading: false,
  error: null,
  successMessage: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  },
};

// Async thunks
export const fetchGoals = createAsyncThunk(
  'goals/fetchGoals',
  async (
    params: { page?: number; limit?: number; status?: 'active' | 'completed' | 'all' } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await goalsApi.getGoals(params);

      if (response.success) {
        return {
          goals: response.data,
          pagination: response.pagination,
        };
      }

      return rejectWithValue(ERROR_MESSAGES.SERVER_ERROR);
    } catch (error: any) {
      return rejectWithValue(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const fetchGoalById = createAsyncThunk(
  'goals/fetchGoalById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await goalsApi.getGoal(id);

      if (response.success && response.data) {
        return response.data;
      }

      return rejectWithValue(ERROR_MESSAGES.NOT_FOUND);
    } catch (error: any) {
      return rejectWithValue(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const createGoal = createAsyncThunk(
  'goals/createGoal',
  async (data: CreateGoalData, { rejectWithValue }) => {
    try {
      const response = await goalsApi.createGoal(data);

      if (response.success && response.data) {
        return response.data;
      }

      return rejectWithValue(response.error || ERROR_MESSAGES.VALIDATION_ERROR);
    } catch (error: any) {
      return rejectWithValue(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const updateGoal = createAsyncThunk(
  'goals/updateGoal',
  async ({ id, data }: { id: string; data: UpdateGoalData }, { rejectWithValue }) => {
    try {
      const response = await goalsApi.updateGoal(id, data);

      if (response.success && response.data) {
        return response.data;
      }

      return rejectWithValue(response.error || ERROR_MESSAGES.VALIDATION_ERROR);
    } catch (error: any) {
      return rejectWithValue(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const deleteGoal = createAsyncThunk(
  'goals/deleteGoal',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await goalsApi.deleteGoal(id);

      if (response.success) {
        return id;
      }

      return rejectWithValue(response.error || ERROR_MESSAGES.SERVER_ERROR);
    } catch (error: any) {
      return rejectWithValue(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const addMoneyToGoal = createAsyncThunk(
  'goals/addMoneyToGoal',
  async ({ id, data }: { id: string; data: AddToGoalData }, { rejectWithValue }) => {
    try {
      const response = await goalsApi.addToGoal(id, data);

      if (response.success && response.data) {
        return response.data;
      }

      return rejectWithValue(response.error || ERROR_MESSAGES.INSUFFICIENT_FUNDS);
    } catch (error: any) {
      return rejectWithValue(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

// Slice
const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearCurrentGoal: (state) => {
      state.currentGoal = null;
    },
    setCurrentGoal: (state, action: PayloadAction<Goal>) => {
      state.currentGoal = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch goals
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.goals = action.payload.goals;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch goal by ID
    builder
      .addCase(fetchGoalById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGoalById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGoal = action.payload;
        state.error = null;
      })
      .addCase(fetchGoalById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create goal
    builder
      .addCase(createGoal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.goals.unshift(action.payload);
        state.successMessage = SUCCESS_MESSAGES.GOAL_CREATED;
        state.error = null;
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update goal
    builder
      .addCase(updateGoal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.goals.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.goals[index] = action.payload;
        }
        if (state.currentGoal?.id === action.payload.id) {
          state.currentGoal = action.payload;
        }
        state.successMessage = SUCCESS_MESSAGES.GOAL_UPDATED;
        state.error = null;
      })
      .addCase(updateGoal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete goal
    builder
      .addCase(deleteGoal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.goals = state.goals.filter((g) => g.id !== action.payload);
        if (state.currentGoal?.id === action.payload) {
          state.currentGoal = null;
        }
        state.successMessage = SUCCESS_MESSAGES.GOAL_DELETED;
        state.error = null;
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add money to goal
    builder
      .addCase(addMoneyToGoal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addMoneyToGoal.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.goals.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.goals[index] = action.payload;
        }
        if (state.currentGoal?.id === action.payload.id) {
          state.currentGoal = action.payload;
        }
        state.successMessage = 'Money added successfully!';
        state.error = null;
      })
      .addCase(addMoneyToGoal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccessMessage, clearCurrentGoal, setCurrentGoal } =
  goalsSlice.actions;
export default goalsSlice.reducer;
