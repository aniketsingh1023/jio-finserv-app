import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { Icon } from '@/components/Icon';

interface LoanCardProps {
  id: string;
  iconName: string;
  title: string;
  description: string;
  onExploreMore?: () => void;
}

export const LoanCard: React.FC<LoanCardProps> = ({
  iconName,
  title,
  description,
  onExploreMore,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onExploreMore}
      activeOpacity={0.75}
    >
      {/* Icon Container */}
      <View style={styles.iconContainer}>
        <Icon name={iconName} size={28} color={Colors.darkCharcoal} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      {/* Explore More Button */}
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={onExploreMore}
        activeOpacity={0.7}
      >
        <Text style={styles.exploreText}>Explore</Text>
        <Icon name="arrow-right" size={16} color={Colors.white} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginRight: 12,
    width: 290,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'column',
    justifyContent: 'space-between',
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  content: {
    flex: 1,
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    fontWeight: '400',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 6,
  },
  exploreText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
