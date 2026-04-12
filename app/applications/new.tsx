import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useAuth } from '@/store/authStore';
import * as loanService from '@/services/loan.service';
import { Colors } from '@/constants/colors';

type Step = 1 | 2 | 3 | 4 | 5;

interface FormData {
  // Personal Details
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  city: string;
  pincode: string;
  // Loan Details
  loanType: string;
  loanAmount: string;
  companyName: string;
  monthlyIncome: string;
  existingEmi: string;
  primaryBank: string;
  cibilScore: string;
  bankStatementPdf: string;
  // KYC Details
  aadharNumber: string;
  panNumber: string;
  aadharFrontImage: string;
  aadharBackImage: string;
  aadharPdf: string;
  panCardImage: string;
  panCardPdf: string;
  nomineeName: string;
  nomineeRelation: string;
  // Payment Details
  paymentMethod: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const LOAN_TYPES = [
  'Personal',
  'Home',
  'Business',
  'Education',
  'Loan Against Property',
  'Loan Against Credit Card',
];

export default function NewLoanApplicationScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dob: '',
    gender: '',
    address: user?.address || '',
    city: user?.city || '',
    pincode: user?.pincode || '',
    loanType: 'Personal',
    loanAmount: '',
    companyName: '',
    monthlyIncome: '',
    existingEmi: '',
    primaryBank: '',
    cibilScore: '',
    bankStatementPdf: '',
    aadharNumber: '',
    panNumber: '',
    aadharFrontImage: '',
    aadharBackImage: '',
    aadharPdf: '',
    panCardImage: '',
    panCardPdf: '',
    nomineeName: '',
    nomineeRelation: '',
    paymentMethod: 'Credit Card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateStep = (step: Step): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      // Personal Details validation
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email';
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
      if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, '')))
        newErrors.phone = 'Phone must be 10 digits';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    } else if (step === 2) {
      // Loan Details validation
      if (!formData.loanType) newErrors.loanType = 'Loan type is required';
      if (!formData.loanAmount) newErrors.loanAmount = 'Loan amount is required';
      if (isNaN(parseFloat(formData.loanAmount)))
        newErrors.loanAmount = 'Loan amount must be a number';
    } else if (step === 3) {
      // KYC Details validation
      if (!formData.aadharNumber) newErrors.aadharNumber = 'Aadhar number is required';
      if (!/^\d{12}$/.test(formData.aadharNumber))
        newErrors.aadharNumber = 'Aadhar must be 12 digits';
      if (!formData.panNumber) newErrors.panNumber = 'PAN number is required';
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.panNumber))
        newErrors.panNumber = 'Invalid PAN format';
      if (!formData.nomineeName) newErrors.nomineeName = 'Nominee name is required';
    } else if (step === 5) {
      // Payment Details validation
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, '')))
        newErrors.cardNumber = 'Card number must be 16 digits';
      if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
      if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate))
        newErrors.expiryDate = 'Format must be MM/YY';
      if (!formData.cvv) newErrors.cvv = 'CVV is required';
      if (!/^\d{3,4}$/.test(formData.cvv))
        newErrors.cvv = 'CVV must be 3-4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep((currentStep + 1) as Step);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const applicationData: loanService.LoanApplicationData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob || undefined,
        gender: formData.gender || undefined,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        loanType: formData.loanType,
        loanAmount: parseFloat(formData.loanAmount),
        companyName: formData.companyName || undefined,
        monthlyIncome: formData.monthlyIncome ? parseFloat(formData.monthlyIncome) : undefined,
        existingEmi: formData.existingEmi ? parseFloat(formData.existingEmi) : undefined,
        primaryBank: formData.primaryBank || undefined,
        cibilScore: formData.cibilScore || undefined,
        bankStatementPdf: formData.bankStatementPdf || undefined,
        aadharNumber: formData.aadharNumber,
        panNumber: formData.panNumber,
        aadharFrontImage: formData.aadharFrontImage || undefined,
        aadharBackImage: formData.aadharBackImage || undefined,
        aadharPdf: formData.aadharPdf || undefined,
        panCardImage: formData.panCardImage || undefined,
        panCardPdf: formData.panCardPdf || undefined,
        nomineeName: formData.nomineeName,
        nomineeRelation: formData.nomineeRelation || undefined,
        paymentMethod: formData.paymentMethod,
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
      };

      await loanService.createLoanApplication(applicationData);

      Alert.alert(
        'Success',
        'Loan application submitted successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/(tabs)/profile');
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4, 5].map((step) => (
        <View key={step} style={styles.stepItem}>
          <View
            style={[
              styles.stepCircle,
              currentStep >= step && styles.stepCircleActive,
            ]}
          >
            <Text
              style={[
                styles.stepNumber,
                currentStep >= step && styles.stepNumberActive,
              ]}
            >
              {step}
            </Text>
          </View>
          {step < 5 && (
            <View
              style={[
                styles.stepLine,
                currentStep > step && styles.stepLineActive,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View>
      <Text style={styles.stepTitle}>Personal Details</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={[styles.input, errors.fullName && styles.inputError]}
          placeholder="Enter full name"
          value={formData.fullName}
          onChangeText={(value) => handleInputChange('fullName', value)}
        />
        {errors.fullName && <Text style={styles.errorMessage}>{errors.fullName}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Enter email"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
        />
        {errors.email && <Text style={styles.errorMessage}>{errors.email}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone *</Text>
        <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          placeholder="10-digit phone number"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
        />
        {errors.phone && <Text style={styles.errorMessage}>{errors.phone}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date of Birth (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={formData.dob}
          onChangeText={(value) => handleInputChange('dob', value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender</Text>
        <TextInput
          style={styles.input}
          placeholder="M/F/Other"
          value={formData.gender}
          onChangeText={(value) => handleInputChange('gender', value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Address *</Text>
        <TextInput
          style={[styles.input, styles.multilineInput, errors.address && styles.inputError]}
          placeholder="Enter address"
          multiline
          numberOfLines={3}
          value={formData.address}
          onChangeText={(value) => handleInputChange('address', value)}
        />
        {errors.address && <Text style={styles.errorMessage}>{errors.address}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>City *</Text>
        <TextInput
          style={[styles.input, errors.city && styles.inputError]}
          placeholder="Enter city"
          value={formData.city}
          onChangeText={(value) => handleInputChange('city', value)}
        />
        {errors.city && <Text style={styles.errorMessage}>{errors.city}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Pincode *</Text>
        <TextInput
          style={[styles.input, errors.pincode && styles.inputError]}
          placeholder="6-digit pincode"
          keyboardType="number-pad"
          value={formData.pincode}
          onChangeText={(value) => handleInputChange('pincode', value)}
        />
        {errors.pincode && <Text style={styles.errorMessage}>{errors.pincode}</Text>}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.stepTitle}>Loan Details</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Loan Type *</Text>
        <View style={[styles.input, styles.pickerContainer, errors.loanType && styles.inputError]}>
          <Picker
            selectedValue={formData.loanType}
            onValueChange={(value) => handleInputChange('loanType', value)}
            style={styles.picker}
          >
            {LOAN_TYPES.map((type) => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>
        </View>
        {errors.loanType && <Text style={styles.errorMessage}>{errors.loanType}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Loan Amount (₹) *</Text>
        <TextInput
          style={[styles.input, errors.loanAmount && styles.inputError]}
          placeholder="Enter loan amount"
          keyboardType="decimal-pad"
          value={formData.loanAmount}
          onChangeText={(value) => handleInputChange('loanAmount', value)}
        />
        {errors.loanAmount && <Text style={styles.errorMessage}>{errors.loanAmount}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Company Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Company name (for business loans)"
          value={formData.companyName}
          onChangeText={(value) => handleInputChange('companyName', value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Monthly Income (₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter monthly income"
          keyboardType="decimal-pad"
          value={formData.monthlyIncome}
          onChangeText={(value) => handleInputChange('monthlyIncome', value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Existing EMI (₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="Total existing EMI"
          keyboardType="decimal-pad"
          value={formData.existingEmi}
          onChangeText={(value) => handleInputChange('existingEmi', value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Primary Bank</Text>
        <TextInput
          style={styles.input}
          placeholder="Your primary bank"
          value={formData.primaryBank}
          onChangeText={(value) => handleInputChange('primaryBank', value)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>CIBIL Score</Text>
        <TextInput
          style={styles.input}
          placeholder="Your CIBIL score"
          keyboardType="number-pad"
          value={formData.cibilScore}
          onChangeText={(value) => handleInputChange('cibilScore', value)}
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.stepTitle}>KYC Details</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Aadhar Number *</Text>
        <TextInput
          style={[styles.input, errors.aadharNumber && styles.inputError]}
          placeholder="12-digit Aadhar number"
          keyboardType="number-pad"
          value={formData.aadharNumber}
          onChangeText={(value) => handleInputChange('aadharNumber', value)}
        />
        {errors.aadharNumber && <Text style={styles.errorMessage}>{errors.aadharNumber}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Aadhar PDF (Filename or URL)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., aadhar.pdf or file path"
          value={formData.aadharPdf}
          onChangeText={(value) => handleInputChange('aadharPdf', value)}
        />
        <Text style={styles.helperText}>Upload PDF file or provide file reference</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>PAN Number *</Text>
        <TextInput
          style={[styles.input, errors.panNumber && styles.inputError]}
          placeholder="PAN format: AAAAA0000A"
          value={formData.panNumber.toUpperCase()}
          onChangeText={(value) => handleInputChange('panNumber', value.toUpperCase())}
        />
        {errors.panNumber && <Text style={styles.errorMessage}>{errors.panNumber}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>PAN PDF (Filename or URL)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., pan.pdf or file path"
          value={formData.panCardPdf}
          onChangeText={(value) => handleInputChange('panCardPdf', value)}
        />
        <Text style={styles.helperText}>Upload PDF file or provide file reference</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nominee Name *</Text>
        <TextInput
          style={[styles.input, errors.nomineeName && styles.inputError]}
          placeholder="Enter nominee name"
          value={formData.nomineeName}
          onChangeText={(value) => handleInputChange('nomineeName', value)}
        />
        {errors.nomineeName && <Text style={styles.errorMessage}>{errors.nomineeName}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Relation with Nominee</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Spouse, Parent, etc."
          value={formData.nomineeRelation}
          onChangeText={(value) => handleInputChange('nomineeRelation', value)}
        />
      </View>

      <View style={styles.noteContainer}>
        <Text style={styles.noteTitle}>📄 Document Upload</Text>
        <Text style={styles.noteText}>
          Please have scanned/photographed copies of Aadhar, PAN, and bank statements ready. You can upload them here or provide file references.
        </Text>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View>
      <Text style={styles.stepTitle}>Review & Confirm</Text>
      
      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Personal Details</Text>
        <ReviewRow label="Name" value={formData.fullName} />
        <ReviewRow label="Email" value={formData.email} />
        <ReviewRow label="Phone" value={formData.phone} />
        <ReviewRow label="Address" value={formData.address} />
        <ReviewRow label="City, Pincode" value={`${formData.city}, ${formData.pincode}`} />
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Loan Details</Text>
        <ReviewRow label="Loan Type" value={formData.loanType} />
        <ReviewRow label="Loan Amount" value={`₹${formData.loanAmount}`} />
        {formData.monthlyIncome && <ReviewRow label="Monthly Income" value={`₹${formData.monthlyIncome}`} />}
        {formData.existingEmi && <ReviewRow label="Existing EMI" value={`₹${formData.existingEmi}`} />}
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>KYC Details</Text>
        <ReviewRow label="Aadhar" value={`****${formData.aadharNumber.slice(-4)}`} />
        <ReviewRow label="PAN" value={formData.panNumber} />
        <ReviewRow label="Nominee" value={formData.nomineeName} />
      </View>

      <View style={styles.agreeContainer}>
        <Text style={styles.agreeText}>
          ✓ I confirm that all the information provided is true and accurate.
        </Text>
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View>
      <Text style={styles.stepTitle}>Payment Details</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Payment Method *</Text>
        <View style={[styles.input, styles.pickerContainer, errors.paymentMethod && styles.inputError]}>
          <Picker
            selectedValue={formData.paymentMethod}
            onValueChange={(value) => handleInputChange('paymentMethod', value)}
            style={styles.picker}
          >
            <Picker.Item label="Credit Card" value="Credit Card" />
            <Picker.Item label="Debit Card" value="Debit Card" />
          </Picker>
        </View>
        {errors.paymentMethod && <Text style={styles.errorMessage}>{errors.paymentMethod}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Card Number *</Text>
        <TextInput
          style={[styles.input, errors.cardNumber && styles.inputError]}
          placeholder="16-digit card number"
          keyboardType="number-pad"
          value={formData.cardNumber}
          onChangeText={(value) => {
            // Format with spaces for readability
            const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
            handleInputChange('cardNumber', formatted);
          }}
          maxLength={19}
        />
        {errors.cardNumber && <Text style={styles.errorMessage}>{errors.cardNumber}</Text>}
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Expiry Date (MM/YY) *</Text>
          <TextInput
            style={[styles.input, errors.expiryDate && styles.inputError]}
            placeholder="MM/YY"
            keyboardType="number-pad"
            value={formData.expiryDate}
            onChangeText={(value) => {
              // Auto-format as MM/YY
              let formatted = value.replace(/\D/g, '');
              if (formatted.length >= 2) {
                formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4);
              }
              handleInputChange('expiryDate', formatted);
            }}
            maxLength={5}
          />
          {errors.expiryDate && <Text style={styles.errorMessage}>{errors.expiryDate}</Text>}
        </View>

        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.label}>CVV *</Text>
          <TextInput
            style={[styles.input, errors.cvv && styles.inputError]}
            placeholder="CVV"
            keyboardType="number-pad"
            secureTextEntry
            value={formData.cvv}
            onChangeText={(value) => handleInputChange('cvv', value.replace(/\D/g, ''))}
            maxLength={4}
          />
          {errors.cvv && <Text style={styles.errorMessage}>{errors.cvv}</Text>}
        </View>
      </View>

      <View style={styles.securityContainer}>
        <Text style={styles.securityTitle}>🔒 Secure Payment</Text>
        <Text style={styles.securityText}>
          Your payment information is encrypted and secure. We never store your full card details.
        </Text>
      </View>

      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
          ✓ By clicking Submit, you agree to provide your card details for loan processing. Your information will be kept confidential and secure.
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {renderStepIndicator()}
        
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
        {currentStep === 5 && renderStep5()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={[styles.navButton, styles.prevButton]}
            onPress={handlePrevious}
            disabled={isSubmitting}
          >
            <Text style={styles.prevButtonText}>← Previous</Text>
          </TouchableOpacity>
        )}

        {currentStep < 5 ? (
          <TouchableOpacity
            style={[styles.navButton, styles.nextButton, currentStep === 1 && { flex: 1 }]}
            onPress={handleNext}
            disabled={isSubmitting}
          >
            <Text style={styles.nextButtonText}>Next →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navButton, styles.submitButton, currentStep === 5 && { flex: 1 }]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.submitButtonText}>Submit Application</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.reviewRow}>
      <Text style={styles.reviewLabel}>{label}</Text>
      <Text style={styles.reviewValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 100,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: Colors.primary,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  stepNumberActive: {
    color: Colors.white,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: Colors.primary,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  multilineInput: {
    textAlignVertical: 'top',
  },
  pickerContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    overflow: 'hidden',
  },
  picker: {
    color: Colors.textPrimary,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorMessage: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
  noteContainer: {
    backgroundColor: '#F0F9FF',
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    padding: 12,
    borderRadius: 6,
    marginVertical: 16,
  },
  noteTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  noteText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  reviewSection: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  reviewSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  reviewLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  reviewValue: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  agreeContainer: {
    backgroundColor: '#F0FFF4',
    borderLeftWidth: 3,
    borderLeftColor: '#34C759',
    padding: 12,
    borderRadius: 6,
    marginVertical: 16,
  },
  agreeText: {
    fontSize: 13,
    color: '#27AE60',
    lineHeight: 20,
    fontWeight: '500',
  },
  navigationContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  navButton: {
    flex: 0.5,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  nextButton: {
    backgroundColor: Colors.primary,
  },
  submitButton: {
    backgroundColor: Colors.primary,
  },
  prevButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  helperText: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  securityContainer: {
    backgroundColor: '#F0FFF4',
    borderLeftWidth: 3,
    borderLeftColor: '#34C759',
    padding: 12,
    borderRadius: 6,
    marginVertical: 16,
  },
  securityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#27AE60',
    marginBottom: 6,
  },
  securityText: {
    fontSize: 12,
    color: '#27AE60',
    lineHeight: 18,
  },
  termsContainer: {
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 3,
    borderLeftColor: '#FF9500',
    padding: 12,
    borderRadius: 6,
    marginVertical: 16,
  },
  termsText: {
    fontSize: 12,
    color: '#E65100',
    lineHeight: 18,
  },
});
