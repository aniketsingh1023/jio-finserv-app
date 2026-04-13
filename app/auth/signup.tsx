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
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/store/authStore';
import { validateSignupForm } from '@/utils/validation';
import { Colors } from '@/constants/colors';

interface SignupFormData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  pincode: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export default function SignupScreen() {
  const router = useRouter();
  const { signup, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    pincode: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof SignupFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSignup = async () => {
    try {
      clearError();

      if (!formData.agreeToTerms) {
        Alert.alert('Terms Required', 'Please agree to the terms and conditions');
        return;
      }

      const errors = validateSignupForm({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        address: formData.address,
        pincode: formData.pincode,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (errors.length > 0) {
        const errorMap: Record<string, string> = {};
        errors.forEach((err: { field: string; message: string }) => {
          errorMap[err.field] = err.message;
        });
        setValidationErrors(errorMap);
        return;
      }

      await signup({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone || undefined,
        city: formData.city,
        address: formData.address,
        pincode: formData.pincode,
      });

      router.replace('/(tabs)/profile');
    } catch (err: any) {
      Alert.alert('Signup Failed', err.message || 'Unable to create account');
    }
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

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
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>Create JioFinserv Account</Text>
          <Text style={styles.welcomeSubtitle}>
            Join Jio Finserv and start your journey
          </Text>
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[
                styles.input,
                validationErrors.fullName ? styles.inputError : null,
              ]}
              placeholder="Enter your full name"
              placeholderTextColor={Colors.textTertiary}
              value={formData.fullName}
              onChangeText={(value) => handleInputChange('fullName', value)}
              editable={!isLoading}
            />
            {validationErrors.fullName ? (
              <Text style={styles.errorMessage}>{validationErrors.fullName}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[
                styles.input,
                validationErrors.email ? styles.inputError : null,
              ]}
              placeholder="Enter your email"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              editable={!isLoading}
            />
            {validationErrors.email ? (
              <Text style={styles.errorMessage}>{validationErrors.email}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number (Optional)</Text>
            <TextInput
              style={[
                styles.input,
                validationErrors.phone ? styles.inputError : null,
              ]}
              placeholder="Enter your phone number"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              editable={!isLoading}
              maxLength={15}
            />
            {validationErrors.phone ? (
              <Text style={styles.errorMessage}>{validationErrors.phone}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={[
                styles.input,
                validationErrors.city ? styles.inputError : null,
              ]}
              placeholder="Enter your city"
              placeholderTextColor={Colors.textTertiary}
              value={formData.city}
              onChangeText={(value) => handleInputChange('city', value)}
              editable={!isLoading}
            />
            {validationErrors.city ? (
              <Text style={styles.errorMessage}>{validationErrors.city}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                validationErrors.address ? styles.inputError : null,
              ]}
              placeholder="Enter your address"
              placeholderTextColor={Colors.textTertiary}
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
              editable={!isLoading}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            {validationErrors.address ? (
              <Text style={styles.errorMessage}>{validationErrors.address}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pincode</Text>
            <TextInput
              style={[
                styles.input,
                validationErrors.pincode ? styles.inputError : null,
              ]}
              placeholder="Enter your pincode"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="number-pad"
              value={formData.pincode}
              onChangeText={(value) => handleInputChange('pincode', value)}
              editable={!isLoading}
              maxLength={6}
            />
            {validationErrors.pincode ? (
              <Text style={styles.errorMessage}>{validationErrors.pincode}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.passwordInputWrapper,
                validationErrors.password ? styles.inputError : null,
              ]}
            >
              <TextInput
                style={styles.passwordInput}
                placeholder="Create a strong password"
                placeholderTextColor={Colors.textTertiary}
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <Text style={styles.eyeIcon}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
            {validationErrors.password ? (
              <Text style={styles.errorMessage}>{validationErrors.password}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View
              style={[
                styles.passwordInputWrapper,
                validationErrors.confirmPassword ? styles.inputError : null,
              ]}
            >
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm your password"
                placeholderTextColor={Colors.textTertiary}
                secureTextEntry={!showConfirmPassword}
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                <Text style={styles.eyeIcon}>
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
            {validationErrors.confirmPassword ? (
              <Text style={styles.errorMessage}>
                {validationErrors.confirmPassword}
              </Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() =>
              handleInputChange('agreeToTerms', !formData.agreeToTerms)
            }
            disabled={isLoading}
          >
            <View
              style={[
                styles.checkbox,
                formData.agreeToTerms && styles.checkboxChecked,
              ]}
            >
              {formData.agreeToTerms ? <Text style={styles.checkmark}>✓</Text> : null}
            </View>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsLink}>Terms and Conditions</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.signupButton, isLoading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <Text style={styles.signupButtonText}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.loginPrompt}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={handleLogin} disabled={isLoading}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingVertical: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  errorBanner: {
    backgroundColor: '#FEE',
    borderLeftWidth: 4,
    borderLeftColor: '#C33',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  errorText: {
    color: '#C33',
    fontSize: 13,
    fontWeight: '500',
  },
  errorMessage: {
    color: '#C33',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  inputError: {
    borderColor: '#C33',
  },
  form: {
    marginBottom: 24,
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
  textArea: {
    minHeight: 90,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  eyeIcon: {
    fontSize: 18,
    padding: 8,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 20,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
  },
  checkmark: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 12,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signupButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '700',
  },
});