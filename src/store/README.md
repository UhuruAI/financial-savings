# Redux Store Documentation

This directory contains the Redux store configuration and all state management slices for the application.

## Structure

```
store/
├── index.ts              # Store configuration with redux-persist
├── hooks.ts              # Typed Redux hooks
└── slices/
    ├── authSlice.ts      # Authentication state
    ├── goalsSlice.ts     # Savings goals state
    ├── walletSlice.ts    # Wallet & transactions state
    ├── investmentsSlice.ts # Investment portfolio state
    └── userSlice.ts      # User profile & preferences state
```

## Usage

### 1. Import Typed Hooks

Always use the typed hooks instead of the plain `useDispatch` and `useSelector`:

```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
```

### 2. Reading State

```typescript
import { useAppSelector } from '@/store/hooks';

function MyComponent() {
  // Read auth state
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  // Read goals
  const goals = useAppSelector((state) => state.goals.goals);

  // Read wallet balance
  const balance = useAppSelector((state) => state.wallet.balance);

  return (
    <View>
      {isAuthenticated && <Text>Welcome, {user?.name}!</Text>}
      <Text>Balance: ${balance}</Text>
    </View>
  );
}
```

### 3. Dispatching Actions

```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, logoutUser } from '@/store/slices/authSlice';
import { fetchGoals, createGoal } from '@/store/slices/goalsSlice';

function LoginScreen() {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const handleLogin = async () => {
    try {
      const result = await dispatch(loginUser({
        email: 'user@example.com',
        password: 'password123'
      })).unwrap();

      // Navigate to home screen
      console.log('Logged in:', result);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <View>
      <Button onPress={handleLogin} disabled={isLoading}>
        Login
      </Button>
      {error && <Text>{error}</Text>}
    </View>
  );
}
```

### 4. Creating Goals

```typescript
import { useAppDispatch } from '@/store/hooks';
import { createGoal, fetchGoals } from '@/store/slices/goalsSlice';

function CreateGoalScreen() {
  const dispatch = useAppDispatch();

  const handleCreateGoal = async () => {
    try {
      await dispatch(createGoal({
        title: 'New iPhone',
        target: 1200,
        emoji: '📱',
        deadline: '2024-12-31',
        color: '#8B5CF6'
      })).unwrap();

      // Refetch goals after creation
      dispatch(fetchGoals());
    } catch (error) {
      console.error('Failed to create goal:', error);
    }
  };

  return (
    <Button onPress={handleCreateGoal}>Create Goal</Button>
  );
}
```

### 5. Handling Loading and Error States

```typescript
import { useAppSelector } from '@/store/hooks';

function GoalsScreen() {
  const { goals, isLoading, error } = useAppSelector((state) => state.goals);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <FlatList
      data={goals}
      renderItem={({ item }) => <GoalCard goal={item} />}
    />
  );
}
```

## Available Slices

### Auth Slice (`authSlice`)

**State:**
- `user`: Current user object
- `token`: Authentication token
- `isAuthenticated`: Boolean authentication status
- `isLoading`: Loading state
- `error`: Error message

**Async Actions:**
- `loginUser(credentials)` - Login with email/password
- `registerUser(data)` - Register new user
- `logoutUser()` - Logout current user
- `checkAuthStatus()` - Check if user is authenticated

**Sync Actions:**
- `clearError()` - Clear error message
- `clearSuccessMessage()` - Clear success message
- `updateUser(userData)` - Update user data
- `setAuthToken(token)` - Set auth token

### Goals Slice (`goalsSlice`)

**State:**
- `goals`: Array of goals
- `currentGoal`: Selected goal
- `isLoading`: Loading state
- `error`: Error message
- `pagination`: Pagination info

**Async Actions:**
- `fetchGoals(params)` - Fetch all goals
- `fetchGoalById(id)` - Fetch single goal
- `createGoal(data)` - Create new goal
- `updateGoal({ id, data })` - Update goal
- `deleteGoal(id)` - Delete goal
- `addMoneyToGoal({ id, data })` - Add money to goal

**Sync Actions:**
- `clearError()` - Clear error
- `clearSuccessMessage()` - Clear success message
- `setCurrentGoal(goal)` - Set current goal
- `clearCurrentGoal()` - Clear current goal

### Wallet Slice (`walletSlice`)

**State:**
- `cards`: Array of cards
- `transactions`: Array of transactions
- `currentCard`: Selected card
- `balance`: Total balance
- `isLoading`: Loading state
- `error`: Error message

**Async Actions:**
- `fetchCards()` - Fetch all cards
- `fetchTransactions(params)` - Fetch transactions
- `addCard(data)` - Add new card
- `addTransaction(data)` - Add transaction

**Sync Actions:**
- `clearError()` - Clear error
- `setCurrentCard(card)` - Set current card
- `updateBalance(amount)` - Update balance
- `addTransactionLocal(transaction)` - Add transaction locally

### Investments Slice (`investmentsSlice`)

**State:**
- `investments`: Array of investments
- `portfolioValue`: Total portfolio value
- `totalGain`: Total gain/loss
- `totalGainPercent`: Total gain/loss percentage
- `isLoading`: Loading state
- `error`: Error message

**Async Actions:**
- `fetchInvestments()` - Fetch all investments
- `fetchPortfolio()` - Fetch portfolio summary
- `buyInvestment(data)` - Buy investment
- `sellInvestment(data)` - Sell investment

**Sync Actions:**
- `clearError()` - Clear error
- `updateInvestmentPrice({ id, currentPrice })` - Update price

### User Slice (`userSlice`)

**State:**
- `profile`: User profile
- `achievements`: Array of achievements
- `notifications`: Array of notifications
- `unreadNotifications`: Count of unread notifications
- `preferences`: User preferences
- `statistics`: User statistics
- `isLoading`: Loading state
- `error`: Error message

**Async Actions:**
- `fetchUserProfile()` - Fetch user profile
- `updateUserProfile(data)` - Update profile
- `fetchAchievements()` - Fetch achievements
- `fetchNotifications()` - Fetch notifications
- `markNotificationRead(id)` - Mark notification as read

**Sync Actions:**
- `clearError()` - Clear error
- `updatePreferences(prefs)` - Update preferences
- `updateStatistics(stats)` - Update statistics
- `addNotification(notification)` - Add notification
- `markAllNotificationsRead()` - Mark all as read

## Redux Persist

The store is configured with redux-persist to save state to AsyncStorage:

**Persisted:**
- `auth` - Authentication state (survives app restarts)
- `user` - User preferences and profile

**Not Persisted:**
- `goals` - Fetched from API on app start
- `wallet` - Fetched from API
- `investments` - Fetched from API

## Best Practices

1. **Always use typed hooks** - Use `useAppDispatch` and `useAppSelector`
2. **Handle loading states** - Show loaders when `isLoading` is true
3. **Handle errors** - Display error messages from state
4. **Clear messages** - Call `clearError()` and `clearSuccessMessage()` after displaying
5. **Use unwrap()** - Call `.unwrap()` on async thunks to handle errors in try/catch
6. **Don't duplicate state** - Keep derived data in selectors, not in state

## Testing

Example test for a slice:

```typescript
import goalsReducer, { createGoal, fetchGoals } from './goalsSlice';

describe('goalsSlice', () => {
  it('should handle createGoal.fulfilled', () => {
    const previousState = { goals: [], isLoading: false, error: null };
    const newGoal = { id: '1', title: 'Test Goal', target: 1000 };

    const nextState = goalsReducer(
      previousState,
      createGoal.fulfilled(newGoal, '', {} as any)
    );

    expect(nextState.goals).toHaveLength(1);
    expect(nextState.goals[0]).toEqual(newGoal);
  });
});
```

## Selectors

Create reusable selectors for complex data:

```typescript
// src/store/selectors/goalsSelectors.ts
import { RootState } from '../index';

export const selectActiveGoals = (state: RootState) =>
  state.goals.goals.filter((goal) => goal.current < goal.target);

export const selectCompletedGoals = (state: RootState) =>
  state.goals.goals.filter((goal) => goal.current >= goal.target);

export const selectTotalSaved = (state: RootState) =>
  state.goals.goals.reduce((sum, goal) => sum + goal.current, 0);
```

Usage:

```typescript
import { useAppSelector } from '@/store/hooks';
import { selectActiveGoals, selectTotalSaved } from '@/store/selectors/goalsSelectors';

function Dashboard() {
  const activeGoals = useAppSelector(selectActiveGoals);
  const totalSaved = useAppSelector(selectTotalSaved);

  return (
    <View>
      <Text>Active Goals: {activeGoals.length}</Text>
      <Text>Total Saved: ${totalSaved}</Text>
    </View>
  );
}
```
