import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Investment } from '../../types';
import { ERROR_MESSAGES } from '../../constants';

interface InvestmentsState {
  investments: Investment[];
  portfolioValue: number;
  totalGain: number;
  totalGainPercent: number;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: InvestmentsState = {
  investments: [],
  portfolioValue: 0,
  totalGain: 0,
  totalGainPercent: 0,
  isLoading: false,
  error: null,
  successMessage: null,
};

// Async thunks (placeholder - implement when investment API is ready)
export const fetchInvestments = createAsyncThunk(
  'investments/fetchInvestments',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await investmentsApi.getInvestments();

      // Mock data for now
      const mockInvestments: Investment[] = [];
      return mockInvestments;
    } catch (error: any) {
      return rejectWithValue(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const fetchPortfolio = createAsyncThunk(
  'investments/fetchPortfolio',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await investmentsApi.getPortfolio();

      return {
        portfolioValue: 0,
        totalGain: 0,
        totalGainPercent: 0,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const buyInvestment = createAsyncThunk(
  'investments/buyInvestment',
  async (
    data: { symbol: string; quantity: number; price: number },
    { rejectWithValue }
  ) => {
    try {
      // TODO: Replace with actual API call
      // const response = await investmentsApi.buyInvestment(data);

      throw new Error('Not implemented');
    } catch (error: any) {
      return rejectWithValue(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const sellInvestment = createAsyncThunk(
  'investments/sellInvestment',
  async (
    data: { id: string; quantity: number; price: number },
    { rejectWithValue }
  ) => {
    try {
      // TODO: Replace with actual API call
      // const response = await investmentsApi.sellInvestment(data);

      throw new Error('Not implemented');
    } catch (error: any) {
      return rejectWithValue(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

// Slice
const investmentsSlice = createSlice({
  name: 'investments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    updateInvestmentPrice: (
      state,
      action: PayloadAction<{ id: string; currentPrice: number }>
    ) => {
      const investment = state.investments.find((inv) => inv.id === action.payload.id);
      if (investment) {
        investment.currentPrice = action.payload.currentPrice;
        investment.value = investment.quantity * action.payload.currentPrice;
        investment.change =
          investment.value - investment.quantity * investment.purchasePrice;
        investment.changePercent =
          (investment.change / (investment.quantity * investment.purchasePrice)) * 100;
      }
      // Recalculate portfolio value
      state.portfolioValue = state.investments.reduce((sum, inv) => sum + inv.value, 0);
    },
  },
  extraReducers: (builder) => {
    // Fetch investments
    builder
      .addCase(fetchInvestments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvestments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.investments = action.payload;
        // Calculate portfolio value
        state.portfolioValue = action.payload.reduce((sum, inv) => sum + inv.value, 0);
        state.error = null;
      })
      .addCase(fetchInvestments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch portfolio
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.portfolioValue = action.payload.portfolioValue;
        state.totalGain = action.payload.totalGain;
        state.totalGainPercent = action.payload.totalGainPercent;
        state.error = null;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Buy investment
    builder
      .addCase(buyInvestment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(buyInvestment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.investments.push(action.payload);
        state.successMessage = 'Investment purchased successfully!';
        state.error = null;
      })
      .addCase(buyInvestment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sell investment
    builder
      .addCase(sellInvestment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sellInvestment.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.investments.findIndex((inv) => inv.id === action.payload.id);
        if (index !== -1) {
          state.investments[index] = action.payload;
        }
        state.successMessage = 'Investment sold successfully!';
        state.error = null;
      })
      .addCase(sellInvestment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccessMessage, updateInvestmentPrice } =
  investmentsSlice.actions;
export default investmentsSlice.reducer;
