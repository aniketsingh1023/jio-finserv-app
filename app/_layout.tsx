import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/colors';
import { AuthProvider } from '@/store/authStore';

// Keep splash screen visible while we load critical resources
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Hide splash screen after brief delay for smooth transition
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <Stack
            screenOptions={{
              contentStyle: {
                backgroundColor: Colors.background,
              },
            }}
          >
            {/* Tab Navigation - This is the main entry point */}
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />

            {/* Auth Screens */}
            <Stack.Screen
            name="auth/login"
            options={{
              title: 'Login',
              headerShown: true,
              headerStyle: {
                backgroundColor: Colors.white,
              },
              headerTintColor: Colors.primary,
              headerTitleStyle: {
                fontWeight: '600',
              },
            }}
          />

          <Stack.Screen
            name="auth/signup"
            options={{
              title: 'Sign Up',
              headerShown: true,
              headerStyle: {
                backgroundColor: Colors.white,
              },
              headerTintColor: Colors.primary,
              headerTitleStyle: {
                fontWeight: '600',
              },
            }}
          />

          {/* Loan Detail Screens */}
          <Stack.Screen
            name="loans/personal"
            options={{
              title: 'Personal Loans',
              headerShown: true,
              headerStyle: {
                backgroundColor: Colors.white,
              },
              headerTintColor: Colors.primary,
            }}
          />

          <Stack.Screen
            name="loans/home"
            options={{
              title: 'Home Loans',
              headerShown: true,
              headerStyle: {
                backgroundColor: Colors.white,
              },
              headerTintColor: Colors.primary,
            }}
          />

          <Stack.Screen
            name="loans/auto"
            options={{
              title: 'Auto Loans',
              headerShown: true,
              headerStyle: {
                backgroundColor: Colors.white,
              },
              headerTintColor: Colors.primary,
            }}
          />

          <Stack.Screen
            name="loans/business"
            options={{
              title: 'Business Loans',
              headerShown: true,
              headerStyle: {
                backgroundColor: Colors.white,
              },
              headerTintColor: Colors.primary,
            }}
          />

          <Stack.Screen
            name="loans/education"
            options={{
              title: 'Education Loans',
              headerShown: true,
              headerStyle: {
                backgroundColor: Colors.white,
              },
              headerTintColor: Colors.primary,
            }}
          />

          <Stack.Screen
            name="modal"
            options={{
              presentation: 'modal',
              title: 'Modal',
            }}
          />
        </Stack>
        <StatusBar style="auto" />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
