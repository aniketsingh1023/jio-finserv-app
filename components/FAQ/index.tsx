import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
} from 'react-native';
import { Colors } from '../../constants/colors';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

export const FAQ: React.FC<FAQProps> = ({ items }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    if (Platform.OS !== 'web') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const isExpanded = expandedId === item.id;
        return (
          <View key={item.id} style={styles.faqItem}>
            <TouchableOpacity
              style={styles.questionContainer}
              onPress={() => toggleExpand(item.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.question}>{item.question}</Text>
              <Text style={[
                styles.chevron,
                isExpanded && styles.chevronOpen,
              ]}>
                ▼
              </Text>
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.answerContainer}>
                <Text style={styles.answer}>{item.answer}</Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  faqItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  question: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  chevron: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '700',
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  answerContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surfaceDark,
  },
  answer: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
