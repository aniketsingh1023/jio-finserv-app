import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Colors } from '../../constants/colors';

interface HeaderProps {
  onGetStartedPress?: () => void;
  showSearch?: boolean;
  onSearchChange?: (text: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onGetStartedPress,
  showSearch = false,
  onSearchChange,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.logo}>Jio Finserv</Text>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={onGetStartedPress}
          activeOpacity={0.7}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      </View>
      
      {showSearch && (
        <TextInput
          style={styles.searchInput}
          placeholder="Search loans..."
          placeholderTextColor={Colors.textTertiary}
          onChangeText={onSearchChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingTop: Platform.OS === 'ios' ? 12 : 8,
  },
  topRow: {
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
  getStartedButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  getStartedText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  searchInput: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.surfaceDark,
    borderRadius: 8,
    fontSize: 14,
    color: Colors.textPrimary,
  },
});
