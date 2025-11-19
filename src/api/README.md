# API Layer Documentation

This directory contains the complete API layer for the FinSave application, including service modules, configuration, and mock data support.

## Architecture

```
src/api/
├── client.ts           # Axios client with interceptors
├── mockInterceptor.ts  # Mock data interceptor for development
├── auth.ts             # Authentication endpoints
├── goals.ts            # Goals CRUD operations
├── wallet.ts           # Cards and transactions
├── investments.ts      # Investment portfolio management
├── user.ts             # User profile and preferences
└── index.ts            # API exports
```

## Configuration

### Environment Setup

Copy `.env.example` to `.env` and configure:

```env
# Environment (development, staging, production)
EXPO_PUBLIC_ENVIRONMENT=development

# API URLs for each environment
EXPO_PUBLIC_API_URL_DEV=http://localhost:3000/api
EXPO_PUBLIC_API_URL_STAGING=https://staging-api.finsave.com/api
EXPO_PUBLIC_API_URL_PROD=https://api.finsave.com/api

# Mock Data (true = use mock data, false = use real API)
EXPO_PUBLIC_USE_MOCK_DATA=true
```

### API Configuration File

Located at `src/config/api.ts`, this file manages:
- Environment-specific base URLs
- Request timeouts
- Feature flags
- Mock data enablement

## Mock Data System

### Overview

The mock data system allows development and testing without a backend server. It intercepts API calls and returns realistic mock responses.

### Features

- **Automatic Mock Responses**: Returns mock data for all API endpoints
- **Realistic Network Delay**: Simulates 200-700ms network latency
- **Full CRUD Support**: Mock implementations for create, read, update, delete
- **Type-Safe**: All mock data conforms to TypeScript types

### Usage

```typescript
import { generateMockGoals, generateMockUser } from '../utils/mockData';

// Generate mock data
const goals = generateMockGoals(5);
const user = generateMockUser();
```

### Enabling/Disabling

```env
# Enable mock data
EXPO_PUBLIC_USE_MOCK_DATA=true

# Disable mock data (use real API)
EXPO_PUBLIC_USE_MOCK_DATA=false
```

## API Services

### Authentication API (`auth.ts`)

```typescript
import { authApi } from '../api';

// Login
const response = await authApi.login({
  email: 'user@example.com',
  password: 'password123',
});

// Register
const response = await authApi.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
});

// Logout
await authApi.logout();
```

### Goals API (`goals.ts`)

```typescript
import { goalsApi } from '../api';

// Fetch all goals
const response = await goalsApi.fetchGoals({ limit: 10, status: 'active' });

// Create goal
const response = await goalsApi.createGoal({
  title: 'New Car',
  target: 25000,
  emoji: '🚗',
  deadline: '2025-12-31',
  color: '#8B5CF6',
});

// Update goal
const response = await goalsApi.updateGoal('goal-id', {
  current: 5000,
});

// Delete goal
await goalsApi.deleteGoal('goal-id');

// Add money to goal
const response = await goalsApi.addMoneyToGoal('goal-id', 100);
```

### Wallet API (`wallet.ts`)

```typescript
import { walletApi } from '../api';

// Fetch cards
const response = await walletApi.fetchCards();

// Add card
const response = await walletApi.addCard({
  name: 'My Card',
  type: 'Debit',
  lastFour: '1234',
  expiryMonth: '12',
  expiryYear: '2027',
});

// Fetch transactions
const response = await walletApi.fetchTransactions({
  limit: 20,
  cardId: 'card-id',
  category: 'Food & Drink',
});

// Get balance
const response = await walletApi.fetchBalance();
```

### Investments API (`investments.ts`)

```typescript
import { investmentsApi } from '../api';

// Fetch all investments
const response = await investmentsApi.fetchInvestments();

// Create investment
const response = await investmentsApi.createInvestment({
  symbol: 'TECH',
  name: 'Tech Growth ETF',
  type: 'ETF',
  amount: 1000,
});

// Buy more
const response = await investmentsApi.buyInvestment('investment-id', 500);

// Sell
const response = await investmentsApi.sellInvestment('investment-id', 200);

// Get history
const response = await investmentsApi.fetchInvestmentHistory('investment-id', 'month');
```

### User API (`user.ts`)

```typescript
import { userApi } from '../api';

// Fetch profile
const response = await userApi.fetchProfile();

// Update profile
const response = await userApi.updateProfile({
  name: 'Jane Doe',
  phone: '+1234567890',
});

// Fetch achievements
const response = await userApi.fetchAchievements();

// Fetch notifications
const response = await userApi.fetchNotifications({
  limit: 10,
  unreadOnly: true,
});

// Update preferences
const response = await userApi.updatePreferences({
  notifications: true,
  darkMode: true,
});

// Change password
await userApi.changePassword({
  currentPassword: 'old123',
  newPassword: 'new456',
});
```

## Response Format

All API responses follow this structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### Success Response

```typescript
{
  success: true,
  data: {
    // Response data
  }
}
```

### Error Response

```typescript
{
  success: false,
  error: "Error message here"
}
```

## Error Handling

### Automatic Error Handling

The API client automatically handles:
- Network errors
- Authentication errors (401)
- Token refresh
- Server errors (500+)

### Custom Error Handling

```typescript
import { handleApiError } from '../api/client';

try {
  const response = await goalsApi.createGoal(data);
} catch (error) {
  const errorMessage = handleApiError(error);
  console.error(errorMessage);
}
```

## Interceptors

### Request Interceptor

- Adds authentication token to all requests
- Logs requests in development mode

### Response Interceptor

- Logs responses in development mode
- Handles 401 errors and token refresh
- Provides error transformation

### Mock Interceptor

- Intercepts requests when mock mode is enabled
- Returns realistic mock data
- Simulates network delays

## Authentication Flow

1. **Login/Register**: User provides credentials
2. **Token Storage**: JWT token stored in secure storage
3. **Auto-Attach**: Token automatically attached to all requests
4. **Auto-Refresh**: Token refreshed when expired (401 response)
5. **Logout**: Tokens cleared, user redirected to login

## Network Monitoring

The API client includes:
- Request/response logging in development
- Error tracking and reporting
- Automatic retry logic for failed requests
- Token refresh on authentication errors

## Best Practices

### 1. Use Typed Responses

```typescript
const response = await goalsApi.fetchGoals();
if (response.success && response.data) {
  const goals: Goal[] = response.data.goals;
}
```

### 2. Handle Errors Gracefully

```typescript
try {
  await dispatch(createGoal(data)).unwrap();
} catch (error: any) {
  Alert.alert('Error', error || 'Failed to create goal');
}
```

### 3. Use Mock Data in Development

```env
EXPO_PUBLIC_USE_MOCK_DATA=true
```

### 4. Configure Environment Variables

Use different API URLs for development, staging, and production.

### 5. Leverage TypeScript

All API services are fully typed with TypeScript for better IDE support and type safety.

## Testing

### With Mock Data

```typescript
// No backend required!
EXPO_PUBLIC_USE_MOCK_DATA=true
```

### With Real Backend

```typescript
// Connect to your backend
EXPO_PUBLIC_USE_MOCK_DATA=false
EXPO_PUBLIC_API_URL_DEV=http://localhost:3000/api
```

## Backend Integration

### Step 1: Set Up Backend

Choose your backend:
- **Supabase**: PostgreSQL database + Auth + Realtime
- **Firebase**: NoSQL database + Auth + Cloud Functions
- **Custom API**: Node.js/Express, Python/Django, etc.

### Step 2: Configure Environment

```env
EXPO_PUBLIC_ENVIRONMENT=development
EXPO_PUBLIC_API_URL_DEV=http://your-backend-url/api
EXPO_PUBLIC_USE_MOCK_DATA=false
```

### Step 3: Implement Endpoints

Match the endpoints in this documentation:
- `POST /auth/login`
- `POST /auth/register`
- `GET /goals`
- `POST /goals`
- etc.

### Step 4: Test

1. Start your backend
2. Set `EXPO_PUBLIC_USE_MOCK_DATA=false`
3. Test API calls

## Troubleshooting

### Issue: API calls return errors

**Solution**: Check if backend is running and EXPO_PUBLIC_API_URL is correct

### Issue: Mock data not working

**Solution**: Ensure `EXPO_PUBLIC_USE_MOCK_DATA=true` in .env

### Issue: Token refresh fails

**Solution**: Check refresh token endpoint implementation on backend

### Issue: CORS errors (web)

**Solution**: Configure CORS on backend to allow your app's origin

## Security

- **Tokens**: Stored in secure storage (Keychain on iOS, Keystore on Android)
- **HTTPS**: Always use HTTPS in production
- **Token Expiry**: Implement short-lived access tokens with refresh tokens
- **Validation**: Always validate data on both client and server

## Performance

- **Caching**: Consider implementing Redux caching for frequently accessed data
- **Pagination**: Use pagination for large data sets
- **Debouncing**: Debounce search/filter API calls
- **Optimistic Updates**: Update UI immediately, sync with server in background
