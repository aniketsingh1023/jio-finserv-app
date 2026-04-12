// app/(tabs)/index.tsx
import React, { useRef, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  FlatList,
  Animated,
  LayoutAnimation,
  Platform,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Design System Colors
const DESIGN_COLORS = {
  warmMustard: '#D58F16',
  softOlive: '#CDC58E',
  goldenYellow: '#F1B643',
  lightGray: '#BDBBBC',
  darkNavy: '#252A39',
};

// ─── Types ───────────────────────────────────────────────────────────────────

interface WhyJioItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

interface LoanProduct {
  id: string;
  type: string;
  description: string;
  rate: string;
  icon: keyof typeof Ionicons.glyphMap;
  bgColor: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  rating: number;
  text: string;
}

interface TrustFeature {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const whyJioData: WhyJioItem[] = [
  {
    id: '1',
    icon: 'flash-outline',
    title: 'Quick Approval',
    description: 'Get your loan approved within 24 hours with minimal documentation.',
  },
  {
    id: '2',
    icon: 'shield-checkmark-outline',
    title: 'Competitive Rates',
    description: 'Enjoy interest rates starting from 8.50% p.a. with flexible repayment options.',
  },
  {
    id: '3',
    icon: 'trending-down-outline',
    title: 'Secure Process',
    description: 'Your data is protected with bank-grade security and encryption.',
  },
  {
    id: '4',
    icon: 'headset-outline',
    title: 'Expert Support',
    description: 'Our dedicated team is available 24/7 to assist you with your queries.',
  },
];

const loanProductsData: LoanProduct[] = [
  {
    id: '1',
    type: 'Personal Loan',
    description: 'For your personal needs and aspirations',
    rate: '10.49% p.a.',
    icon: 'person-outline',
    bgColor: DESIGN_COLORS.warmMustard,
  },
  {
    id: '2',
    type: 'Home Loan',
    description: 'Make your dream home a reality',
    rate: '8.50% p.a.',
    icon: 'home-outline',
    bgColor: DESIGN_COLORS.softOlive,
  },
  {
    id: '3',
    type: 'Business Loan',
    description: 'Fuel your business growth',
    rate: '12.99% p.a.',
    icon: 'business-outline',
    bgColor: DESIGN_COLORS.goldenYellow,
  },
  {
    id: '4',
    type: 'Auto Loan',
    description: 'Drive home your dream car',
    rate: '9.25% p.a.',
    icon: 'car-outline',
    bgColor: DESIGN_COLORS.lightGray,
  },
  {
    id: '5',
    type: 'Education Loan',
    description: 'Invest in your future',
    rate: '8.75% p.a.',
    icon: 'school-outline',
    bgColor: DESIGN_COLORS.darkNavy,
  },
];

const testimonialsData: Testimonial[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    role: 'Business Owner',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    text: 'JioFinserv transformed my business with quick capital. The process was seamless and the interest rates are unbeatable.',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    role: 'Software Engineer',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    text: 'Got my home loan approved in just 3 days! The team was professional and guided me through every step.',
  },
  {
    id: '3',
    name: 'Amit Verma',
    role: 'Doctor',
    image: 'https://randomuser.me/api/portraits/men/67.jpg',
    rating: 5,
    text: 'Best financial partner for professionals. Their personal loan helped me expand my clinic without any hassle.',
  },
  {
    id: '4',
    name: 'Rajesh Kumar',
    role: 'Business Owner',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    text: 'JioFinserv transformed my business with quick capital. The process was seamless and the interest rates are unbeatable.',
  },
  {
    id: '5',
    name: 'Priya Sharma',
    role: 'Software Engineer',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    text: 'Got my home loan approved in just 3 days! The team was professional and guided me through every step.',
  },
  {
    id: '6',
    name: 'Amit Verma',
    role: 'Doctor',
    image: 'https://randomuser.me/api/portraits/men/67.jpg',
    rating: 5,
    text: 'Best financial partner for professionals. Their personal loan helped me expand my clinic without any hassle.',
  },
];

const trustFeaturesData: TrustFeature[] = [
  { id: '1', title: 'RBI Registered', icon: 'ribbon-outline' },
  { id: '2', title: 'ISO Certified', icon: 'shield-outline' },
  { id: '3', title: 'Data Encryption', icon: 'lock-closed-outline' },
  { id: '4', title: 'Instant Disbursal', icon: 'rocket-outline' },
  { id: '5', title: 'No Hidden Fees', icon: 'eye-outline' },
  { id: '6', title: 'Flexible Tenure', icon: 'calendar-outline' },
];

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'What documents are required for a personal loan?',
    answer: 'PAN Card, Aadhaar Card, last 3 months salary slips, and 6 months bank statements.',
  },
  {
    id: '2',
    question: 'How long does loan approval take?',
    answer: 'Most loans are approved within 5 minutes to 24 hours, depending on verification.',
  },
  {
    id: '3',
    question: 'What is the minimum credit score required?',
    answer: 'We consider applications with credit score of 650 and above for best rates.',
  },
  {
    id: '4',
    question: 'Can I prepay my loan without penalty?',
    answer: 'Yes, we offer zero prepayment charges after 6 months of loan tenure.',
  },
  {
    id: '5',
    question: 'What is the maximum loan amount I can get?',
    answer: 'Personal loans up to ₹50 lakhs, Home loans up to ₹5 crores based on eligibility.',
  },
  {
    id: '6',
    question: 'Is there an option for part payment?',
    answer: 'Yes, you can make part payments anytime through our app without any charges.',
  },
  {
    id: '7',
    question: 'How can I check my loan eligibility?',
    answer: 'Use our instant eligibility checker on the app - it takes just 60 seconds!',
  },
  {
    id: '8',
    question: 'What happens if I miss an EMI payment?',
    answer: 'We send reminders and offer a 7-day grace period. Late fees apply after that.',
  },
];

// ─── Components ──────────────────────────────────────────────────────────────

// Why JioFinserv Item Component
const WhyJioItemCard: React.FC<{ item: WhyJioItem }> = ({ item }) => {
  return (
    <View style={styles.whyJioCard}>
      <View style={[styles.whyJioIconContainer, { backgroundColor: `${DESIGN_COLORS.warmMustard}15` }]}>
        <Ionicons name={item.icon} size={24} color={DESIGN_COLORS.warmMustard} />
      </View>
      <View style={styles.whyJioContent}>
        <Text style={styles.whyJioTitle}>{item.title}</Text>
        <Text style={styles.whyJioDescription}>{item.description}</Text>
      </View>
    </View>
  );
};

// Loan Product Card Component
const LoanProductCard: React.FC<{ item: LoanProduct }> = ({ item }) => {
  return (
    <TouchableOpacity style={styles.loanCard} activeOpacity={0.8}>
      <View style={[styles.loanIconContainer, { backgroundColor: item.bgColor }]}>
        <Ionicons name={item.icon} size={28} color="#FFFFFF" />
      </View>
      <Text style={styles.loanType}>{item.type}</Text>
      <Text style={styles.loanDescription}>{item.description}</Text>

      <View style={styles.loanCardFooter}>
        <Text style={styles.applyText}>Explore More</Text>
        <Ionicons name="arrow-forward" size={16} color={DESIGN_COLORS.warmMustard} />
      </View>
    </TouchableOpacity>
  );
};

// Testimonial Component
const TestimonialSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < testimonialsData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Ionicons
        key={i}
        name={i < rating ? 'star' : 'star-outline'}
        size={18}
        color={DESIGN_COLORS.goldenYellow}
      />
    ));
  };

  const renderTestimonialCard = ({ item }: { item: Testimonial }) => (
    <View style={styles.testimonialCard}>
      <View style={styles.testimonialHeader}>
        <Image source={{ uri: item.image }} style={styles.testimonialImage} />
        <View style={styles.testimonialInfo}>
          <Text style={styles.testimonialName}>{item.name}</Text>
          <Text style={styles.testimonialRole}>{item.role}</Text>
        </View>
      </View>
      <View style={styles.ratingContainer}>
        {renderStars(item.rating)}
      </View>
      <Text style={styles.testimonialText}>{item.text}</Text>
    </View>
  );


  return (
    <View style={styles.testimonialContainer}>
      <FlatList
        ref={flatListRef}
        data={testimonialsData}
        renderItem={renderTestimonialCard}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / (screenWidth - 32));
          setCurrentIndex(index);
        }}
        contentContainerStyle={styles.testimonialListContent}
      />
      <View style={styles.testimonialNavigation}>
        <TouchableOpacity
          style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
          onPress={handlePrev}
          disabled={currentIndex === 0}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={currentIndex === 0 ? DESIGN_COLORS.lightGray : DESIGN_COLORS.darkNavy}
          />
        </TouchableOpacity>
        <View style={styles.paginationDots}>
          {testimonialsData.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity
          style={[styles.navButton, currentIndex === testimonialsData.length - 1 && styles.navButtonDisabled]}
          onPress={handleNext}
          disabled={currentIndex === testimonialsData.length - 1}
        >
          <Ionicons
            name="chevron-forward"
            size={24}
            color={currentIndex === testimonialsData.length - 1 ? DESIGN_COLORS.lightGray : DESIGN_COLORS.darkNavy}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Animated Trust Carousel Component
const TrustCarousel: React.FC = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  
  // Duplicate data for infinite scroll effect
  const infiniteData = [...trustFeaturesData, ...trustFeaturesData];

  React.useEffect(() => {
    let scrollValue = 0;
    const interval = setInterval(() => {
      scrollValue += 1;
      if (scrollValue > infiniteData.length * 160) {
        scrollValue = 0;
      }
      flatListRef.current?.scrollToOffset({ offset: scrollValue, animated: true });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const renderTrustCard = ({ item }: { item: TrustFeature }) => (
    <View style={styles.trustCard}>
      <View style={styles.trustIconContainer}>
        <Ionicons name={item.icon} size={24} color={DESIGN_COLORS.warmMustard} />
      </View>
      <Text style={styles.trustTitle}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.trustCarouselContainer}>
      <FlatList
        ref={flatListRef}
        data={infiniteData}
        renderItem={renderTrustCard}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={styles.trustListContent}
      />
    </View>
  );
};

// FAQ Accordion Component
const FAQAccordion: React.FC<{ items: FAQItem[] }> = ({ items }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    if (Platform.OS !== 'web') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.faqContainer}>
      {items.map((item) => {
        const isExpanded = expandedId === item.id;
        return (
          <View key={item.id} style={styles.faqItem}>
            <TouchableOpacity
              style={styles.faqQuestionContainer}
              onPress={() => toggleExpand(item.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.faqQuestion}>{item.question}</Text>
              <Ionicons
                name={isExpanded ? 'remove' : 'add'}
                size={20}
                color={DESIGN_COLORS.warmMustard}
              />
            </TouchableOpacity>
            {isExpanded && (
              <View style={styles.faqAnswerContainer}>
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Hero Section with Background Image */}
      <View style={styles.heroContainer}>
        <ImageBackground
           source={require('../../assets/images/HomeScreen1.webp')}
          style={styles.heroBackground}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(37, 42, 57, 0.7)', 'rgba(37, 42, 57, 0.95)']}
            style={styles.heroOverlay}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroMainText}>
                Your trusted partner{'\n'}for financial growth
              </Text>
              <Text style={styles.heroSubtitle}>
                Get instant loans with interest rates starting from 8.50% p.a., minimal documentation, and quick approval. We're here to make your financial dreams come true.
              </Text>
              <View style={styles.heroCTA}>
                <TouchableOpacity
                          style={styles.getStartedButton}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.getStartedText}>Get Started</Text>
                        </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* Why JioFinserv Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why JioFinserv</Text>
        <View style={styles.whyJioList}>
          {whyJioData.map((item) => (
            <WhyJioItemCard key={item.id} item={item} />
          ))}
        </View>
      </View>

      {/* Our Loan Products Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Loan Products</Text>
        <FlatList
          data={loanProductsData}
          renderItem={({ item }) => <LoanProductCard item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.loanListContent}
        />
      </View>

      {/* Testimonials Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What Our Customers Say</Text>
        <TestimonialSection />
      </View>

      {/* Why Trust Us Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Trust Us</Text>
        <TrustCarousel />
      </View>

      {/* FAQ Section */}
      <View style={[styles.section, styles.faqSection]}>
        <Text style={styles.sectionTitle}>FAQs</Text>
        <FAQAccordion items={faqData} />
      </View>

      {/* Bottom CTA */}
      <TouchableOpacity style={styles.bottomCTA} activeOpacity={0.8}>
        <LinearGradient
          colors={[DESIGN_COLORS.warmMustard, DESIGN_COLORS.goldenYellow]}
          style={styles.bottomCTAGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.bottomCTAText}>Get Started Today</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FC',
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Hero Section
  heroContainer: {
    height: screenHeight * 0.9,
    width: screenWidth,
  },
  heroBackground: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
    paddingBottom: 48,
  },
  heroContent: {
    paddingHorizontal: 24,
  },
  heroMainText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 44,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
    marginBottom: 32,
    fontWeight: '400',
  },
  heroCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroCTAText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Section Styles
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: DESIGN_COLORS.darkNavy,
    marginHorizontal: 20,
    marginBottom: 16,
    letterSpacing: -0.3,
  },

  // Why JioFinserv
  whyJioList: {
    paddingHorizontal: 16,
  },
  whyJioCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: DESIGN_COLORS.darkNavy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  whyJioIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  whyJioContent: {
    flex: 1,
  },
  whyJioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.darkNavy,
    marginBottom: 4,
  },
  whyJioDescription: {
    fontSize: 13,
    color: DESIGN_COLORS.lightGray,
    lineHeight: 18,
  },

  // Loan Products
  loanListContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  loanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: 260,
    shadowColor: DESIGN_COLORS.darkNavy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  loanIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loanType: {
    fontSize: 18,
    fontWeight: '700',
    color: DESIGN_COLORS.darkNavy,
    marginBottom: 4,
  },
  loanDescription: {
    fontSize: 13,
    color: DESIGN_COLORS.lightGray,
    marginBottom: 16,
    lineHeight: 18,
  },
  rateContainer: {
    marginBottom: 16,
  },
  rateLabel: {
    fontSize: 11,
    color: DESIGN_COLORS.lightGray,
    marginBottom: 2,
  },
  rateValue: {
    fontSize: 18,
    fontWeight: '700',
    color: DESIGN_COLORS.warmMustard,
  },
  loanCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  },
  applyText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.warmMustard,
  },

  // Testimonials
  testimonialContainer: {
    paddingHorizontal: 16,
  },
  testimonialListContent: {
    paddingRight: 32,
  },
  testimonialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: screenWidth - 32,
    marginRight: 16,
    shadowColor: DESIGN_COLORS.darkNavy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  testimonialImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 14,
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.darkNavy,
    marginBottom: 2,
  },
  testimonialRole: {
    fontSize: 13,
    color: DESIGN_COLORS.lightGray,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 16,
  },
  testimonialText: {
    fontSize: 14,
    color: DESIGN_COLORS.darkNavy,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  testimonialNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: DESIGN_COLORS.darkNavy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  paginationDots: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: DESIGN_COLORS.lightGray,
  },
  dotActive: {
    width: 24,
    backgroundColor: DESIGN_COLORS.warmMustard,
  },

  // Trust Carousel
  trustCarouselContainer: {
    height: 100,
  },
  trustListContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  trustCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 140,
    shadowColor: DESIGN_COLORS.darkNavy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  trustIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: `${DESIGN_COLORS.warmMustard}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  trustTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: DESIGN_COLORS.darkNavy,
    textAlign: 'center',
  },

  // FAQ Section
  faqSection: {
    marginBottom: 20,
  },
  faqContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  faqQuestionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '500',
    color: DESIGN_COLORS.darkNavy,
    flex: 1,
    marginRight: 12,
  },
  faqAnswerContainer: {
    paddingHorizontal: 18,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FAFAFA',
  },
  faqAnswer: {
    fontSize: 13,
    color: DESIGN_COLORS.lightGray,
    lineHeight: 20,
  },

  // Bottom CTA
  bottomCTA: {
    marginHorizontal: 20,
    marginTop: 32,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: DESIGN_COLORS.warmMustard,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  bottomCTAGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
  },
  bottomCTAText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  bottomSpacing: {
    height: 20,
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
});