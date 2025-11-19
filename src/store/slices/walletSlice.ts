import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Card, Transaction } from '../../types';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants';

interface WalletState {
  cards: Card[];
  transactions: Transaction[];
  currentCard: Card | null;
  balance: number;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: WalletState = {
  cards: [],
  transactions: [],
  currentCard: null,
  balance: 0,
  isLoading: false,
  error: null,
  successMessage: null,
};

// Async thunks (placeholder - implement when wallet API is ready)
export const fetchCards = createAsyncThunk(
  'wallet/fetchCards',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await walletApi.getCards();

      // Mock data for now
      const mockCards: Card[] = [];
      return mockCards;
    } catch (error: any) {
      return rejectWithValue(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'wallet/fetchTransactions',
  async (params: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await walletApi.getTransactions(params);

      // Mock data for now
      const mockTransactions: Transaction[] = [];
      return mockTransactions;
    } catch (error: any) {
      return rejectWithValue(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const addCard = createAsyncThunk(
  'wallet/addCard',
  async (cardData: Partial<Card>, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await walletApi.addCard(cardData);

      throw new Error('Not implemented');
    } catch (error: any) {
      return rejectWithValue(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

export const addTransaction = createAsyncThunk(
  'wallet/addTransaction',
  async (transactionData: Partial<Transaction>, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await walletApi.addTransaction(transactionData);

      throw new Error('Not implemented');
    } catch (error: any) {
      return rejectWithValue(error.message || ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
);

// Slice
const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setCurrentCard: (state, action: PayloadAction<Card | null>) => {
      state.currentCard = action.payload;
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
    addTransactionLocal: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    // Fetch cards
    builder
      .addCase(fetchCards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cards = action.payload;
        // Calculate total balance
        state.balance = action.payload.reduce((sum, card) => sum + card.balance, 0);
        state.error = null;
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch transactions
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
        state.error = null;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add card
    builder
      .addCase(addCard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addCard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cards.push(action.payload);
        state.successMessage = 'Card added successfully!';
        state.error = null;
      })
      .addCase(addCard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add transaction
    builder
      .addCase(addTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions.unshift(action.payload);
        state.successMessage = SUCCESS_MESSAGES.TRANSACTION_CREATED;
        state.error = null;
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearSuccessMessage,
  setCurrentCard,
  updateBalance,
  addTransactionLocal,
} = walletSlice.actions;
export default walletSlice.reducer;
