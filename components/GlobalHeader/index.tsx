import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
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
  const screenWidth = Dimensions.get('window').width;

  const { user } = useAuth();

  // Responsive sizing based on screen width
  const isSmallScreen = screenWidth < 375;
  const isExtraSmall = screenWidth < 340;
  const logoWidth = isExtraSmall ? 70 : isSmallScreen ? 90 : screenWidth < 420 ? 100 : 120;
  const logoHeight = isExtraSmall ? 25 : isSmallScreen ? 30 : screenWidth < 420 ? 35 : 40;
  const buttonFontSize = isExtraSmall ? 10 : isSmallScreen ? 11 : 12;
  const buttonPaddingH = isExtraSmall ? 8 : isSmallScreen ? 10 : 14;
  const buttonPaddingV = isExtraSmall ? 5 : isSmallScreen ? 6 : 8;
  const headerPaddingH = isSmallScreen ? 8 : 12;

  const handlePress = () => {
    if (user) {
      router.push('/applications/new'); // Apply flow
    } else {
      router.push('/auth/login'); // Login screen
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={[styles.content, { paddingHorizontal: headerPaddingH }]}>
        <Image
          source={require('../../assets/images/logoimg.jpeg')}
          style={[
            styles.logo,
            { width: logoWidth, height: logoHeight },
          ]}
          resizeMode="contain"
        />

        <TouchableOpacity
          style={[
            styles.button,
            {
              paddingHorizontal: buttonPaddingH,
              paddingVertical: buttonPaddingV,
            },
          ]}
          onPress={handlePress}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, { fontSize: buttonFontSize }]}>
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
    width: 120,
    height: 40,
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