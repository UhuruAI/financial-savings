import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Financial Savings',
  slug: 'financial-savings',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './src/assets/images/icon.png',
  scheme: 'financialsavings',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './src/assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#0F172A',
  },
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: process.env.EXPO_PUBLIC_IOS_BUNDLE_ID || 'com.financialsavings.app',
    buildNumber: '1',
    infoPlist: {
      NSCameraUsageDescription: 'Allow $(PRODUCT_NAME) to access your camera to scan receipts.',
      NSPhotoLibraryUsageDescription: 'Allow $(PRODUCT_NAME) to access your photos to attach receipts.',
      NSFaceIDUsageDescription: 'Allow $(PRODUCT_NAME) to use Face ID for secure authentication.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './src/assets/images/adaptive-icon.png',
      backgroundColor: '#0F172A',
    },
    package: process.env.EXPO_PUBLIC_ANDROID_PACKAGE || 'com.financialsavings.app',
    versionCode: 1,
    permissions: [
      'android.permission.CAMERA',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.USE_BIOMETRIC',
      'android.permission.USE_FINGERPRINT',
    ],
  },
  web: {
    bundler: 'metro',
    output: 'single',
    favicon: './src/assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-camera',
      {
        cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera to scan receipts.',
      },
    ],
    [
      'expo-secure-store',
      {
        faceIDPermission: 'Allow $(PRODUCT_NAME) to access Face ID for biometric authentication.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    environment: process.env.EXPO_PUBLIC_ENV || 'development',
    sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    enableBiometric: process.env.EXPO_PUBLIC_ENABLE_BIOMETRIC === 'true',
    enableInvestments: process.env.EXPO_PUBLIC_ENABLE_INVESTMENTS === 'true',
    eas: {
      projectId: process.env.EAS_PROJECT_ID || 'your-project-id',
    },
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: 'https://u.expo.dev/your-project-id',
  },
  runtimeVersion: {
    policy: 'sdkVersion',
  },
  hooks: {
    postPublish: [
      {
        file: 'sentry-expo/upload-sourcemaps',
        config: {
          organization: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,
          authToken: process.env.SENTRY_AUTH_TOKEN,
        },
      },
    ],
  },
});
