import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Icon } from '@/components/Icon';

interface FeatureItem {
  id: string;
  label: string;
  value: string;
}

const features: FeatureItem[] = [
  { id: '1', label: 'Loan Amount', value: '₹10,000 - ₹50,00,000' },
  { id: '2', label: 'Interest Rate', value: '8% - 18% per annum' },
  { id: '3', label: 'Tenure', value: '1 - 7 years' },
  { id: '4', label: 'Processing Time', value: '24 hours' },
];

const benefits: FeatureItem[] = [
  { id: '1', label: 'Quick Approval', value: 'Get approved in 24 hours' },
  { id: '2', label: 'Flexible Repayment', value: 'Customized EMI options' },
  { id: '3', label: 'Low Documentation', value: 'Minimal paperwork required' },
  { id: '4', label: 'No Hidden Charges', value: 'Transparent pricing' },
];

const requirements = [
  'Indian citizen aged 23-60 years',
  'Steady income for past 2 years',
  'Valid PAN card & Aadhar',
  'Bank statements (6 months)',
  'Income proof (salary slip/ITR)',
];

export default function PersonalLoanScreen() {
  const router = useRouter();

  const handleApply = () => {
    router.push('/auth/login');
  };

  const handleCalculateEMI = () => {
    router.push('/(tabs)/emi-calculator');
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroIcon}>
          <Icon name="personal-loan" size={48} color={Colors.white} />
        </View>
        <Text style={styles.heroTitle}>Personal Loans</Text>
        <Text style={styles.heroSubtitle}>
          Fast approval • Flexible repayment • Transparent pricing
        </Text>
      </View>

      {/* Key Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Features</Text>
        <FlatList
          data={features}
          renderItem={({ item }) => (
            <View style={styles.featureItem}>
              <View style={styles.featureLabel}>
                <Text style={styles.featureLabelText}>{item.label}</Text>
              </View>
              <Text style={styles.featureValue}>{item.value}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          nestedScrollEnabled={false}
        />
      </View>

      {/* Main Benefits */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose Our Personal Loans?</Text>
        <FlatList
          data={benefits}
          renderItem={({ item }) => (
            <View style={styles.benefitItem}>
              <Icon name="check" size={20} color={Colors.primary} />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitLabel}>{item.label}</Text>
                <Text style={styles.benefitDesc}>{item.value}</Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          nestedScrollEnabled={false}
        />
      </View>

      {/* Requirements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Eligibility Requirements</Text>
        <View style={styles.requirementsBox}>
          {requirements.map((req, idx) => (
            <View key={idx} style={styles.requirementItem}>
              <Icon name="check" size={16} color={Colors.primary} />
              <Text style={styles.requirementText}>{req}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA Buttons */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApply}
          activeOpacity={0.7}
        >
          <Icon name="arrow-right" size={20} color={Colors.white} />
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.calculateButton}
          onPress={handleCalculateEMI}
          activeOpacity={0.7}
        >
          <Icon name="calculator" size={20} color={Colors.darkCharcoal} />
          <Text style={styles.calculateButtonText}>Calculate EMI</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroSection: {
    backgroundColor: Colors.primary,
    paddingVertical: 36,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  heroSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginVertical: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.darkCharcoal,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  featureItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureLabel: {
    backgroundColor: Colors.surfaceDark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  featureLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  featureValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  benefitContent: {
    flex: 1,
  },
  benefitLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  benefitDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  requirementsBox: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  requirementText: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
  },
  ctaContainer: {
    flexDirection: 'column',
    gap: 12,
    paddingHorizontal: 16,
    marginVertical: 24,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  applyButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  calculateButtonText: {
    color: Colors.darkCharcoal,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bottomSpacing: {
    height: 20,
  },
});
