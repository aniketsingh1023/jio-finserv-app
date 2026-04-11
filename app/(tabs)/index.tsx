import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Header } from '@/components/Header';
import { Carousel } from '@/components/Carousel';
import { LoanCard } from '@/components/LoanCard';
import { FeatureCard } from '@/components/FeatureCard';
import { TestimonialCard } from '@/components/TestimonialCard';
import { FAQ } from '@/components/FAQ';

const { width: screenWidth } = Dimensions.get('window');

// ─── Types ───────────────────────────────────────────────────────────────────

interface CarouselItem {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
  buttonText: string;
  route: string;
}

interface LoanItem {
  id: string;
  iconName: string;
  title: string;
  description: string;
  route: string;
}

interface FeatureItem {
  id: string;
  iconName: string;
  title: string;
  description: string;
}

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  testimonial: string;
  rating: number;
  avatarIcon?: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const carouselData: CarouselItem[] = [
  {
    id: '1',
    title: 'Personal Loans',
    description: 'Quick approvals, low interest rates',
    backgroundColor: '#D58F16',
    buttonText: 'Apply Now',
    route: '/loans/personal',
  },
  {
    id: '2',
    title: 'Home Loans',
    description: 'Make your dream home a reality',
    backgroundColor: '#F1B643',
    buttonText: 'Apply Now',
    route: '/loans/home',
  },
  {
    id: '3',
    title: 'Auto Loans',
    description: 'Drive your dream car today',
    backgroundColor: '#CDC58E',
    buttonText: 'Apply Now',
    route: '/loans/auto',
  },
  {
    id: '4',
    title: 'Business Loans',
    description: 'Grow your business with us',
    backgroundColor: '#BDBBBC',
    buttonText: 'Apply Now',
    route: '/loans/business',
  },
  {
    id: '5',
    title: 'Education Loans',
    description: 'Invest in your future',
    backgroundColor: '#252A39',
    buttonText: 'Apply Now',
    route: '/loans/education',
  },
];

const loanData: LoanItem[] = [
  {
    id: '1',
    iconName: 'personal-loan',
    title: 'Personal Loans',
    description: 'Flexible loans for your personal needs',
    route: '/loans/personal',
  },
  {
    id: '2',
    iconName: 'home-loan',
    title: 'Home Loans',
    description: 'Affordable home financing solutions',
    route: '/loans/home',
  },
  {
    id: '3',
    iconName: 'auto-loan',
    title: 'Auto Loans',
    description: 'Quick car financing options',
    route: '/loans/auto',
  },
  {
    id: '4',
    iconName: 'business-loan',
    title: 'Business Loans',
    description: 'Support your entrepreneurial dreams',
    route: '/loans/business',
  },
];

const featureData: FeatureItem[] = [
  {
    id: '1',
    iconName: 'speed',
    title: 'Quick Approval',
    description: 'Get approved in just 24 hours',
  },
  {
    id: '2',
    iconName: 'money',
    title: 'Low Interest',
    description: 'Competitive rates for your loans',
  },
  {
    id: '3',
    iconName: 'security',
    title: 'Secure & Safe',
    description: 'Your data is protected',
  },
  {
    id: '4',
    iconName: 'phone-call',
    title: '24/7 Support',
    description: 'We are always here to help',
  },
];

const testimonialData: TestimonialItem[] = [
  {
    id: '1',
    name: 'Raj Kumar',
    role: 'Small Business Owner',
    testimonial:
      'Jio Finserv made it incredibly easy to get financing for my business. Highly recommended!',
    rating: 5,
    avatarIcon: 'profile',
  },
  {
    id: '2',
    name: 'Priya Singh',
    role: 'Home Buyer',
    testimonial:
      'The best home loan experience I ever had. Quick process and great support!',
    rating: 5,
    avatarIcon: 'profile',
  },
  {
    id: '3',
    name: 'Amit Patel',
    role: 'Professional',
    testimonial:
      'Fast approval and competitive rates. I am very satisfied with their service.',
    rating: 4,
    avatarIcon: 'profile',
  },
  {
    id: '4',
    name: 'Neha Desai',
    role: 'Student',
    testimonial:
      'Got my education loan approved quickly. The team was very helpful throughout.',
    rating: 5,
    avatarIcon: 'profile',
  },
];

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'What is the minimum loan amount I can apply for?',
    answer:
      'The minimum loan amount starts from ₹10,000 and can go up to ₹50,00,000 depending on your eligibility and loan type.',
  },
  {
    id: '2',
    question: 'How long does the approval process take?',
    answer:
      'Most of our loans are approved within 24 hours. In some cases, it may take up to 48 hours based on documentation verification.',
  },
  {
    id: '3',
    question: 'What are the eligibility criteria?',
    answer:
      'You must be 21 years or older, have a stable income, and a good credit score. Visit our detailed eligibility page for more information.',
  },
  {
    id: '4',
    question: 'Can I prepay my loan?',
    answer:
      'Yes! We allow prepayment without any penalty. You can repay your loan anytime you want.',
  },
  {
    id: '5',
    question: 'How do I apply for a loan?',
    answer:
      'Simply download our app, fill in your details, upload the necessary documents, and submit your application. It takes less than 5 minutes!',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();

  const handleGetStartedPress = () => {
    router.push('/auth/login');
  };

  const handleApplyNow = (route?: string) => {
    router.push(route || '/auth/login');
  };

  const handleCalculateEMI = () => {
    router.push('/(tabs)/emi-calculator');
  };

  const handleExploreMore = (loan: LoanItem) => {
    router.push(loan.route || '/(tabs)/emi-calculator');
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>50K+</Text>
          <Text style={styles.statLabel}>Happy Customers</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>₹500Cr+</Text>
          <Text style={styles.statLabel}>Loans Disbursed</Text>
        </View>
      </View>

      {/* Carousel */}
      <View style={styles.section}>
        <Carousel
          data={carouselData}
          onApplyPress={(item) => handleApplyNow(item.route)}
          onCalculatePress={handleCalculateEMI}
        />
      </View>

      {/* Loans We Provide */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Loans We Provide</Text>
        <FlatList
          data={loanData}
          renderItem={({ item }) => (
            <LoanCard
              id={item.id}
              iconName={item.iconName}
              title={item.title}
              description={item.description}
              onExploreMore={() => handleExploreMore(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          scrollEventThrottle={16}
        />
      </View>

      {/* Why Choose Us */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose Us?</Text>
        <View style={styles.featureGrid}>
          {featureData.map((item) => (
            <FeatureCard
              key={item.id}
              iconName={item.iconName}
              title={item.title}
              description={item.description}
            />
          ))}
        </View>
      </View>

      {/* Testimonials */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What Our Customers Say</Text>
        <FlatList
          data={testimonialData}
          renderItem={({ item }) => (
            <TestimonialCard
              name={item.name}
              role={item.role}
              testimonial={item.testimonial}
              rating={item.rating}
              avatarIcon={item.avatarIcon}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          scrollEventThrottle={16}
        />
      </View>

      {/* FAQ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <View style={styles.faqPadding}>
          <FAQ items={faqData} />
        </View>
      </View>

      {/* Primary CTA Button */}
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => handleApplyNow()}
        activeOpacity={0.7}
      >
        <Text style={styles.ctaButtonText}>Apply Now</Text>
      </TouchableOpacity>

      {/* Footer CTA */}
      <View style={styles.footerCTA}>
        <Text style={styles.footerText}>Ready to get started?</Text>
        <Text style={styles.footerSubtext}>
          Apply for a loan in less than 5 minutes
        </Text>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 90,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginVertical: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },

  // Sections
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.darkCharcoal,
    marginHorizontal: 16,
    marginBottom: 16,
    textAlign: 'left',
    letterSpacing: 0.3,
  },

  // Lists
  listContent: {
    paddingHorizontal: 16,
  },

  // Features grid
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 0,
  },

  // FAQ
  faqPadding: {
    paddingHorizontal: 16,
    gap: 8,
  },

  // CTA button
  ctaButton: {
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 14,
    backgroundColor: Colors.accent,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  ctaButtonText: {
    color: Colors.darkCharcoal,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },

  // Footer CTA
  footerCTA: {
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: Colors.white,
    opacity: 0.9,
  },

  bottomSpacing: {
    height: 20,
  },
});