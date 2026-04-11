import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { Icon } from '@/components/Icon';
import { GlobalHeader } from '@/components/GlobalHeader';

/**
 * Tab Layout with Global Header and Bottom Navigation
 * Provides persistent header and tab navigation across all screens
 */
export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      {/* Global Header - Visible on all tab screens */}
      <GlobalHeader />

      {/* Tab Navigation with persistent bottom nav */}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textTertiary,
          headerShown: false,
          tabBarStyle: [
            styles.tabBar,
            {
              borderTopColor: Colors.border,
              paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8,
              height: Platform.OS === 'ios' ? 80 + insets.bottom : 60,
            },
          ],
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => <Icon name="home" size={24} color={color} />,
          }}
        />

        <Tabs.Screen
          name="about"
          options={{
            title: 'About',
            tabBarLabel: 'About',
            tabBarIcon: ({ color }) => <Icon name="info" size={24} color={color} />,
          }}
        />

        <Tabs.Screen
          name="emi-calculator"
          options={{
            title: 'EMI Calculator',
            tabBarLabel: 'EMI',
            tabBarIcon: ({ color }) => <Icon name="calculator" size={24} color={color} />,
          }}
        />

        <Tabs.Screen
          name="contact"
          options={{
            title: 'Contact',
            tabBarLabel: 'Contact',
            tabBarIcon: ({ color }) => <Icon name="phone" size={24} color={color} />,
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color }) => <Icon name="profile" size={24} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    paddingTop: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
});
