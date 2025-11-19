# Redux Integration Guide for Remaining Screens

This guide shows how to connect the remaining screens to Redux. **HomeScreen** has been fully connected as a reference implementation.

## ✅ Completed: HomeScreen

HomeScreen (`src/screens/HomeScreen.tsx`) has been fully integrated with Redux and serves as the reference implementation:

- ✅ Uses Redux hooks (`useAppDispatch`, `useAppSelector`)
- ✅ Fetches data on mount (`fetchGoals`, `fetchCards`, `fetchTransactions`)
- ✅ Displays loading states
- ✅ Shows empty states when no data
- ✅ Uses formatting utilities (`formatCurrency`, `formatRelativeTime`)
- ✅ Renders dynamic data from Redux store

**Route**: `app/(tabs)/index.tsx` re-exports from `src/screens/HomeScreen.tsx`

---

## 🔧 Pattern to Follow

For each remaining screen, follow this pattern:

###1. Import Redux Hooks and Actions

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchGoals, createGoal, deleteGoal } from '../store/slices/goalsSlice';
```

### 2. Select State in Component

```typescript
export default function MyScreen() {
  const dispatch = useAppDispatch();

  // Select needed state
  const { goals, isLoading, error } = useAppSelector((state) => state.goals);
  const { user } = useAppSelector((state) => state.auth);
```

### 3. Fetch Data on Mount

```typescript
  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);
```

### 4. Handle User Actions

```typescript
  const handleCreate = async () => {
    try {
      await dispatch(createGoal(data)).unwrap();
      // Success!
    } catch (error) {
      // Handle error
    }
  };
```

### 5. Show Loading/Error States

```typescript
  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }
```

---

## 📋 TODO: GoalsScreen Integration

**File**: `src/screens/GoalsScreen.tsx`

**Required Changes:**

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  addMoneyToGoal,
  clearError,
  clearSuccessMessage,
} from '../store/slices/goalsSlice';

export default function GoalsScreen() {
  const dispatch = useAppDispatch();
  const { goals, isLoading, error, successMessage } = useAppSelector(
    (state) => state.goals
  );

  // Fetch goals on mount
  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  // Create goal
  const handleCreateGoal = async (data) => {
    try {
      await dispatch(createGoal(data)).unwrap();
      setShowCreateModal(false);
      // Show success message from successMessage state
    } catch (err) {
      // Error is in error state
    }
  };

  // Delete goal
  const handleDeleteGoal = async (id) => {
    try {
      await dispatch(deleteGoal(id)).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  // Add money to goal
  const handleAddMoney = async (goalId, amount) => {
    try {
      await dispatch(addMoneyToGoal({ id: goalId, data: { amount } })).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  // Render goals from Redux state instead of hardcoded data
  return (
    <View>
      {isLoading && <ActivityIndicator />}
      {error && <Text style={styles.error}>{error}</Text>}
      {successMessage && <Text style={styles.success}>{successMessage}</Text>}

      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </View>
  );
}
```

**Update Route**: `app/(tabs)/goals.tsx` → Export from `src/screens/GoalsScreen.tsx`

---

## 📋 TODO: WalletScreen Integration

**File**: `src/screens/WalletScreen.tsx`

**Required Changes:**

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCards, fetchTransactions } from '../store/slices/walletSlice';
import { formatCurrency, formatRelativeTime } from '../utils/formatting';

export default function WalletScreen() {
  const dispatch = useAppDispatch();
  const { cards, transactions, balance, isLoading } = useAppSelector(
    (state) => state.wallet
  );
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    dispatch(fetchCards());
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <ScrollView>
      {/* Balance from Redux */}
      <Text>{formatCurrency(balance)}</Text>

      {/* Cards from Redux */}
      {cards.map((card) => (
        <CardComponent key={card.id} card={card} showBalance={showBalance} />
      ))}

      {/* Transactions from Redux */}
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          time={formatRelativeTime(transaction.timestamp)}
        />
      ))}
    </ScrollView>
  );
}
```

**Update Route**: `app/(tabs)/wallet.tsx` → Export from `src/screens/WalletScreen.tsx`

---

## 📋 TODO: InvestScreen Integration

**File**: `src/screens/InvestScreen.tsx`

**Required Changes:**

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchInvestments, fetchPortfolio } from '../store/slices/investmentsSlice';
import { formatCurrency, formatPercentage } from '../utils/formatting';

export default function InvestScreen() {
  const dispatch = useAppDispatch();
  const {
    investments,
    portfolioValue,
    totalGain,
    totalGainPercent,
    isLoading,
  } = useAppSelector((state) => state.investments);

  useEffect(() => {
    dispatch(fetchInvestments());
    dispatch(fetchPortfolio());
  }, [dispatch]);

  return (
    <ScrollView>
      {/* Portfolio value from Redux */}
      <Text>{formatCurrency(portfolioValue)}</Text>
      <Text>{formatPercentage(totalGainPercent, 2, true)}</Text>

      {/* Investments from Redux */}
      {investments.map((investment) => (
        <InvestmentCard key={investment.id} investment={investment} />
      ))}
    </ScrollView>
  );
}
```

**Update Route**: `app/(tabs)/invest.tsx` → Export from `src/screens/InvestScreen.tsx`

---

## 📋 TODO: ProfileScreen Integration

**File**: `src/screens/ProfileScreen.tsx`

**Required Changes:**

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchUserProfile,
  fetchAchievements,
  fetchNotifications,
  updatePreferences,
} from '../store/slices/userSlice';
import { logoutUser } from '../store/slices/authSlice';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const {
    achievements,
    notifications,
    preferences,
    statistics,
    isLoading,
  } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchAchievements());
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Toggle preferences
  const handleToggleNotifications = (value) => {
    dispatch(updatePreferences({ notificationsEnabled: value }));
  };

  const handleToggleDarkMode = (value) => {
    dispatch(updatePreferences({ darkMode: value }));
  };

  // Logout
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      // Navigate to login screen
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ScrollView>
      {/* User info from Redux */}
      <Text>{user?.name}</Text>
      <Text>{user?.email}</Text>

      {/* Stats from Redux */}
      <Text>Goals Completed: {statistics.goalsCompleted}</Text>
      <Text>Total Saved: {formatCurrency(statistics.totalSaved)}</Text>

      {/* Achievements from Redux */}
      {achievements.map((achievement) => (
        <AchievementCard key={achievement.id} achievement={achievement} />
      ))}

      {/* Settings with Redux */}
      <Switch
        value={preferences.notificationsEnabled}
        onValueChange={handleToggleNotifications}
      />
      <Switch
        value={preferences.darkMode}
        onValueChange={handleToggleDarkMode}
      />

      <Button title="Logout" onPress={handleLogout} />
    </ScrollView>
  );
}
```

**Update Route**: `app/(tabs)/profile.tsx` → Export from `src/screens/ProfileScreen.tsx`

---

## 🎯 Common Patterns & Tips

### 1. **Loading States**

Always show loading indicators:

```typescript
if (isLoading) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#8B5CF6" />
    </View>
  );
}
```

### 2. **Error Handling**

Display errors to users:

```typescript
{error && (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{error}</Text>
  </View>
)}
```

Clear errors after displaying:

```typescript
useEffect(() => {
  if (error) {
    const timer = setTimeout(() => {
      dispatch(clearError());
    }, 3000);
    return () => clearTimeout(timer);
  }
}, [error, dispatch]);
```

### 3. **Success Messages**

Show success feedback:

```typescript
{successMessage && (
  <View style={styles.successContainer}>
    <Text style={styles.successText}>{successMessage}</Text>
  </View>
)}
```

### 4. **Empty States**

Handle empty data gracefully:

```typescript
{goals.length === 0 && !isLoading && (
  <View style={styles.emptyState}>
    <Text style={styles.emptyText}>No goals yet</Text>
    <Button title="Create Goal" onPress={handleCreate} />
  </View>
)}
```

### 5. **Async Actions with unwrap()**

Use `.unwrap()` for better error handling:

```typescript
const handleSubmit = async () => {
  try {
    const result = await dispatch(createGoal(data)).unwrap();
    // result contains the created goal
    console.log('Created:', result);
  } catch (error) {
    // error is the rejection value
    console.error('Failed:', error);
  }
};
```

### 6. **Optimistic Updates**

For better UX, update UI immediately:

```typescript
const handleDelete = async (id) => {
  // Optimistically remove from UI
  const originalGoals = [...goals];

  try {
    await dispatch(deleteGoal(id)).unwrap();
  } catch (error) {
    // Revert on error
    console.error('Delete failed, reverting...');
  }
};
```

### 7. **Using Formatting Utilities**

Always use utility functions:

```typescript
import { formatCurrency, formatRelativeTime, formatPercentage } from '../utils/formatting';

// In component
<Text>{formatCurrency(amount)}</Text>
<Text>{formatRelativeTime(transaction.timestamp)}</Text>
<Text>{formatPercentage(change, 2, true)}</Text>
```

---

## 🧪 Testing After Integration

After connecting each screen, test:

1. **Data Fetching**: Does data load on mount?
2. **Loading States**: Are loaders shown during fetch?
3. **Error Handling**: Are errors displayed?
4. **User Actions**: Do create/update/delete work?
5. **State Persistence**: Does data persist after app restart?
6. **Empty States**: Are empty states shown when no data?

---

## 📝 Checklist for Each Screen

- [ ] Import Redux hooks
- [ ] Select needed state with `useAppSelector`
- [ ] Fetch data on mount with `useEffect`
- [ ] Replace hardcoded data with Redux state
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add empty states
- [ ] Implement user actions (create, update, delete)
- [ ] Clear error/success messages after display
- [ ] Update route file to export from `src/screens`
- [ ] Test all functionality

---

## 🎓 Learning Resources

- **Redux Toolkit Docs**: https://redux-toolkit.js.org/
- **React-Redux Hooks**: https://react-redux.js.org/api/hooks
- **Store Documentation**: `src/store/README.md`
- **Reference Implementation**: `src/screens/HomeScreen.tsx`

---

## 💡 Next Steps

1. Start with **GoalsScreen** (most feature-complete)
2. Then **WalletScreen** (uses similar patterns)
3. Then **InvestScreen** (simpler, fewer actions)
4. Finally **ProfileScreen** (settings & logout)

Each screen should take 15-30 minutes to integrate following the patterns above.

**Need help?** Refer to `src/screens/HomeScreen.tsx` for a complete working example!
