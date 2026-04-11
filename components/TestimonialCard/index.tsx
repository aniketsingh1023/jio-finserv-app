import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Icon } from '../Icon';

interface TestimonialCardProps {
  name: string;
  role: string;
  testimonial: string;
  rating: number;
  avatarIcon?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  testimonial,
  rating,
  avatarIcon = 'profile',
}) => {
  const renderStars = () => {
    return [...Array(5)].map((_, i) => (
      <Text key={i} style={[styles.star, i < rating && styles.starFilled]}>
        ★
      </Text>
    ));
  };

  return (
    <View style={styles.container}>
      {/* Quote Icon */}
      <Text style={styles.quoteIcon}>"</Text>

      {/* Testimonial Text */}
      <Text style={styles.testimonial} numberOfLines={3}>
        {testimonial}
      </Text>

      {/* Stars */}
      <View style={styles.starsContainer}>
        {renderStars()}
      </View>

      {/* Author Info */}
      <View style={styles.authorContainer}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Icon name={avatarIcon as any} size={20} color={Colors.primary} />
        </View>

        {/* Name and Role */}
        <View style={styles.authorInfo}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.role}>{role}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 300,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  quoteIcon: {
    fontSize: 32,
    color: Colors.primary,
    opacity: 0.2,
    marginBottom: 8,
  },
  testimonial: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 12,
  },
  star: {
    fontSize: 14,
    color: Colors.lightGray,
  },
  starFilled: {
    color: Colors.accent,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.darkCharcoal,
  },
  authorInfo: {
    flex: 1,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  role: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
});
