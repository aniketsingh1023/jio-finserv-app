// app/emi-calculator.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Svg, { Circle, G } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Design System Colors
const DESIGN_COLORS = {
  warmMustard: '#D58F16',
  softOlive: '#CDC58E',
  goldenYellow: '#F1B643',
  lightGray: '#BDBBBC',
  darkNavy: '#252A39',
};

interface EMIResult {
  monthlyEMI: number;
  totalAmount: number;
  totalInterest: number;
  principal: number;
}

// ─── Animated Components ─────────────────────────────────────────────────────

// Circular Progress Component
const CircularProgress: React.FC<{
  principal: number;
  interest: number;
  animated?: boolean;
}> = ({ principal, interest, animated = true }) => {
  const total = principal + interest;
  const interestPercentage = total > 0 ? (interest / total) * 100 : 0;
  
  const animationProgress = useRef(new Animated.Value(0)).current;
  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (animated) {
      Animated.timing(animationProgress, {
        toValue: interestPercentage,
        duration: 1500,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }).start();
    } else {
      animationProgress.setValue(interestPercentage);
    }
  }, [interestPercentage]);

  const strokeDashoffset = animationProgress.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={styles.circularProgressContainer}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E8E9ED"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress Circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={DESIGN_COLORS.warmMustard}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View style={styles.circularProgressContent}>
        <Text style={styles.circularProgressLabel}>Principal</Text>
        <Text style={styles.circularProgressValue}>
          ₹{principal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </Text>
        <View style={styles.circularProgressLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: DESIGN_COLORS.warmMustard }]} />
            <Text style={styles.legendText}>Interest</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#E8E9ED' }]} />
            <Text style={styles.legendText}>Principal</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// Create animated circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Slider Component
const CustomSlider: React.FC<{
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  label: string;
  unit: string;
  icon: keyof typeof Ionicons.glyphMap;
}> = ({ value, min, max, step, onChange, label, unit, icon }) => {
  const progress = ((value - min) / (max - min)) * 100;
  const progressAnim = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, [progress]);

  const widthInterpolation = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <View style={styles.sliderLabelContainer}>
          <Ionicons name={icon} size={20} color={DESIGN_COLORS.warmMustard} />
          <Text style={styles.sliderLabel}>{label}</Text>
        </View>
        <Text style={styles.sliderValue}>
          {unit === '₹' ? '₹' : ''}{value.toLocaleString('en-IN')}{unit !== '₹' ? unit : ''}
        </Text>
      </View>
      
      <View style={styles.sliderTrack}>
        <Animated.View 
          style={[
            styles.sliderFill, 
            { width: widthInterpolation }
          ]} 
        />
        <View style={styles.sliderThumb} />
      </View>

      <View style={styles.sliderRange}>
        <Text style={styles.rangeText}>
          {unit === '₹' ? '₹' : ''}{min.toLocaleString('en-IN')}{unit !== '₹' ? unit : ''}
        </Text>
        <Text style={styles.rangeText}>
          {unit === '₹' ? '₹' : ''}{max.toLocaleString('en-IN')}{unit !== '₹' ? unit : ''}
        </Text>
      </View>
    </View>
  );
};

// Result Card Component
const ResultCard: React.FC<{
  result: EMIResult;
}> = ({ result }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, [result]);

  return (
    <Animated.View
      style={[
        styles.resultContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>EMI Breakdown</Text>
        <View style={styles.resultBadge}>
          <Ionicons name="calculator-outline" size={14} color={DESIGN_COLORS.warmMustard} />
        </View>
      </View>

      <View style={styles.emiHighlight}>
        <Text style={styles.emiLabel}>Monthly EMI</Text>
        <Text style={styles.emiValue}>
          ₹{result.monthlyEMI.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </Text>
      </View>

      <View style={styles.resultDetails}>
        <View style={styles.resultItem}>
          <View style={styles.resultItemIcon}>
            <Ionicons name="cash-outline" size={20} color={DESIGN_COLORS.warmMustard} />
          </View>
          <View style={styles.resultItemContent}>
            <Text style={styles.resultItemLabel}>Total Payment</Text>
            <Text style={styles.resultItemValue}>
              ₹{result.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </Text>
          </View>
        </View>

        <View style={styles.resultDivider} />

        <View style={styles.resultItem}>
          <View style={styles.resultItemIcon}>
            <Ionicons name="trending-up-outline" size={20} color={DESIGN_COLORS.goldenYellow} />
          </View>
          <View style={styles.resultItemContent}>
            <Text style={styles.resultItemLabel}>Total Interest</Text>
            <Text style={[styles.resultItemValue, { color: DESIGN_COLORS.goldenYellow }]}>
              ₹{result.totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function EMICalculatorScreen() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10.5);
  const [tenure, setTenure] = useState(36);
  const [emiResult, setEMIResult] = useState<EMIResult | null>(null);
  
  const headerFadeAnim = useRef(new Animated.Value(0)).current;
  const contentFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(contentFadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();

    // Calculate initial EMI
    calculateEMI();
  }, []);

  const calculateEMI = () => {
    if (loanAmount <= 0 || interestRate < 0 || tenure <= 0) {
      return;
    }

    const monthlyRate = interestRate / 12 / 100;
    const emi = monthlyRate === 0 
      ? loanAmount / tenure
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
        (Math.pow(1 + monthlyRate, tenure) - 1);
    const totalAmount = emi * tenure;
    const totalInterest = totalAmount - loanAmount;

    setEMIResult({
      monthlyEMI: emi,
      totalAmount: totalAmount,
      totalInterest: totalInterest,
      principal: loanAmount,
    });

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoanAmount(500000);
    setInterestRate(10.5);
    setTenure(36);
    
    setTimeout(() => {
      calculateEMI();
    }, 100);
  };

  const quickAmounts = [100000, 500000, 1000000, 2500000];
  const quickRates = [8.5, 10.5, 12.5, 15];
  const quickTenures = [12, 24, 36, 60];

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Animated Header */}
      <Animated.View style={[styles.header, { opacity: headerFadeAnim }]}>
        <LinearGradient
          colors={[DESIGN_COLORS.darkNavy, '#1A1E2E']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <Ionicons name="calculator" size={32} color={DESIGN_COLORS.goldenYellow} />
            </View>
            <Text style={styles.headerTitle}>EMI Calculator</Text>
            <Text style={styles.headerSubtitle}>
              Plan your loan with confidence
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: contentFadeAnim }]}>
        {/* Quick Stats Card */}
        {emiResult && (
          <View style={styles.quickStatsCard}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatLabel}>Monthly EMI</Text>
              <Text style={styles.quickStatValue}>
                ₹{emiResult.monthlyEMI.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStat}>
              <Text style={styles.quickStatLabel}>Total Interest</Text>
              <Text style={styles.quickStatValue}>
                ₹{emiResult.totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </Text>
            </View>
          </View>
        )}

        {/* Loan Amount Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loan Details</Text>
          
          <View style={styles.inputCard}>
            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>Loan Amount</Text>
              <Text style={styles.inputValue}>
                ₹{loanAmount.toLocaleString('en-IN')}
              </Text>
            </View>
            
            <View style={styles.quickChipsContainer}>
              {quickAmounts.map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={[
                    styles.quickChip,
                    loanAmount === amount && styles.quickChipActive,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setLoanAmount(amount);
                    setTimeout(calculateEMI, 50);
                  }}
                >
                  <Text
                    style={[
                      styles.quickChipText,
                      loanAmount === amount && styles.quickChipTextActive,
                    ]}
                  >
                    ₹{(amount / 100000).toFixed(1)}L
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.sliderWrapper}>
              <TouchableOpacity
                style={styles.sliderButton}
                onPress={() => {
                  const newValue = Math.max(10000, loanAmount - 10000);
                  setLoanAmount(newValue);
                  setTimeout(calculateEMI, 50);
                }}
              >
                <Ionicons name="remove" size={20} color={DESIGN_COLORS.darkNavy} />
              </TouchableOpacity>
              
              <View style={styles.sliderTrackContainer}>
                <Animated.View 
                  style={[
                    styles.sliderFillBar, 
                    { width: `${Math.min(100, (loanAmount / 5000000) * 100)}%` }
                  ]} 
                />
              </View>
              
              <TouchableOpacity
                style={styles.sliderButton}
                onPress={() => {
                  const newValue = Math.min(5000000, loanAmount + 10000);
                  setLoanAmount(newValue);
                  setTimeout(calculateEMI, 50);
                }}
              >
                <Ionicons name="add" size={20} color={DESIGN_COLORS.darkNavy} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Interest Rate Section */}
        <View style={styles.inputCard}>
          <View style={styles.inputHeader}>
            <Text style={styles.inputLabel}>Interest Rate</Text>
            <Text style={styles.inputValue}>{interestRate}% p.a.</Text>
          </View>
          
          <View style={styles.quickChipsContainer}>
            {quickRates.map((rate) => (
              <TouchableOpacity
                key={rate}
                style={[
                  styles.quickChip,
                  interestRate === rate && styles.quickChipActive,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setInterestRate(rate);
                  setTimeout(calculateEMI, 50);
                }}
              >
                <Text
                  style={[
                    styles.quickChipText,
                    interestRate === rate && styles.quickChipTextActive,
                  ]}
                >
                  {rate}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sliderWrapper}>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() => {
                const newValue = Math.max(5, interestRate - 0.5);
                setInterestRate(Number(newValue.toFixed(1)));
                setTimeout(calculateEMI, 50);
              }}
            >
              <Ionicons name="remove" size={20} color={DESIGN_COLORS.darkNavy} />
            </TouchableOpacity>
            
            <View style={styles.sliderTrackContainer}>
              <Animated.View 
                style={[
                  styles.sliderFillBar, 
                  { width: `${((interestRate - 5) / 20) * 100}%` }
                ]} 
              />
            </View>
            
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() => {
                const newValue = Math.min(25, interestRate + 0.5);
                setInterestRate(Number(newValue.toFixed(1)));
                setTimeout(calculateEMI, 50);
              }}
            >
              <Ionicons name="add" size={20} color={DESIGN_COLORS.darkNavy} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tenure Section */}
        <View style={styles.inputCard}>
          <View style={styles.inputHeader}>
            <Text style={styles.inputLabel}>Loan Tenure</Text>
            <Text style={styles.inputValue}>{tenure} Months</Text>
          </View>
          
          <View style={styles.quickChipsContainer}>
            {quickTenures.map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.quickChip,
                  tenure === t && styles.quickChipActive,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setTenure(t);
                  setTimeout(calculateEMI, 50);
                }}
              >
                <Text
                  style={[
                    styles.quickChipText,
                    tenure === t && styles.quickChipTextActive,
                  ]}
                >
                  {t} mo
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sliderWrapper}>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() => {
                const newValue = Math.max(6, tenure - 6);
                setTenure(newValue);
                setTimeout(calculateEMI, 50);
              }}
            >
              <Ionicons name="remove" size={20} color={DESIGN_COLORS.darkNavy} />
            </TouchableOpacity>
            
            <View style={styles.sliderTrackContainer}>
              <Animated.View 
                style={[
                  styles.sliderFillBar, 
                  { width: `${((tenure - 6) / 54) * 100}%` }
                ]} 
              />
            </View>
            
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() => {
                const newValue = Math.min(60, tenure + 6);
                setTenure(newValue);
                setTimeout(calculateEMI, 50);
              }}
            >
              <Ionicons name="add" size={20} color={DESIGN_COLORS.darkNavy} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.calculateButton}
            onPress={calculateEMI}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[DESIGN_COLORS.warmMustard, DESIGN_COLORS.goldenYellow]}
              style={styles.calculateGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="calculator-outline" size={20} color="#FFFFFF" />
              <Text style={styles.calculateButtonText}>Calculate EMI</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh-outline" size={20} color={DESIGN_COLORS.lightGray} />
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Results Section */}
        {emiResult && <ResultCard result={emiResult} />}

        {/* Circular Progress Visualization */}
        {emiResult && (
          <View style={styles.visualizationSection}>
            <Text style={styles.visualizationTitle}>Payment Breakdown</Text>
            <CircularProgress 
              principal={emiResult.principal} 
              interest={emiResult.totalInterest}
              animated={true}
            />
          </View>
        )}

        {/* Info Note */}
        <View style={styles.infoNote}>
          <Ionicons name="information-circle-outline" size={20} color={DESIGN_COLORS.lightGray} />
          <Text style={styles.infoNoteText}>
            This is an indicative EMI. Actual rates may vary based on your credit profile.
          </Text>
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
    backgroundColor: '#F8F9FC',
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Header
  header: {
    width: width,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
  },

  // Content
  content: {
    paddingHorizontal: 20,
    marginTop: -20,
  },

  // Quick Stats Card
  quickStatsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    marginBottom: 24,
    shadowColor: DESIGN_COLORS.darkNavy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  quickStat: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatDivider: {
    width: 1,
    backgroundColor: '#E8E9ED',
    marginHorizontal: 12,
  },
  quickStatLabel: {
    fontSize: 13,
    color: DESIGN_COLORS.lightGray,
    marginBottom: 8,
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: '800',
    color: DESIGN_COLORS.darkNavy,
  },

  // Section
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DESIGN_COLORS.darkNavy,
    marginBottom: 12,
  },

  // Input Card
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: DESIGN_COLORS.darkNavy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: DESIGN_COLORS.darkNavy,
  },
  inputValue: {
    fontSize: 18,
    fontWeight: '700',
    color: DESIGN_COLORS.warmMustard,
  },

  // Quick Chips
  quickChipsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  quickChip: {
    flex: 1,
    backgroundColor: '#F8F9FC',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E8E9ED',
  },
  quickChipActive: {
    backgroundColor: `${DESIGN_COLORS.warmMustard}15`,
    borderColor: DESIGN_COLORS.warmMustard,
  },
  quickChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: DESIGN_COLORS.lightGray,
  },
  quickChipTextActive: {
    color: DESIGN_COLORS.warmMustard,
  },

  // Slider
  sliderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F9FC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E9ED',
  },
  sliderTrackContainer: {
    flex: 1,
    height: 4,
    backgroundColor: '#E8E9ED',
    borderRadius: 2,
    overflow: 'hidden',
  },
  sliderFillBar: {
    height: '100%',
    backgroundColor: DESIGN_COLORS.warmMustard,
    borderRadius: 2,
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  calculateButton: {
    flex: 2,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: DESIGN_COLORS.warmMustard,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  calculateGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  calculateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resetButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#E8E9ED',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.lightGray,
  },

  // Result Container
  resultContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: DESIGN_COLORS.darkNavy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DESIGN_COLORS.darkNavy,
  },
  resultBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: `${DESIGN_COLORS.warmMustard}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emiHighlight: {
    alignItems: 'center',
    marginBottom: 24,
  },
  emiLabel: {
    fontSize: 14,
    color: DESIGN_COLORS.lightGray,
    marginBottom: 8,
  },
  emiValue: {
    fontSize: 40,
    fontWeight: '800',
    color: DESIGN_COLORS.darkNavy,
    letterSpacing: -0.5,
  },
  resultDetails: {
    gap: 12,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  resultItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8F9FC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultItemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultItemLabel: {
    fontSize: 14,
    color: DESIGN_COLORS.lightGray,
  },
  resultItemValue: {
    fontSize: 18,
    fontWeight: '700',
    color: DESIGN_COLORS.darkNavy,
  },
  resultDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },

  // Circular Progress
  visualizationSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  visualizationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_COLORS.darkNavy,
    marginBottom: 16,
  },
  circularProgressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularProgressContent: {
    position: 'absolute',
    alignItems: 'center',
  },
  circularProgressLabel: {
    fontSize: 12,
    color: DESIGN_COLORS.lightGray,
    marginBottom: 4,
  },
  circularProgressValue: {
    fontSize: 22,
    fontWeight: '800',
    color: DESIGN_COLORS.darkNavy,
    marginBottom: 12,
  },
  circularProgressLegend: {
    flexDirection: 'row',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: DESIGN_COLORS.lightGray,
  },

  // Info Note
  infoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8F9FC',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  infoNoteText: {
    flex: 1,
    fontSize: 12,
    color: DESIGN_COLORS.lightGray,
    lineHeight: 18,
  },

  bottomSpacing: {
    height: 20,
  },

  // Slider Component Styles
  sliderContainer: {
    marginBottom: 8,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sliderLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_COLORS.darkNavy,
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: '700',
    color: DESIGN_COLORS.warmMustard,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#E8E9ED',
    borderRadius: 3,
    position: 'relative',
    marginBottom: 8,
  },
  sliderFill: {
    height: '100%',
    backgroundColor: DESIGN_COLORS.warmMustard,
    borderRadius: 3,
    position: 'absolute',
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: DESIGN_COLORS.warmMustard,
    position: 'absolute',
    top: -7,
    right: -10,
    shadowColor: DESIGN_COLORS.darkNavy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeText: {
    fontSize: 12,
    color: DESIGN_COLORS.lightGray,
  },
});

// Add Platform import
import { Platform } from 'react-native';