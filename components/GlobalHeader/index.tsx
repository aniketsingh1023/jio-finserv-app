import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/store/authStore'; 

/**
 * Global Header Component
 */
export const GlobalHeader: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();


  const { user } = useAuth();

  const handlePress = () => {
    if (user) {
      router.push('/applications/new'); // Apply flow
    } else {
      router.push('/auth/login'); // Login screen
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <View style={styles.content}>
        <Text style={styles.logo}>Jio Finserv</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handlePress}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>
            {user ? 'Apply Now' : 'Sign in'}
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
});