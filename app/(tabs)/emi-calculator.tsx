import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Colors } from '@/constants/colors';

interface EMIResult {
  monthlyEMI: number;
  totalAmount: number;
  totalInterest: number;
}

export default function EMICalculatorScreen() {
  const [loanAmount, setLoanAmount] = useState('100000');
  const [interestRate, setInterestRate] = useState('12');
  const [tenure, setTenure] = useState('24');
  const [emiResult, setEMIResult] = useState<EMIResult | null>(null);

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount) || 0;
    const rate = parseFloat(interestRate) || 0;
    const months = parseFloat(tenure) || 0;

    if (principal <= 0 || rate < 0 || months <= 0) {
      alert('Please enter valid values');
      return;
    }

    const monthlyRate = rate / 12 / 100;
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;

    setEMIResult({
      monthlyEMI: emi,
      totalAmount: totalAmount,
      totalInterest: totalInterest,
    });
  };

  const handleReset = () => {
    setLoanAmount('100000');
    setInterestRate('12');
    setTenure('24');
    setEMIResult(null);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EMI Calculator</Text>
        <Text style={styles.headerSubtitle}>
          Calculate your monthly EMI in seconds
        </Text>
      </View>

      {/* Input Section */}
      <View style={styles.inputSection}>
        {/* Loan Amount */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Loan Amount (₹)</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.prefix}>₹</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter loan amount"
              placeholderTextColor={Colors.textTertiary}
              value={loanAmount}
              onChangeText={setLoanAmount}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={styles.quickButtonsContainer}>
            {['50000', '100000', '500000', '1000000'].map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.quickButton}
                onPress={() => setLoanAmount(amount)}
              >
                <Text style={styles.quickButtonText}>₹{(parseInt(amount) / 100000).toFixed(0)}L</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Interest Rate */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Interest Rate (% p.a.)</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter interest rate"
              placeholderTextColor={Colors.textTertiary}
              value={interestRate}
              onChangeText={setInterestRate}
              keyboardType="decimal-pad"
            />
            <Text style={styles.suffix}>%</Text>
          </View>
          <View style={styles.quickButtonsContainer}>
            {['8', '10', '12', '15'].map((rate) => (
              <TouchableOpacity
                key={rate}
                style={styles.quickButton}
                onPress={() => setInterestRate(rate)}
              >
                <Text style={styles.quickButtonText}>{rate}%</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Loan Tenure */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Loan Tenure (Months)</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter tenure in months"
              placeholderTextColor={Colors.textTertiary}
              value={tenure}
              onChangeText={setTenure}
              keyboardType="decimal-pad"
            />
            <Text style={styles.suffix}>mo</Text>
          </View>
          <View style={styles.quickButtonsContainer}>
            {['12', '24', '36', '60'].map((t) => (
              <TouchableOpacity
                key={t}
                style={styles.quickButton}
                onPress={() => setTenure(t)}
              >
                <Text style={styles.quickButtonText}>{t}mo</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Button Group */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.calculateButton}
          onPress={calculateEMI}
          activeOpacity={0.7}
        >
          <Text style={styles.calculateButtonText}>Calculate EMI</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Results Section */}
      {emiResult && (
        <View style={styles.resultSection}>
          <Text style={styles.resultTitle}>Your EMI Details</Text>

          <View style={styles.resultCard}>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Monthly EMI</Text>
              <Text style={styles.resultValue}>
                ₹{emiResult.monthlyEMI.toLocaleString('en-IN', {
                  maximumFractionDigits: 0,
                })}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Total Amount Payable</Text>
              <Text style={styles.resultValue}>
                ₹{emiResult.totalAmount.toLocaleString('en-IN', {
                  maximumFractionDigits: 0,
                })}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Total Interest Amount</Text>
              <Text style={styles.resultValue}>
                ₹{emiResult.totalInterest.toLocaleString('en-IN', {
                  maximumFractionDigits: 0,
                })}
              </Text>
            </View>
          </View>

          {/* Breakdown Info */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>
              💡 You'll pay ₹
              {emiResult.totalInterest.toLocaleString('en-IN', {
                maximumFractionDigits: 0,
              })}{' '}
              as interest
            </Text>
          </View>
        </View>
      )}

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
  },
  inputSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  prefix: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginRight: 8,
  },
  suffix: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  quickButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  quickButton: {
    flex: 1,
    backgroundColor: Colors.surfaceDark,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  calculateButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculateButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  resetButton: {
    flex: 1,
    backgroundColor: Colors.surfaceDark,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resetButtonText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  resultSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  resultCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  resultLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
  },
  infoBox: {
    backgroundColor: Colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.darkCharcoal,
  },
  bottomSpacing: {
    height: 80,
  },
});
