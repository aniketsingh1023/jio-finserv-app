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

interface BenefitItem {
  id: string;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  { id: '1', label: 'Interest Rate', value: 'Starting from 8.50% p.a.' },
  { id: '2', label: 'Loan Amount', value: 'Up to ₹75 Lakhs' },
  { id: '3', label: 'Tenure', value: 'Up to 15 years' },
  { id: '4', label: 'Processing Fee', value: '1%' },
  { id: '5', label: 'Moratorium', value: 'Study period + 6 months' },
  { id: '6', label: 'Collateral', value: 'Not required up to ₹7.5 Lakhs' },
];

const benefits: BenefitItem[] = [
  {
    id: '1',
    title: 'Moratorium Period',
    description: 'Start repayment after course completion with an added grace period.',
  },
  {
    id: '2',
    title: 'Complete Coverage',
    description: 'Covers tuition fees, living expenses, books, and equipment.',
  },
  {
    id: '3',
    title: 'Tax Benefits',
    description: 'Claim interest deduction benefits under Section 80E.',
  },
  {
    id: '4',
    title: 'Global Studies Support',
    description: 'Finance education in India as well as abroad.',
  },
];

const requirements = [
  'Aadhaar Card',
  'PAN Card',
  'Admission letter from recognized institution',
  'Fee structure or course expense details',
  'Recent bank statements',
  'Address proof',
  'Co-applicant income proof, if required',
];

const highlights = [
  'Covers studies in India and abroad',
  'Tuition fees, living costs, books, and equipment covered',
  'Built for long-term repayment comfort',
];

export default function EducationLoanScreen() {
  const router = useRouter();

  const handleApply = () => {
    router.push('/auth/login');
  };

  const handleCalculateEMI = () => {
    router.push('/(tabs)/emi-calculator');
  };

  const renderFeatureItem = ({ item }: { item: FeatureItem }) => (
    <View style={styles.featureItem}>
      <View style={styles.featureLabel}>
        <Text style={styles.featureLabelText}>{item.label}</Text>
      </View>
      <Text style={styles.featureValue}>{item.value}</Text>
    </View>
  );

  const renderBenefitItem = ({ item }: { item: BenefitItem }) => (
    <View style={styles.benefitItem}>
      <View style={styles.benefitIconWrap}>
        <Icon name="check" size={18} color={Colors.primary} />
      </View>
      <View style={styles.benefitContent}>
        <Text style={styles.benefitLabel}>{item.title}</Text>
        <Text style={styles.benefitDesc}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.heroSection}>
        <View style={styles.heroIcon}>
          <Icon name="education-loan" size={48} color={Colors.white} />
        </View>

        <Text style={styles.heroTitle}>Education Loan</Text>

        <Text style={styles.heroSubtitle}>
          Invest in your future
        </Text>

        <Text style={styles.heroDescription}>
          Don&apos;t let finances come in the way of your education. Cover tuition
          fees, living expenses, and more for studies in India and abroad.
        </Text>

        <View style={styles.heroStatsRow}>
          <View style={styles.heroStatCard}>
            <Text style={styles.heroStatValue}>8.50%</Text>
            <Text style={styles.heroStatLabel}>Starting Rate</Text>
          </View>

          <View style={styles.heroStatCard}>
            <Text style={styles.heroStatValue}>₹75L</Text>
            <Text style={styles.heroStatLabel}>Max Amount</Text>
          </View>

          <View style={styles.heroStatCard}>
            <Text style={styles.heroStatValue}>15Y</Text>
            <Text style={styles.heroStatLabel}>Max Tenure</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Features</Text>
        <FlatList
          data={features}
          renderItem={renderFeatureItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          nestedScrollEnabled={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Benefits</Text>
        <FlatList
          data={benefits}
          renderItem={renderBenefitItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          nestedScrollEnabled={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why This Loan Stands Out</Text>
        <View style={styles.requirementsBox}>
          {highlights.map((item, idx) => (
            <View key={idx} style={styles.requirementItem}>
              <Icon name="check" size={16} color={Colors.primary} />
              <Text style={styles.requirementText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Documents Required</Text>
        <View style={styles.requirementsBox}>
          {requirements.map((req, idx) => (
            <View key={idx} style={styles.requirementItem}>
              <Icon name="check" size={16} color={Colors.primary} />
              <Text style={styles.requirementText}>{req}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApply}
          activeOpacity={0.8}
        >
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.calculateButton}
          onPress={handleCalculateEMI}
          activeOpacity={0.8}
        >
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
    paddingBottom: 110,
  },
  heroSection: {
    backgroundColor: Colors.primary,
    paddingTop: 36,
    paddingBottom: 30,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  heroIcon: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 10,
  },
  heroDescription: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.95,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 20,
  },
  heroStatsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  heroStatCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  heroStatValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 4,
  },
  heroStatLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  section: {
    marginTop: 24,
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
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureLabel: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surfaceDark,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
  },
  featureLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  featureValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    lineHeight: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  benefitIconWrap: {
    marginTop: 2,
  },
  benefitContent: {
    flex: 1,
  },
  benefitLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  benefitDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  requirementsBox: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  requirementText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '500',
    lineHeight: 19,
  },
  ctaContainer: {
    paddingHorizontal: 16,
    marginTop: 28,
    gap: 12,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  applyButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  calculateButtonText: {
    color: Colors.darkCharcoal,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  bottomSpacing: {
    height: 24,
  },
});