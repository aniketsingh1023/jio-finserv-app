import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/colors';
import { AuthProvider, useAuth } from '@/store/authStore';

// Keep splash screen visible while we load critical resources
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const { restoreSession, isSessionRestored } = useAuth();

  useEffect(() => {
    // Restore session on app startup
    restoreSession().then(() => {
      // Hide splash screen after session is restored
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 500);
    });
  }, [restoreSession]);

  return (
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

      {/* Loan Application Screens */}
      <Stack.Screen
        name="applications/new"
        options={{
          title: 'New Loan Application',
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors.white,
          },
          headerTintColor: Colors.primary,
        }}
      />

      <Stack.Screen
        name="profile/edit"
        options={{
          title: 'Edit Profile',
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors.white,
          },
          headerTintColor: Colors.primary,
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
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <RootLayoutContent />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

          