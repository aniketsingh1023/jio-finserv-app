import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { Icon } from '@/components/Icon';
import { GlobalHeader } from '@/components/GlobalHeader';


export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      {/* Header - Visible on all tab screens */}
      <GlobalHeader />

      {/* bottom nav */}
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
              height: Platform.OS === 'ios' ? 70 + insets.bottom : 65,
            },
          ],
          tabBarLabel: '',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Icon name="home" size={32} color={color} />,
          }}
        />

        <Tabs.Screen
          name="about"
          options={{
            title: 'About',
            tabBarIcon: ({ color }) => <Icon name="info" size={32} color={color} />,
          }}
        />

        <Tabs.Screen
          name="emi-calculator"
          options={{
            title: 'EMI Calculator',
            tabBarIcon: ({ color }) => <Icon name="calculator" size={32} color={color} />,
          }}
        />

        <Tabs.Screen
          name="contact"
          options={{
            title: 'Contact',
            tabBarIcon: ({ color }) => <Icon name="phone" size={32} color={color} />,
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <Icon name="profile" size={32} color={color} />,
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
    paddingTop: 12,
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
});
