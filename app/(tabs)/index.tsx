// app/(tabs)/index.tsx
import React, { useRef, useState, useEffect } from 'react';
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
  Image,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const DS = {
  darkNavy: '#1A2235',
  navyMid: '#253047',
  warmMustard: '#D58F16',
  goldenYellow: '#F1B643',
  softOlive: '#CDC58E',
  lightGray: '#9BA3B4',
  surface: '#FFFFFF',
  background: '#F4F6FB',
  border: '#ECEEF4',

  fontXXL: 38,
  fontXL: 28,
  fontLG: 20,
  fontMD: 16,
  fontSM: 14,
  fontXS: 12,

  sp4: 4,
  sp6: 6,
  sp8: 8,
  sp10: 10,
  sp12: 12,
  sp14: 14,
  sp16: 16,
  sp18: 18,
  sp20: 20,
  sp22: 22,
  sp24: 24,
  sp28: 28,
  sp32: 32,

  radiusSM: 10,
  radiusMD: 16,
  radiusLG: 22,
  radiusXL: 32,

  shadowSoft: {
    shadowColor: '#1A2235',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  shadowMedium: {
    shadowColor: '#1A2235',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 20,
    elevation: 6,
  },
  shadowGold: {
    shadowColor: '#D58F16',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
};

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
  icon: keyof typeof Ionicons.glyphMap;
  bgColor: string;
  accentColor: string;
  route: string;
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

interface FAQDataItem {
  id: string;
  question: string;
  answer: string;
}

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
    icon: 'lock-closed-outline',
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
    description: 'Quick personal loans for all your needs with minimal documentation',
    icon: 'person-outline',
    bgColor: DS.warmMustard,
    accentColor: DS.goldenYellow,
    route: '/loans/personal',
  },
  {
    id: '2',
    type: 'Home Loan',
    description: 'Make your dream home a reality with our affordable home loans',
    icon: 'home-outline',
    bgColor: DS.warmMustard,
    accentColor: DS.softOlive,
    route: '/loans/home',
  },
  {
    id: '3',
    type: 'Business Loan',
    description: 'Fuel your business growth with our flexible business loans',
    icon: 'business-outline',
    bgColor: DS.warmMustard,
    accentColor: '#FFFFFF',
    route: '/loans/business',
  },
  {
    id: '4',
    type: 'Loan Against Property',
    description: 'Unlock the value of your property with our LAP loans',
    icon: 'car-outline',
    bgColor: DS.warmMustard,
    accentColor: DS.goldenYellow,
    route: '/loans/loan-property',
  },
  {
    id: '5',
    type: 'Education Loan',
    description: 'Invest in your future with our education financing solutions',
    icon: 'school-outline',
    bgColor: DS.warmMustard,
    accentColor: DS.softOlive,
    route: '/loans/education',
  },
  {
    id: '6',
    type: 'Loan Against Credit Card',
    description: 'Unlock the value of your credit card with our LACC loans',
    icon: 'card-outline',
    bgColor: DS.warmMustard,
    accentColor: DS.softOlive,
    route: '/loans/loan-creditcard',
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
    name: 'Sunita Patel',
    role: 'Entrepreneur',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 5,
    text: 'Incredible service! The digital process made borrowing so simple — I got funds in my account within hours.',
  },
  {
    id: '5',
    name: 'Vikram Singh',
    role: 'Architect',
    image: 'https://randomuser.me/api/portraits/men/12.jpg',
    rating: 5,
    text: 'The home loan rates are genuinely competitive. Transparent process, zero hidden fees. Highly recommended!',
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

const faqData: FAQDataItem[] = [
  {
    id: '1',
    question: 'Is Finserv NBFC Finance Limited registered with RBI?',
    answer: 'Yes, Finserv NBFC Finance Limited is a registered Non-Banking Financial Company (NBFC) regulated by the Reserve Bank of India (RBI). We comply with all RBI guidelines to ensure safe and transparent financial services.',
  },
  {
    id: '2',
    question: 'What documents are required to apply for a loan?',
    answer: 'Basic documents include Aadhaar Card, PAN Card, recent bank statements (last 3-6 months), salary slips or ITR (for self-employed), and address proof. Additional documents may be required based on the loan type.',
  },
  {
    id: '3',
    question: 'How long does the loan approval process take?',
    answer: 'For most loan types, we offer approval within 24-48 hours of receiving all required documents. Personal loans and gold loans can be approved on the same day in many cases.',
  },
  {
    id: '4',
    question: 'Are there any hidden charges or fees?',
    answer: 'Absolutely not. We maintain 100% transparency in our fee structure. All applicable charges including processing fees, prepayment charges, and late payment fees are clearly communicated before you sign the agreement.',
  },
  {
    id: '5',
    question: 'What interest rates do you offer?',
    answer: 'Our interest rates start from 8.50% per annum and vary based on the loan type, amount, tenure, and your credit profile. We offer some of the most competitive rates in the market',
  },
  {
    id: '6',
    question: 'Can I prepay or foreclose my loan?',
    answer: 'Yes, you can prepay or foreclose your loan after a minimum lock-in period. Prepayment charges, if applicable, are nominal and clearly mentioned in your loan agreement.',
  },
  {
    id: '7',
    question: 'How is my personal data protected?',
    answer: 'We use ISO 27001 certified, bank-grade encryption and security protocols to protect your data. Your personal and financial information is never shared with third parties without your explicit consent.',
  },
  {
    id: '8',
    question: 'What happens if I miss an EMI payment?',
    answer: 'We recommend contacting us immediately if you anticipate a missed payment. We work with customers to find solutions, including EMI restructuring. Late payment charges may apply as per the loan agreement.',
  },
];

const FadeInView: React.FC<{ children: React.ReactNode; delay?: number; style?: any }> = ({
  children,
  delay = 0,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, opacity, translateY]);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
};

const ScalePressable: React.FC<{
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
}> = ({ children, onPress, style }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();

  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }).start();

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View style={[{ transform: [{ scale }] }, style]}>{children}</Animated.View>
    </TouchableOpacity>
  );
};

const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <View style={sStyles.sectionHeader}>
    <View style={sStyles.titleRow}>
      <View style={sStyles.titleAccent} />
      <Text style={sStyles.sectionTitle}>{title}</Text>
    </View>
    {subtitle && <Text style={sStyles.sectionSubtitle}>{subtitle}</Text>}
  </View>
);

const sStyles = StyleSheet.create({
  sectionHeader: {
    paddingHorizontal: DS.sp20,
    marginBottom: DS.sp20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DS.sp10,
  },
  titleAccent: {
    width: 4,
    height: 26,
    backgroundColor: DS.warmMustard,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: DS.fontXL,
    fontWeight: '800',
    color: DS.darkNavy,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: DS.fontSM,
    color: DS.lightGray,
    marginTop: DS.sp4,
    marginLeft: 14,
    lineHeight: 20,
  },
});

const WhyJioItemCard: React.FC<{ item: WhyJioItem; index: number }> = ({ item, index }) => {
  return (
    <FadeInView delay={index * 100}>
      <ScalePressable>
        <View style={styles.whyJioCard}>
          <LinearGradient
            colors={[`${DS.warmMustard}18`, `${DS.warmMustard}05`]}
            style={styles.whyJioIconContainer}
          >
            <Ionicons name={item.icon} size={22} color={DS.warmMustard} />
          </LinearGradient>
          <View style={styles.whyJioContent}>
            <Text style={styles.whyJioTitle}>{item.title}</Text>
            <Text style={styles.whyJioDescription}>{item.description}</Text>
          </View>
          <View style={styles.whyJioArrow}>
            <Ionicons name="chevron-forward" size={16} color={DS.lightGray} />
          </View>
        </View>
      </ScalePressable>
    </FadeInView>
  );
};

const LoanProductCard: React.FC<{ item: LoanProduct }> = ({ item }) => {
  const router = useRouter();

  return (
    <ScalePressable onPress={() => router.push(item.route as any)}>
      <LinearGradient
        colors={[item.bgColor, `${item.bgColor}CC`]}
        style={styles.loanCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.loanCardDecor} />

        <View style={[styles.loanIconContainer, { backgroundColor: `${item.accentColor}25` }]}>
          <Ionicons name={item.icon} size={26} color={item.accentColor} />
        </View>

        <Text style={styles.loanType}>{item.type}</Text>
        <Text style={styles.loanDescription}>{item.description}</Text>

        <View style={styles.loanCardFooter}>
          <Text style={[styles.applyText, { color: item.accentColor }]}>Explore More</Text>
          <View style={[styles.loanArrowCircle, { backgroundColor: `${item.accentColor}20` }]}>
            <Ionicons name="arrow-forward" size={14} color={item.accentColor} />
          </View>
        </View>
      </LinearGradient>
    </ScalePressable>
  );
};

const TestimonialSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < testimonialsData.length - 1) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prev = currentIndex - 1;
      setCurrentIndex(prev);
      flatListRef.current?.scrollToIndex({ index: prev, animated: true });
    }
  };

  const renderStars = (rating: number) =>
    [...Array(5)].map((_, i) => (
      <Ionicons
        key={i}
        name={i < rating ? 'star' : 'star-outline'}
        size={14}
        color={DS.goldenYellow}
      />
    ));

  const renderCard = ({ item }: { item: Testimonial }) => (
    <View style={styles.testimonialCard}>
      <View style={styles.testimonialQuoteMark}>
        <Text style={styles.testimonialQuoteText}>"</Text>
      </View>
      <Text style={styles.testimonialText}>{item.text}</Text>
      <View style={styles.testimonialDivider} />
      <View style={styles.testimonialHeader}>
        <Image source={{ uri: item.image }} style={styles.testimonialImage} />
        <View style={styles.testimonialInfo}>
          <Text style={styles.testimonialName}>{item.name}</Text>
          <Text style={styles.testimonialRole}>{item.role}</Text>
          <View style={styles.ratingContainer}>{renderStars(item.rating)}</View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.testimonialContainer}>
      <FlatList
        ref={flatListRef}
        data={testimonialsData}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / (screenWidth - 40));
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
            size={20}
            color={currentIndex === 0 ? DS.border : DS.darkNavy}
          />
        </TouchableOpacity>
        <View style={styles.paginationDots}>
          {testimonialsData.map((_, i) => (
            <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
          ))}
        </View>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentIndex === testimonialsData.length - 1 && styles.navButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={currentIndex === testimonialsData.length - 1}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={currentIndex === testimonialsData.length - 1 ? DS.border : DS.darkNavy}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const TrustCarousel: React.FC = () => {
  const translateX = useRef(new Animated.Value(0)).current;
  const infiniteData = [...trustFeaturesData, ...trustFeaturesData, ...trustFeaturesData];
  const CARD_WIDTH = 148;

  useEffect(() => {
    const totalWidth = trustFeaturesData.length * CARD_WIDTH;
    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: -totalWidth,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [translateX]);

  return (
    <View style={styles.trustCarouselContainer}>
      <Animated.View style={[styles.trustRow, { transform: [{ translateX }] }]}>
        {infiniteData.map((item, index) => (
          <View key={`${item.id}-${index}`} style={styles.trustCard}>
            <View style={styles.trustIconContainer}>
              <Ionicons name={item.icon} size={22} color={DS.warmMustard} />
            </View>
            <Text style={styles.trustTitle}>{item.title}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

const FAQItemCard: React.FC<{ item: FAQDataItem; isLast: boolean }> = ({ item, isLast }) => {
  const [expanded, setExpanded] = useState(false);
  const animHeight = useRef(new Animated.Value(0)).current;
  const animOpacity = useRef(new Animated.Value(0)).current;
  const animRotate = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const toHeight = expanded ? 0 : 1;
    const toOpacity = expanded ? 0 : 1;
    const toRotate = expanded ? 0 : 1;

    Animated.parallel([
      Animated.timing(animHeight, {
        toValue: toHeight,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(animOpacity, {
        toValue: toOpacity,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(animRotate, {
        toValue: toRotate,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    setExpanded(!expanded);
  };

  const maxHeight = animHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120],
  });

  const rotate = animRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <View style={[styles.faqItem, isLast && { borderBottomWidth: 0 }]}>
      <TouchableOpacity style={styles.faqQuestionContainer} onPress={toggle} activeOpacity={0.7}>
        <Text style={[styles.faqQuestion, expanded && { color: DS.warmMustard }]}>
          {item.question}
        </Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <View style={[styles.faqIconCircle, expanded && { backgroundColor: DS.warmMustard }]}>
            <Ionicons name="add" size={16} color={expanded ? '#FFFFFF' : DS.warmMustard} />
          </View>
        </Animated.View>
      </TouchableOpacity>
      <Animated.View style={[styles.faqAnswerContainer, { maxHeight, opacity: animOpacity }]}>
        <Text style={styles.faqAnswer}>{item.answer}</Text>
      </Animated.View>
    </View>
  );
};

const FAQAccordion: React.FC<{ items: FAQDataItem[] }> = ({ items }) => (
  <View style={styles.faqContainer}>
    {items.map((item, index) => (
      <FAQItemCard key={item.id} item={item} isLast={index === items.length - 1} />
    ))}
  </View>
);

const StatsRow: React.FC = () => (
  <View style={styles.statsRow}>
    {[
      { value: '₹500Cr+', label: 'Disbursed' },
      { value: '2L+', label: 'Customers' },
      { value: '8.50%', label: 'Starting Rate' },
      { value: '24hr', label: 'Approval' },
    ].map((stat, i) => (
      <View key={i} style={[styles.statItem, i < 3 && styles.statItemBorder]}>
        <Text style={styles.statValue}>{stat.value}</Text>
        <Text style={styles.statLabel}>{stat.label}</Text>
      </View>
    ))}
  </View>
);

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.heroContainer}>
        <ImageBackground
          source={require('../../assets/images/HomeScreen1.webp')}
          style={styles.heroBackground}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(26,34,53,0.55)', 'rgba(26,34,53,0.97)']}
            style={styles.heroOverlay}
          >
            <FadeInView delay={100}>
              <View style={styles.heroBadge}>
                <View style={styles.heroBadgeDot} />
                <Text style={styles.heroBadgeText}>Trusted by 50k+ Customers</Text>
              </View>
            </FadeInView>

            <FadeInView delay={200}>
              <Text style={styles.heroMainText}>
                Your trusted{'\n'}financial partner
              </Text>
            </FadeInView>

            <FadeInView delay={350}>
              <Text style={styles.heroSubtitle}>
                Instant loans from 8.50% p.a. · Minimal docs · Quick approval. We're here to make
                your financial dreams come true.
              </Text>
            </FadeInView>

            <FadeInView delay={500} style={styles.heroCTARow}>
              <ScalePressable onPress={() => router.push('/profile')}>
                <LinearGradient
                  colors={[DS.warmMustard, DS.goldenYellow]}
                  style={styles.getStartedButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.getStartedText}>Apply Now</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </LinearGradient>
              </ScalePressable>

              <ScalePressable onPress={() => router.push('/emi-calculator')}>
                <View style={styles.eligibilityButton}>
                  <Text style={styles.eligibilityText}>Calculate EMI</Text>
                </View>
              </ScalePressable>
            </FadeInView>
          </LinearGradient>
        </ImageBackground>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Why JioFinserv" subtitle="Built for speed, trust, and simplicity" />
        <View style={styles.whyJioList}>
          {whyJioData.map((item, index) => (
            <WhyJioItemCard key={item.id} item={item} index={index} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Loan Products" subtitle="Choose what fits your life" />
        <FlatList
          data={loanProductsData}
          renderItem={({ item }) => <LoanProductCard item={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.loanListContent}
        />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Customer Stories" subtitle="Real people, real impact" />
        <TestimonialSection />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Why Trust Us" />
        <TrustCarousel />
      </View>

      <View style={[styles.section, { marginBottom: DS.sp20 }]}>
        <SectionHeader title="FAQs" subtitle="Everything you need to know" />
        <FAQAccordion items={faqData} />
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DS.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  heroContainer: {
    height: screenHeight * 0.88,
    width: screenWidth,
  },
  heroBackground: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: DS.sp24,
    paddingBottom: DS.sp32,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 100,
    paddingHorizontal: DS.sp12,
    paddingVertical: DS.sp4 + 2,
    marginBottom: DS.sp16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    gap: DS.sp8,
  },
  heroBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: DS.goldenYellow,
  },
  heroBadgeText: {
    fontSize: DS.fontXS + 1,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  heroMainText: {
    fontSize: DS.fontXXL,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 46,
    letterSpacing: -0.8,
    marginBottom: DS.sp16,
  },
  heroSubtitle: {
    fontSize: DS.fontSM + 1,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 24,
    marginBottom: DS.sp24,
    fontWeight: '400',
    maxWidth: screenWidth * 0.85,
  },
  heroCTARow: {
    flexDirection: 'row',
    gap: DS.sp12,
    marginBottom: DS.sp28,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DS.sp8,
    paddingHorizontal: DS.sp20,
    paddingVertical: DS.sp12 + 2,
    borderRadius: DS.radiusMD,
    ...DS.shadowGold,
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: DS.fontMD,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  eligibilityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DS.sp20,
    paddingVertical: DS.sp12 + 2,
    borderRadius: DS.radiusMD,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  eligibilityText: {
    color: '#FFFFFF',
    fontSize: DS.fontMD,
    fontWeight: '600',
  },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: DS.radiusMD,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: DS.sp12,
  },
  statItemBorder: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.15)',
  },
  statValue: {
    fontSize: DS.fontMD,
    fontWeight: '800',
    color: DS.goldenYellow,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: DS.fontXS,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
    fontWeight: '500',
  },

  section: {
    marginTop: DS.sp32,
  },

  whyJioList: {
    paddingHorizontal: DS.sp20,
    gap: DS.sp10,
  },
  whyJioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DS.surface,
    borderRadius: DS.radiusMD,
    padding: DS.sp16,
    ...DS.shadowSoft,
    borderWidth: 1,
    borderColor: DS.border,
  },
  whyJioIconContainer: {
    width: 46,
    height: 46,
    borderRadius: DS.radiusSM + 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: DS.sp14,
  },
  whyJioContent: {
    flex: 1,
  },
  whyJioTitle: {
    fontSize: DS.fontMD,
    fontWeight: '700',
    color: DS.darkNavy,
    marginBottom: DS.sp4,
    letterSpacing: -0.2,
  },
  whyJioDescription: {
    fontSize: DS.fontXS + 1,
    color: DS.lightGray,
    lineHeight: 18,
    fontWeight: '400',
  },
  whyJioArrow: {
    marginLeft: DS.sp8,
  },

  loanListContent: {
    paddingHorizontal: DS.sp20,
    gap: DS.sp14,
    paddingBottom: DS.sp4,
  },
  loanCard: {
    borderRadius: DS.radiusLG,
    padding: DS.sp20,
    width: 230,
    overflow: 'hidden',
    ...DS.shadowMedium,
  },
  loanCardDecor: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -40,
    right: -40,
  },
  loanIconContainer: {
    width: 50,
    height: 50,
    borderRadius: DS.radiusMD,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: DS.sp14,
  },
  loanType: {
    fontSize: DS.fontMD + 1,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: DS.sp4,
    letterSpacing: -0.3,
  },
  loanDescription: {
    fontSize: DS.fontXS,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: DS.sp16,
    lineHeight: 18,
  },
  loanRatePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 100,
    paddingHorizontal: DS.sp10,
    paddingVertical: DS.sp4,
    marginBottom: DS.sp16,
  },
  loanRateText: {
    fontSize: DS.fontXS,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loanCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
    paddingTop: DS.sp14,
  },
  applyText: {
    fontSize: DS.fontSM,
    fontWeight: '700',
  },
  loanArrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  testimonialContainer: {
    paddingHorizontal: DS.sp20,
  },
  testimonialListContent: {
    gap: DS.sp16,
  },
  testimonialCard: {
    backgroundColor: DS.surface,
    borderRadius: DS.radiusLG,
    padding: DS.sp22,
    width: screenWidth - 40,
    ...DS.shadowSoft,
    borderWidth: 1,
    borderColor: DS.border,
  },
  testimonialQuoteMark: {
    marginBottom: DS.sp4,
  },
  testimonialQuoteText: {
    fontSize: 56,
    color: DS.warmMustard,
    lineHeight: 48,
    fontWeight: '900',
  },
  testimonialText: {
    fontSize: DS.fontSM + 1,
    color: DS.navyMid,
    lineHeight: 24,
    marginBottom: DS.sp20,
    fontStyle: 'italic',
    fontWeight: '400',
  },
  testimonialDivider: {
    height: 1,
    backgroundColor: DS.border,
    marginBottom: DS.sp16,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testimonialImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: DS.sp12,
    borderWidth: 2,
    borderColor: DS.border,
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontSize: DS.fontSM + 1,
    fontWeight: '700',
    color: DS.darkNavy,
    letterSpacing: -0.2,
  },
  testimonialRole: {
    fontSize: DS.fontXS,
    color: DS.lightGray,
    marginTop: 2,
    marginBottom: DS.sp4,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  testimonialNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: DS.sp20,
    gap: DS.sp16,
  },
  navButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: DS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DS.border,
    ...DS.shadowSoft,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  paginationDots: {
    flexDirection: 'row',
    gap: DS.sp6,
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: DS.border,
  },
  dotActive: {
    width: 22,
    backgroundColor: DS.warmMustard,
    borderRadius: 4,
  },

  trustCarouselContainer: {
    height: 96,
    overflow: 'hidden',
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: DS.sp20,
  },
  trustCard: {
    backgroundColor: DS.surface,
    borderRadius: DS.radiusMD,
    paddingHorizontal: DS.sp16,
    paddingVertical: DS.sp12,
    marginRight: DS.sp12,
    alignItems: 'center',
    width: 136,
    ...DS.shadowSoft,
    borderWidth: 1,
    borderColor: DS.border,
  },
  trustIconContainer: {
    width: 40,
    height: 40,
    borderRadius: DS.radiusSM,
    backgroundColor: `${DS.warmMustard}12`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: DS.sp6,
  },
  trustTitle: {
    fontSize: DS.fontXS,
    fontWeight: '600',
    color: DS.darkNavy,
    textAlign: 'center',
    letterSpacing: 0.1,
  },

  faqContainer: {
    marginHorizontal: DS.sp20,
    backgroundColor: DS.surface,
    borderRadius: DS.radiusLG,
    overflow: 'hidden',
    ...DS.shadowSoft,
    borderWidth: 1,
    borderColor: DS.border,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: DS.border,
    overflow: 'hidden',
  },
  faqQuestionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: DS.sp18,
    paddingVertical: DS.sp16,
  },
  faqQuestion: {
    fontSize: DS.fontSM,
    fontWeight: '600',
    color: DS.darkNavy,
    flex: 1,
    marginRight: DS.sp12,
    letterSpacing: -0.1,
  },
  faqIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${DS.warmMustard}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faqAnswerContainer: {
    overflow: 'hidden',
    paddingHorizontal: DS.sp18,
    backgroundColor: '#FAFBFD',
  },
  faqAnswer: {
    fontSize: DS.fontXS + 1,
    color: DS.lightGray,
    lineHeight: 22,
    paddingBottom: DS.sp16,
    fontWeight: '400',
  },

  bottomCTAWrap: {
    marginHorizontal: DS.sp20,
    marginTop: DS.sp32,
  },
  bottomCTA: {
    borderRadius: DS.radiusLG,
    padding: DS.sp24,
    ...DS.shadowMedium,
  },
  bottomCTAInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomCTAHeading: {
    fontSize: DS.fontLG,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    marginBottom: DS.sp4,
  },
  bottomCTASubtext: {
    fontSize: DS.fontSM,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '400',
  },
  bottomCTAArrow: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});