# Financial Savings - Personal Finance & Investment App

A modern, full-featured personal finance and investment mobile application built with React Native and Expo.

## 📱 Features

- **💰 Savings Goals**: Create and track multiple savings goals with visual progress indicators
- **💳 Wallet Management**: Manage virtual cards, view balances, and track transactions
- **📊 Investment Portfolio**: Track investments in stocks, ETFs, crypto, and bonds
- **📈 Analytics**: Comprehensive financial analytics and spending insights
- **🎯 Achievements**: Gamified experience with unlockable achievements
- **🔒 Secure**: Biometric authentication, encrypted storage, and secure API communication
- **🎨 Beautiful UI**: Modern dark theme with smooth animations and gradients

## 🏗️ Architecture

```
financial-savings/
├── src/
│   ├── api/              # API client and service modules
│   │   ├── client.ts     # Axios instance with interceptors
│   │   ├── auth.ts       # Authentication endpoints
│   │   ├── goals.ts      # Goals endpoints
│   │   └── index.ts      # API exports
│   ├── components/       # Reusable UI components
│   ├── constants/        # App constants and theme
│   │   ├── theme.ts      # Colors, spacing, fonts
│   │   └── index.ts      # App config, endpoints, categories
│   ├── hooks/            # Custom React hooks
│   ├── screens/          # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── GoalsScreen.tsx
│   │   ├── WalletScreen.tsx
│   │   ├── InvestScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── services/         # Business logic services
│   ├── store/            # Redux store and slices
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
│       ├── storage.ts    # AsyncStorage & SecureStore helpers
│       ├── validation.ts # Input validation functions
│       └── formatting.ts # Data formatting utilities
├── app/                  # Expo Router file-based routing
│   ├── (tabs)/          # Tab navigation screens
│   └── _layout.tsx      # Root layout
├── app.config.ts         # Expo configuration
├── .env.example          # Environment variables template
├── package.json
└── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac only) or Android Emulator
- Physical device with Expo Go app (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/financial-savings.git
   cd financial-savings
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your API keys and configuration:
   ```env
   EXPO_PUBLIC_API_URL=http://localhost:3000/api
   EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   # Add other variables as needed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   npm start
   ```

5. **Run on your preferred platform**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on physical device

## 📦 Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run build:android` - Build Android APK/AAB with EAS
- `npm run build:ios` - Build iOS IPA with EAS
- `npm run build:web` - Build for web deployment
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run type-check` - Run TypeScript type checking

## 🔧 Configuration

### Backend Setup

This app requires a backend API. You have several options:

#### Option 1: Backend-as-a-Service (Recommended for MVP)

**Using Supabase:**
```bash
# Install Supabase client
npm install @supabase/supabase-js

# Configure in src/api/client.ts
```

**Using Firebase:**
```bash
# Install Firebase
npm install firebase

# Configure in src/api/client.ts
```

#### Option 2: Custom Backend

Set up your own backend with:
- Node.js + Express/NestJS
- PostgreSQL/MongoDB database
- JWT authentication
- RESTful API

Update `EXPO_PUBLIC_API_URL` in `.env` to point to your backend.

### Third-Party Integrations

#### Stripe (Payments)
```bash
npm install @stripe/stripe-react-native
```

Add to `.env`:
```env
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

#### Plaid (Banking)
```bash
npm install react-native-plaid-link-sdk
```

#### Sentry (Error Tracking)
```bash
npm install @sentry/react-native
npx sentry-wizard -i reactNative -p ios android
```

## 🧪 Testing

Run tests with:
```bash
npm run test
```

Generate coverage report:
```bash
npm run test:coverage
```

## 📱 Building for Production

### Using EAS Build (Recommended)

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure EAS**
   ```bash
   eas build:configure
   ```

4. **Build for Android**
   ```bash
   eas build --platform android
   ```

5. **Build for iOS**
   ```bash
   eas build --platform ios
   ```

### App Store Submission

#### iOS (Apple App Store)
1. Create app in App Store Connect
2. Generate required screenshots
3. Submit for review

#### Android (Google Play)
1. Create app in Google Play Console
2. Upload AAB file
3. Complete store listing
4. Submit for review

## 🔐 Security Considerations

- All sensitive data is stored using `expo-secure-store`
- API tokens are stored securely in keychain
- Biometric authentication for app access
- SSL/TLS for API communication
- Input validation on all forms
- XSS and SQL injection prevention

## 🎨 Theming

Colors and styles are centralized in `src/constants/theme.ts`:

```typescript
import { COLORS, SPACING, FONT_SIZES } from '@/constants';

// Use in components
style={{
  backgroundColor: COLORS.primary,
  padding: SPACING.lg,
  fontSize: FONT_SIZES.xl
}}
```

## 📝 Environment Variables

Required environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `EXPO_PUBLIC_API_URL` | Backend API URL | Yes |
| `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | For payments |
| `EXPO_PUBLIC_PLAID_PUBLIC_KEY` | Plaid public key | For banking |
| `EXPO_PUBLIC_SENTRY_DSN` | Sentry DSN | For error tracking |
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase URL | If using Supabase |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | If using Supabase |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues

- [ ] Investment data is currently mock data
- [ ] Payment integration not yet implemented
- [ ] Bank account linking requires Plaid setup
- [ ] Push notifications need configuration

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Project structure and architecture
- ✅ UI/UX design implementation
- ⏳ Authentication system
- ⏳ Backend integration

### Phase 2
- [ ] Real-time data synchronization
- [ ] Payment processing
- [ ] Bank account linking
- [ ] Investment API integration

### Phase 3
- [ ] Advanced analytics
- [ ] Budget planning features
- [ ] Bill reminders
- [ ] Recurring transactions

### Phase 4
- [ ] Social features
- [ ] Family accounts
- [ ] Export/import data
- [ ] Multi-currency support

## 📞 Support

For support, email support@financialsavings.com or open an issue in the GitHub repository.

## 🙏 Acknowledgments

- [Expo](https://expo.dev) - React Native framework
- [Lucide Icons](https://lucide.dev) - Beautiful icon library
- [Redux Toolkit](https://redux-toolkit.js.org) - State management
- [React Hook Form](https://react-hook-form.com) - Form handling

---

Built with ❤️ using React Native and Expo
