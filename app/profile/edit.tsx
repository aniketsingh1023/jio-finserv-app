import React, { useState, useEffect } from 'react';
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
import { useRouter } from 'expo-router';
import { useAuth } from '@/store/authStore';
import * as authService from '@/services/auth.service';
import { Colors } from '@/constants/colors';

interface EditFormData {
  name: string;
  phone: string;
  gender: string;
  dob: string;
  address: string;
  city: string;
  pincode: string;
}

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<EditFormData>({
    name: '',
    phone: '',
    gender: '',
    dob: '',
    address: '',
    city: '',
    pincode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Initialize form with current user data
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        gender: user.gender || '',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        address: user.address || '',
        city: user.city || '',
        pincode: user.pincode || '',
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof EditFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      const updateData: Partial<EditFormData> = {
        name: formData.name,
      };

      if (formData.phone) updateData.phone = formData.phone;
      if (formData.gender) updateData.gender = formData.gender;
      if (formData.dob) updateData.dob = formData.dob;
      if (formData.address) updateData.address = formData.address;
      if (formData.city) updateData.city = formData.city;
      if (formData.pincode) updateData.pincode = formData.pincode;

      await authService.updateUserProfile(updateData as any);
      await refreshUser();
      Alert.alert('Success', 'Profile updated successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
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
        <Text style={styles.sectionTitle}>Personal Information</Text>

        {/* Name Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Enter your full name"
            placeholderTextColor={Colors.textTertiary}
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            editable={!isSaving}
          />
          {errors.name && <Text style={styles.errorMessage}>{errors.name}</Text>}
        </View>

        {/* Phone Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            placeholder="Enter 10-digit phone number"
            placeholderTextColor={Colors.textTertiary}
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            editable={!isSaving}
          />
          {errors.phone && <Text style={styles.errorMessage}>{errors.phone}</Text>}
        </View>

        {/* Gender Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter gender (M/F/Other)"
            placeholderTextColor={Colors.textTertiary}
            value={formData.gender}
            onChangeText={(value) => handleInputChange('gender', value)}
            editable={!isSaving}
          />
        </View>

        {/* DOB Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={Colors.textTertiary}
            value={formData.dob}
            onChangeText={(value) => handleInputChange('dob', value)}
            editable={!isSaving}
          />
        </View>

        <Text style={styles.sectionTitle}>Address Information</Text>

        {/* Address Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Enter your full address"
            placeholderTextColor={Colors.textTertiary}
            value={formData.address}
            onChangeText={(value) => handleInputChange('address', value)}
            editable={!isSaving}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* City Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your city"
            placeholderTextColor={Colors.textTertiary}
            value={formData.city}
            onChangeText={(value) => handleInputChange('city', value)}
            editable={!isSaving}
          />
        </View>

        {/* Pincode Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pincode</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 6-digit pincode"
            placeholderTextColor={Colors.textTertiary}
            keyboardType="number-pad"
            value={formData.pincode}
            onChangeText={(value) => handleInputChange('pincode', value)}
            editable={!isSaving}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
          activeOpacity={0.7}
        >
          {isSaving ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={isSaving}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
    marginTop: 8,
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
  inputError: {
    borderColor: '#FF3B30',
  },
  errorMessage: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
