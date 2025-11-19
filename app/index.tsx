import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAppSelector } from '../src/store/hooks';

export default function Index() {
  const { user, token, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Wait for auth to load from persisted state
    if (!isLoading) {
      if (user && token) {
        // User is authenticated, navigate to main app
        router.replace('/(tabs)');
      } else {
        // User is not authenticated, navigate to welcome
        router.replace('/auth/welcome');
      }
    }
  }, [user, token, isLoading]);

  // Show loading screen while checking auth status
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#8B5CF6" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
