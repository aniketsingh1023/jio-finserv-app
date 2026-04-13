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
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  city: string;
  pincode: string;

  loanType: string;
  loanAmount: string;
  companyName: string;
  monthlyIncome: string;
  existingEmi: string;
  primaryBank: string;
  cibilScore: string;
  bankStatementPdf: string;

  aadharNumber: string;
  panNumber: string;
  aadharFrontImage: string;
  aadharBackImage: string;
  aadharPdf: string;
  panCardImage: string;
  panCardPdf: string;
  nomineeName: string;
  nomineeRelation: string;

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

const GENDER_OPTIONS = ['', 'Male', 'Female', 'Other'];
const PAYMENT_METHODS = ['Credit Card', 'Debit Card'];

const onlyLettersAndSpaces = (value: string) => value.replace(/[^A-Za-z ]/g, '');
const onlyDigits = (value: string) => value.replace(/\D/g, '');
const onlyDecimal = (value: string) => {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length <= 1) return cleaned;
  return `${parts[0]}.${parts.slice(1).join('')}`;
};

const isValidDateString = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
};

const isValidExpiry = (value: string) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(value);

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
    let sanitizedValue = value;

    switch (field) {
      case 'fullName':
      case 'city':
      case 'nomineeName':
      case 'nomineeRelation':
        sanitizedValue = onlyLettersAndSpaces(value);
        break;

      case 'companyName':
      case 'primaryBank':
        sanitizedValue = value.replace(/[^A-Za-z0-9 .,&()-]/g, '');
        break;

      case 'phone':
        sanitizedValue = onlyDigits(value).slice(0, 10);
        break;

      case 'pincode':
        sanitizedValue = onlyDigits(value).slice(0, 6);
        break;

      case 'loanAmount':
      case 'monthlyIncome':
      case 'existingEmi':
        sanitizedValue = onlyDecimal(value);
        break;

      case 'cibilScore':
        sanitizedValue = onlyDigits(value).slice(0, 3);
        break;

      case 'aadharNumber':
        sanitizedValue = onlyDigits(value).slice(0, 12);
        break;

      case 'panNumber':
        sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 10);
        break;

      case 'cardNumber': {
        const digits = onlyDigits(value).slice(0, 16);
        sanitizedValue = digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
        break;
      }

      case 'expiryDate': {
        const digits = onlyDigits(value).slice(0, 4);
        if (digits.length <= 2) {
          sanitizedValue = digits;
        } else {
          sanitizedValue = `${digits.slice(0, 2)}/${digits.slice(2)}`;
        }
        break;
      }

      case 'cvv':
        sanitizedValue = onlyDigits(value).slice(0, 4);
        break;

      case 'email':
        sanitizedValue = value.trim().toLowerCase();
        break;

      case 'dob':
        sanitizedValue = value.replace(/[^\d-]/g, '').slice(0, 10);
        break;

      default:
        sanitizedValue = value;
    }

    setFormData((prev) => ({ ...prev, [field]: sanitizedValue }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: Step): boolean => {
    const newErrors: Record<string, string> = {};

    const nameRegex = /^[A-Za-z ]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const cityRegex = /^[A-Za-z ]+$/;
    const pincodeRegex = /^\d{6}$/;
    const aadharRegex = /^\d{12}$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      } else if (!nameRegex.test(formData.fullName.trim())) {
        newErrors.fullName = 'Only letters and spaces are allowed';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Email must be a valid @gmail.com address';
      }

      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone is required';
      } else if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Phone number must be 10 digits and start with 6-9';
      }

      if (formData.dob && !isValidDateString(formData.dob)) {
        newErrors.dob = 'Date of birth must be in YYYY-MM-DD format';
      }

      if (formData.gender && !GENDER_OPTIONS.includes(formData.gender)) {
        newErrors.gender = 'Please select a valid gender';
      }

      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
      }

      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      } else if (!cityRegex.test(formData.city.trim())) {
        newErrors.city = 'City can contain only letters and spaces';
      }

      if (!formData.pincode.trim()) {
        newErrors.pincode = 'Pincode is required';
      } else if (!pincodeRegex.test(formData.pincode)) {
        newErrors.pincode = 'Pincode must be exactly 6 digits';
      }
    }

    if (step === 2) {
      if (!formData.loanType) {
        newErrors.loanType = 'Loan type is required';
      }

      if (!formData.loanAmount.trim()) {
        newErrors.loanAmount = 'Loan amount is required';
      } else if (isNaN(Number(formData.loanAmount)) || Number(formData.loanAmount) <= 0) {
        newErrors.loanAmount = 'Loan amount must be a positive number';
      }

      if (formData.monthlyIncome) {
        if (isNaN(Number(formData.monthlyIncome)) || Number(formData.monthlyIncome) <= 0) {
          newErrors.monthlyIncome = 'Monthly income must be a positive number';
        }
      }

      if (formData.existingEmi) {
        if (isNaN(Number(formData.existingEmi)) || Number(formData.existingEmi) < 0) {
          newErrors.existingEmi = 'Existing EMI cannot be negative';
        }
      }

      if (formData.cibilScore) {
        const score = Number(formData.cibilScore);
        if (isNaN(score) || score < 300 || score > 900) {
          newErrors.cibilScore = 'CIBIL score must be between 300 and 900';
        }
      }

      if (formData.companyName && formData.companyName.trim().length < 2) {
        newErrors.companyName = 'Company name must be at least 2 characters';
      }

      if (formData.primaryBank && formData.primaryBank.trim().length < 2) {
        newErrors.primaryBank = 'Primary bank name must be at least 2 characters';
      }
    }

    if (step === 3) {
      if (!formData.aadharNumber.trim()) {
        newErrors.aadharNumber = 'Aadhar number is required';
      } else if (!aadharRegex.test(formData.aadharNumber)) {
        newErrors.aadharNumber = 'Aadhar number must be exactly 12 digits';
      }

      if (!formData.panNumber.trim()) {
        newErrors.panNumber = 'PAN number is required';
      } else if (!panRegex.test(formData.panNumber)) {
        newErrors.panNumber = 'PAN format must be AAAAA0000A';
      }

      if (!formData.nomineeName.trim()) {
        newErrors.nomineeName = 'Nominee name is required';
      } else if (!nameRegex.test(formData.nomineeName.trim())) {
        newErrors.nomineeName = 'Nominee name can contain only letters and spaces';
      }

      if (formData.nomineeRelation && !nameRegex.test(formData.nomineeRelation.trim())) {
        newErrors.nomineeRelation = 'Relation can contain only letters and spaces';
      }
    }

    if (step === 5) {
      const cardNumber = formData.cardNumber.replace(/\s/g, '');

      if (!formData.paymentMethod) {
        newErrors.paymentMethod = 'Payment method is required';
      }

      if (!cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(cardNumber)) {
        newErrors.cardNumber = 'Card number must be exactly 16 digits';
      }

      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!isValidExpiry(formData.expiryDate)) {
        newErrors.expiryDate = 'Expiry date must be in MM/YY format';
      }

      if (!formData.cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'CVV must be 3 or 4 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    const isValid = validateStep(currentStep);

    if (!isValid) {
      Alert.alert('Validation Error', 'Please correct the highlighted fields before continuing.');
      return;
    }

    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    const isStep1Valid = validateStep(1);
    const isStep2Valid = validateStep(2);
    const isStep3Valid = validateStep(3);
    const isStep5Valid = validateStep(5);

    if (!isStep1Valid || !isStep2Valid || !isStep3Valid || !isStep5Valid) {
      Alert.alert('Data entered in wrong Format', 'Please enter the data in correct format in the highlighted fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const applicationData: loanService.LoanApplicationData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone,
        dob: formData.dob || undefined,
        gender: formData.gender || undefined,
        address: formData.address.trim(),
        city: formData.city.trim(),
        pincode: formData.pincode,
        loanType: formData.loanType,
        loanAmount: parseFloat(formData.loanAmount),
        companyName: formData.companyName.trim() || undefined,
        monthlyIncome: formData.monthlyIncome ? parseFloat(formData.monthlyIncome) : undefined,
        existingEmi: formData.existingEmi ? parseFloat(formData.existingEmi) : undefined,
        primaryBank: formData.primaryBank.trim() || undefined,
        cibilScore: formData.cibilScore || undefined,
        bankStatementPdf: formData.bankStatementPdf || undefined,
        aadharNumber: formData.aadharNumber,
        panNumber: formData.panNumber,
        aadharFrontImage: formData.aadharFrontImage || undefined,
        aadharBackImage: formData.aadharBackImage || undefined,
        aadharPdf: formData.aadharPdf || undefined,
        panCardImage: formData.panCardImage || undefined,
        panCardPdf: formData.panCardPdf || undefined,
        nomineeName: formData.nomineeName.trim(),
        nomineeRelation: formData.nomineeRelation.trim() || undefined,
        paymentMethod: formData.paymentMethod,
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
      };

      await loanService.createLoanApplication(applicationData);

      Alert.alert('Success', 'Loan application submitted successfully!', [
        {
          text: 'OK',
          onPress: () => {
            router.replace('/(tabs)/profile');
          },
        },
      ]);
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
        {errors.fullName ? <Text style={styles.errorMessage}>{errors.fullName}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
        />
        {errors.email ? <Text style={styles.errorMessage}>{errors.email}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone *</Text>
        <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          placeholder="10-digit phone number"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
          maxLength={10}
        />
        {errors.phone ? <Text style={styles.errorMessage}>{errors.phone}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date of Birth(YYYY-MM-DD)</Text>
        <TextInput
          style={[styles.input, errors.dob && styles.inputError]}
          placeholder="YYYY-MM-DD"
          value={formData.dob}
          onChangeText={(value) => handleInputChange('dob', value)}
          maxLength={10}
        />
        {errors.dob ? <Text style={styles.errorMessage}>{errors.dob}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender</Text>
        <View style={[styles.input, styles.pickerContainer, errors.gender && styles.inputError]}>
          <Picker
            selectedValue={formData.gender}
            onValueChange={(value) => handleInputChange('gender', value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
        {errors.gender ? <Text style={styles.errorMessage}>{errors.gender}</Text> : null}
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
        {errors.address ? <Text style={styles.errorMessage}>{errors.address}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>City *</Text>
        <TextInput
          style={[styles.input, errors.city && styles.inputError]}
          placeholder="Enter city"
          value={formData.city}
          onChangeText={(value) => handleInputChange('city', value)}
        />
        {errors.city ? <Text style={styles.errorMessage}>{errors.city}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Pincode *</Text>
        <TextInput
          style={[styles.input, errors.pincode && styles.inputError]}
          placeholder="6-digit pincode"
          keyboardType="number-pad"
          value={formData.pincode}
          onChangeText={(value) => handleInputChange('pincode', value)}
          maxLength={6}
        />
        {errors.pincode ? <Text style={styles.errorMessage}>{errors.pincode}</Text> : null}
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
        {errors.loanType ? <Text style={styles.errorMessage}>{errors.loanType}</Text> : null}
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
        {errors.loanAmount ? <Text style={styles.errorMessage}>{errors.loanAmount}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Company Name</Text>
        <TextInput
          style={[styles.input, errors.companyName && styles.inputError]}
          placeholder="Company name (for business loans)"
          value={formData.companyName}
          onChangeText={(value) => handleInputChange('companyName', value)}
        />
        {errors.companyName ? <Text style={styles.errorMessage}>{errors.companyName}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Monthly Income (₹)</Text>
        <TextInput
          style={[styles.input, errors.monthlyIncome && styles.inputError]}
          placeholder="Enter monthly income"
          keyboardType="decimal-pad"
          value={formData.monthlyIncome}
          onChangeText={(value) => handleInputChange('monthlyIncome', value)}
        />
        {errors.monthlyIncome ? <Text style={styles.errorMessage}>{errors.monthlyIncome}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Existing EMI (₹)</Text>
        <TextInput
          style={[styles.input, errors.existingEmi && styles.inputError]}
          placeholder="Total existing EMI"
          keyboardType="decimal-pad"
          value={formData.existingEmi}
          onChangeText={(value) => handleInputChange('existingEmi', value)}
        />
        {errors.existingEmi ? <Text style={styles.errorMessage}>{errors.existingEmi}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Primary Bank</Text>
        <TextInput
          style={[styles.input, errors.primaryBank && styles.inputError]}
          placeholder="Your primary bank"
          value={formData.primaryBank}
          onChangeText={(value) => handleInputChange('primaryBank', value)}
        />
        {errors.primaryBank ? <Text style={styles.errorMessage}>{errors.primaryBank}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>CIBIL Score</Text>
        <TextInput
          style={[styles.input, errors.cibilScore && styles.inputError]}
          placeholder="300 - 900"
          keyboardType="number-pad"
          value={formData.cibilScore}
          onChangeText={(value) => handleInputChange('cibilScore', value)}
          maxLength={3}
        />
        {errors.cibilScore ? <Text style={styles.errorMessage}>{errors.cibilScore}</Text> : null}
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
          maxLength={12}
        />
        {errors.aadharNumber ? <Text style={styles.errorMessage}>{errors.aadharNumber}</Text> : null}
      </View>

      

      <View style={styles.inputGroup}>
        <Text style={styles.label}>PAN Number *</Text>
        <TextInput
          style={[styles.input, errors.panNumber && styles.inputError]}
          placeholder="PAN format: AAAAA0000A"
          autoCapitalize="characters"
          value={formData.panNumber}
          onChangeText={(value) => handleInputChange('panNumber', value)}
          maxLength={10}
        />
        {errors.panNumber ? <Text style={styles.errorMessage}>{errors.panNumber}</Text> : null}
      </View>

      

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nominee Name *</Text>
        <TextInput
          style={[styles.input, errors.nomineeName && styles.inputError]}
          placeholder="Enter nominee name"
          value={formData.nomineeName}
          onChangeText={(value) => handleInputChange('nomineeName', value)}
        />
        {errors.nomineeName ? <Text style={styles.errorMessage}>{errors.nomineeName}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Relation with Nominee</Text>
        <TextInput
          style={[styles.input, errors.nomineeRelation && styles.inputError]}
          placeholder="e.g., Spouse, Parent, etc."
          value={formData.nomineeRelation}
          onChangeText={(value) => handleInputChange('nomineeRelation', value)}
        />
        {errors.nomineeRelation ? <Text style={styles.errorMessage}>{errors.nomineeRelation}</Text> : null}
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
        <ReviewRow label="DOB" value={formData.dob || '-'} />
        <ReviewRow label="Gender" value={formData.gender || '-'} />
        <ReviewRow label="Address" value={formData.address} />
        <ReviewRow label="City, Pincode" value={`${formData.city}, ${formData.pincode}`} />
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Loan Details</Text>
        <ReviewRow label="Loan Type" value={formData.loanType} />
        <ReviewRow label="Loan Amount" value={`₹${formData.loanAmount || '-'}`} />
        {formData.companyName ? <ReviewRow label="Company Name" value={formData.companyName} /> : null}
        {formData.monthlyIncome ? <ReviewRow label="Monthly Income" value={`₹${formData.monthlyIncome}`} /> : null}
        {formData.existingEmi ? <ReviewRow label="Existing EMI" value={`₹${formData.existingEmi}`} /> : null}
        {formData.primaryBank ? <ReviewRow label="Primary Bank" value={formData.primaryBank} /> : null}
        {formData.cibilScore ? <ReviewRow label="CIBIL Score" value={formData.cibilScore} /> : null}
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>KYC Details</Text>
        <ReviewRow
          label="Aadhar"
          value={formData.aadharNumber ? `********${formData.aadharNumber.slice(-4)}` : '-'}
        />
        <ReviewRow label="PAN" value={formData.panNumber || '-'} />
        <ReviewRow label="Nominee" value={formData.nomineeName || '-'} />
        <ReviewRow label="Relation" value={formData.nomineeRelation || '-'} />
      </View>

      <View style={styles.agreeContainer}>
        <Text style={styles.agreeText}>
           I confirm that all the information provided is true and accurate.
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
            {PAYMENT_METHODS.map((method) => (
              <Picker.Item key={method} label={method} value={method} />
            ))}
          </Picker>
        </View>
        {errors.paymentMethod ? <Text style={styles.errorMessage}>{errors.paymentMethod}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Card Number *</Text>
        <TextInput
          style={[styles.input, errors.cardNumber && styles.inputError]}
          placeholder="16-digit card number"
          keyboardType="number-pad"
          value={formData.cardNumber}
          onChangeText={(value) => handleInputChange('cardNumber', value)}
          maxLength={19}
        />
        {errors.cardNumber ? <Text style={styles.errorMessage}>{errors.cardNumber}</Text> : null}
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Expiry Date (MM/YY) *</Text>
          <TextInput
            style={[styles.input, errors.expiryDate && styles.inputError]}
            placeholder="MM/YY"
            keyboardType="number-pad"
            value={formData.expiryDate}
            onChangeText={(value) => handleInputChange('expiryDate', value)}
            maxLength={5}
          />
          {errors.expiryDate ? <Text style={styles.errorMessage}>{errors.expiryDate}</Text> : null}
        </View>

        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.label}>CVV *</Text>
          <TextInput
            style={[styles.input, errors.cvv && styles.inputError]}
            placeholder="CVV"
            keyboardType="number-pad"
            secureTextEntry
            value={formData.cvv}
            onChangeText={(value) => handleInputChange('cvv', value)}
            maxLength={4}
          />
          {errors.cvv ? <Text style={styles.errorMessage}>{errors.cvv}</Text> : null}
        </View>
      </View>

      <View style={styles.securityContainer}>
        <Text style={styles.securityTitle}>Secure Payment</Text>
        <Text style={styles.securityText}>
          Your payment information is encrypted and secure. We never store your full card details.
        </Text>
      </View>

      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
           By clicking Submit, you agree to provide your card details for loan processing. Your information will be kept confidential and secure.
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
      </ScrollView>

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
    gap: 12,
  },
  reviewLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  reviewValue: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
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