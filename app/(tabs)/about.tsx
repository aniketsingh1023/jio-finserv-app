import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { Icon } from '@/components/Icon';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>About Jio Finserv</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Mission Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.sectionText}>
            To provide accessible, affordable, and reliable financial services to individuals 
            and businesses across India, empowering them to achieve their dreams and aspirations.
          </Text>
        </View>

        {/* Vision Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Vision</Text>
          <Text style={styles.sectionText}>
            To become the most trusted fintech partner in India, delivering innovative 
            financial solutions with transparency and customer-centric approach.
          </Text>
        </View>

        {/* Values Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Values</Text>
          <ValueItem iconName="support" title="Trust" desc="We build relationships based on trust" />
          <ValueItem iconName="info" title="Innovation" desc="We embrace technology and innovation" />
          <ValueItem iconName="speed" title="Speed" desc="Fast approvals and quick disbursals" />
          <ValueItem iconName="security" title="Security" desc="Your data is our responsibility" />
          <ValueItem iconName="profile" title="Customer First" desc="Your satisfaction is our priority" />
        </View>

        {/* Why Choose Us */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose Us?</Text>
          <HighlightItem text="10+ years of experience in financial services" />
          <HighlightItem text="₹500+ crore loans disbursed" />
          <HighlightItem text="5-star rating from 50,000+ customers" />
          <HighlightItem text="24/7 customer support" />
          <HighlightItem text="Transparent pricing with no hidden charges" />
        </View>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const ValueItem = ({ iconName, title, desc }: { iconName: string; title: string; desc: string }) => (
  <View style={styles.valueItem}>
    <Icon name={iconName as any} size={24} color={Colors.primary} />
    <View style={styles.valueContent}>
      <Text style={styles.valueTitle}>{title}</Text>
      <Text style={styles.valueDesc}>{desc}</Text>
    </View>
  </View>
);

const HighlightItem = ({ text }: { text: string }) => (
  <View style={styles.highlightItem}>
    <Icon name="check" size={16} color={Colors.primary} />
    <Text style={styles.highlightText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.white,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  valueItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'flex-start',
  },
  valueContent: {
    flex: 1,
  },
  valueTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  valueDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  highlightItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  highlightText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    flex: 1,
  },
  bottomSpacing: {
    height: 80,
  },
});
