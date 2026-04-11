import React, { useRef, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  Text,
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

interface CarouselItem {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
  buttonText: string;
}

interface LoanItem {
  id: string;
  iconName: string;
  title: string;
  description: string;
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

// Dummy Data
const carouselData: CarouselItem[] = [
  {
    id: '1',
    title: 'Personal Loans',
    description: 'Quick approvals, low interest rates',
    backgroundColor: '#D58F16',
    buttonText: 'Apply Now',
  },
  {
    id: '2',
    title: 'Home Loans',
    description: 'Make your dream home a reality',
    backgroundColor: '#F1B643',
    buttonText: 'Apply Now',
  },
  {
    id: '3',
    title: 'Auto Loans',
    description: 'Drive your dream car today',
    backgroundColor: '#CDC58E',
    buttonText: 'Apply Now',
  },
  {
    id: '4',
    title: 'Business Loans',
    description: 'Grow your business with us',
    backgroundColor: '#BDBBBC',
    buttonText: 'Apply Now',
  },
  {
    id: '5',
    title: 'Education Loans',
    description: 'Invest in your future',
    backgroundColor: '#252A39',
    buttonText: 'Apply Now',
  },
];

const loanData: LoanItem[] = [
  {
    id: '1',
    iconName: 'personal-loan',
    title: 'Personal Loans',
    description: 'Flexible loans for your personal needs',
  },
  {
    id: '2',
    iconName: 'home-loan',
    title: 'Home Loans',
    description: 'Affordable home financing solutions',
  },
  {
    id: '3',
    iconName: 'auto-loan',
    title: 'Auto Loans',
    description: 'Quick car financing options',
  },
  {
    id: '4',
    iconName: 'business-loan',
    title: 'Business Loans',
    description: 'Support your entrepreneurial dreams',
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

export default function HomeScreen() {
  const router = useRouter();

  const handleGetStartedPress = () => {
    router.push('/auth/login');
  };

  const handleApplyNow = (item: CarouselItem) => {
    router.push('/auth/login');
  };

  const handleCalculateEMI = () => {
    router.push('/(tabs)/emi-calculator');
  };

  const handleExploreMore = (loan: LoanItem) => {
    router.push('/(tabs)/emi-calculator');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Header
        onGetStartedPress={handleGetStartedPress}
        showSearch={false}
      />

      {/* Carousel Section */}
      <View style={styles.section}>
        <Carousel
          data={carouselData}
          onApplyPress={handleApplyNow}
          onCalculatePress={handleCalculateEMI}
        />
      </View>

      {/* Loans We Provide Section */}
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
          contentContainerStyle={styles.loanListContent}
          scrollEventThrottle={16}
        />
      </View>

      {/* Why Choose Us Section */}
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

      {/* Testimonials Section */}
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
          contentContainerStyle={styles.testimonialListContent}
          scrollEventThrottle={16}
        />
      </View>

      {/* FAQ Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <View style={styles.faqPadding}>
          <FAQ items={faqData} />
        </View>
      </View>

      {/* Footer CTA */}
      <View style={styles.footerCTA}>
        <Text style={styles.footerText}>Ready to get started?</Text>
        <Text style={styles.footerSubtext}>
          Apply for a loan in less than 5 minutes
        </Text>
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  loanListContent: {
    paddingHorizontal: 16,
    gap: 0,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 0,
  },
  testimonialListContent: {
    paddingHorizontal: 16,
    gap: 0,
  },
  faqPadding: {
    paddingHorizontal: 16,
    gap: 8,
  },
  footerCTA: {
    marginHorizontal: 16,
    marginVertical: 24,
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
    height: 80,
  },
});
