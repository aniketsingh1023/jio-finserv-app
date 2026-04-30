// app/about.tsx
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Design System Colors
const DESIGN_COLORS = {
  warmMustard: "#D58F16",
  softOlive: "#CDC58E",
  goldenYellow: "#F1B643",
  lightGray: "#BDBBBC",
  darkNavy: "#252A39",
};

// ─── Types ───────────────────────────────────────────────────────────────────

interface ValueItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  color: string;
}

interface StatItem {
  id: string;
  value: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  delay: number;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const valuesData: ValueItem[] = [
  {
    id: "1",
    icon: "hand-left-outline",
    title: "Trust & Transparency",
    description:
      "We believe in building long-lasting relationships based on trust and complete transparency in all our dealings.",
    color: DESIGN_COLORS.warmMustard,
  },
  {
    id: "2",
    icon: "bulb-outline",
    title: "Customer First",
    description:
      "Our customers are at the heart of everything we do. We strive to exceed their expectations at every touchpoint.",
    color: DESIGN_COLORS.softOlive,
  },
  {
    id: "3",
    icon: "flash-outline",
    title: "Innovation",
    description:
      "We continuously innovate our products and services to provide the best financial solutions to our customers.",
    color: DESIGN_COLORS.goldenYellow,
  },
  {
    id: "4",
    icon: "shield-checkmark-outline",
    title: "Excellence",
    description:
      "We are committed to delivering excellence in every aspect of our service, from application to disbursement.",
    color: DESIGN_COLORS.lightGray,
  },
];

const statsData: StatItem[] = [
  {
    id: "1",
    value: "10+",
    label: "Years of Excellence",
    icon: "trophy-outline",
    delay: 100,
  },
  {
    id: "2",
    value: "₹500 Cr+",
    label: "Loans Disbursed",
    icon: "cash-outline",
    delay: 200,
  },
  {
    id: "3",
    value: "50K+",
    label: "Happy Customers",
    icon: "people-outline",
    delay: 300,
  },
  {
    id: "4",
    value: "25+",
    label: "Branch Locations",
    icon: "headset-outline",
    delay: 400,
  },
];

const highlightsData = [
  "Quick Processing",
  "Flexible Terms",
  "Zero Hidden Charges",
  "Expert Guidance",
];

// ─── Animated Components ─────────────────────────────────────────────────────

// Animated Counter Component
const AnimatedStatCard: React.FC<{ item: StatItem; index: number }> = ({
  item,
  index,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(item.delay),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.statCard,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }, { translateY }],
        },
      ]}
    >
      <View
        style={[
          styles.statIconContainer,
          { backgroundColor: `${DESIGN_COLORS.warmMustard}15` },
        ]}
      >
        <Ionicons
          name={item.icon}
          size={24}
          color={DESIGN_COLORS.warmMustard}
        />
      </View>
      <Text style={styles.statValue}>{item.value}</Text>
      <Text style={styles.statLabel}>{item.label}</Text>
    </Animated.View>
  );
};

// Animated Value Card
const AnimatedValueCard: React.FC<{ item: ValueItem; index: number }> = ({
  item,
  index,
}) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 100),
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.valueCard,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={[`${item.color}10`, "#FFFFFF"]}
        style={styles.valueCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View
          style={[styles.valueIconWrapper, { backgroundColor: item.color }]}
        >
          <Ionicons name={item.icon} size={22} color="#FFFFFF" />
        </View>
        <View style={styles.valueContent}>
          <Text style={styles.valueTitle}>{item.title}</Text>
          <Text style={styles.valueDescription}>{item.description}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

// Individual Floating Particle Component
const FloatingParticle: React.FC<{ index: number }> = ({ index: i }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 3000 + i * 500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 3000 + i * 500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [i, animValue]);

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const opacity = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.8, 0.3],
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: `${(i + 1) * 12}%`,
          top: `${(i * 15) % 100}%`,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    />
  );
};

// Floating Particles Background
const FloatingParticles: React.FC = () => {
  const particles = [...Array(8)].map((_, i) => (
    <FloatingParticle key={i} index={i} />
  ));

  return <View style={styles.particlesContainer}>{particles}</View>;
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AboutScreen() {
  const headerFadeAnim = useRef(new Animated.Value(0)).current;
  const headerScaleAnim = useRef(new Animated.Value(0.9)).current;
  const contentFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerFadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.spring(headerScaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(contentFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Animated Hero Header */}
      <View style={styles.heroContainer}>
        <ImageBackground
          source={require("../../assets/images/HomeScreen.webp")}
          style={styles.heroBackground}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(184, 108, 10, 0.85)", "rgba(241, 161, 41, 0.98)"]}
            style={styles.heroOverlay}
          >
            <FloatingParticles />
            <Animated.View
              style={[
                styles.heroContent,
                {
                  opacity: headerFadeAnim,
                  transform: [{ scale: headerScaleAnim }],
                },
              ]}
            >
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>EST. 2014</Text>
              </View>
              <Text style={styles.heroTitle}>About Finserv Limited</Text>
              <Text style={styles.heroSubtitle}>
                Your trusted partner in financial growth, committed to making
                your dreams a reality through accessible and affordable
                financial solutions.
              </Text>
            </Animated.View>
          </LinearGradient>
        </ImageBackground>
      </View>

      <Animated.View style={[styles.content, { opacity: contentFadeAnim }]}>
        {/* Mission & Vision Section */}
        <View style={styles.missionVisionContainer}>
          <View style={styles.missionCard}>
            <LinearGradient
              colors={[DESIGN_COLORS.warmMustard, DESIGN_COLORS.goldenYellow]}
              style={styles.missionIconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="flag-outline" size={28} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.missionTitle}>Our Mission</Text>
            <Text style={styles.missionText}>
              To empower individuals and businesses with accessible financial
              solutions.
            </Text>
          </View>

          <View style={styles.visionCard}>
            <LinearGradient
              colors={[DESIGN_COLORS.warmMustard, DESIGN_COLORS.goldenYellow]}
              style={styles.missionIconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="eye-outline" size={28} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.missionTitle}>Our Vision</Text>
            <Text style={styles.missionText}>
              To be India&apos;s most trusted and customer-centric financial
              institution.
            </Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Impact</Text>
          <View style={styles.statsGrid}>
            {statsData.map((stat, index) => (
              <AnimatedStatCard key={stat.id} item={stat} index={index} />
            ))}
          </View>
        </View>

        {/* Values Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Core Values</Text>
          <View style={styles.valuesList}>
            {valuesData.map((value, index) => (
              <AnimatedValueCard key={value.id} item={value} index={index} />
            ))}
          </View>
        </View>

        {/* Highlights Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose Us</Text>
          <View style={styles.highlightsContainer}>
            {highlightsData.map((highlight, index) => (
              <View key={index} style={styles.highlightChip}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={DESIGN_COLORS.warmMustard}
                />
                <Text style={styles.highlightChipText}>{highlight}</Text>
              </View>
            ))}
          </View>
        </View>
      </Animated.View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FC",
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Hero Section
  heroContainer: {
    height: screenHeight * 0.55,
    width: screenWidth,
  },
  heroBackground: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    flex: 1,
    justifyContent: "center",
    position: "relative",
  },
  particlesContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  particle: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: DESIGN_COLORS.goldenYellow,
    opacity: 0.6,
  },
  heroContent: {
    paddingHorizontal: 24,
    alignItems: "center",
  },
  heroBadge: {
    backgroundColor: `${DESIGN_COLORS.goldenYellow}20`,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${DESIGN_COLORS.goldenYellow}40`,
    marginBottom: 20,
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: DESIGN_COLORS.goldenYellow,
    letterSpacing: 2,
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.85)",
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "400",
  },

  // Content
  content: {
    paddingHorizontal: 20,
    marginTop: -20,
  },

  // Mission & Vision Cards
  missionVisionContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  missionCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    shadowColor: DESIGN_COLORS.darkNavy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  visionCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    shadowColor: DESIGN_COLORS.darkNavy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  missionIconGradient: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: DESIGN_COLORS.darkNavy,
    marginBottom: 8,
  },
  missionText: {
    fontSize: 12,
    color: DESIGN_COLORS.lightGray,
    lineHeight: 18,
  },

  // Section Styles
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: DESIGN_COLORS.darkNavy,
    marginBottom: 16,
    letterSpacing: -0.3,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: (screenWidth - 52) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    shadowColor: DESIGN_COLORS.darkNavy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    alignItems: "center",
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: DESIGN_COLORS.darkNavy,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: DESIGN_COLORS.lightGray,
    textAlign: "center",
    fontWeight: "500",
  },

  // Values List
  valuesList: {
    gap: 10,
  },
  valueCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: DESIGN_COLORS.darkNavy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  valueCardGradient: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    gap: 14,
  },
  valueIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  valueContent: {
    flex: 1,
  },
  valueTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: DESIGN_COLORS.darkNavy,
    marginBottom: 4,
  },
  valueDescription: {
    fontSize: 12,
    color: DESIGN_COLORS.lightGray,
    lineHeight: 16,
  },

  // Highlights
  highlightsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    shadowColor: DESIGN_COLORS.darkNavy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  highlightChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F8F9FC",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#E8E9ED",
  },
  highlightChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: DESIGN_COLORS.darkNavy,
  },

  // CTA Button
  ctaButton: {
    marginTop: 8,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: DESIGN_COLORS.warmMustard,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  bottomSpacing: {
    height: 20,
  },
});
