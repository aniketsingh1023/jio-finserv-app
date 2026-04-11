import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { Icon } from '@/components/Icon';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactScreen() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      alert('Please fill all required fields');
      return;
    }
    alert('Thank you for reaching out! We will contact you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  const handleCall = () => {
    Linking.openURL('tel:+91-1800-123-4567');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@jiofinserv.com');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contact Us</Text>
        <Text style={styles.headerSubtitle}>We'd love to hear from you</Text>
      </View>

      {/* Quick Contact Options */}
      <View style={styles.quickContactContainer}>
        <TouchableOpacity
          style={styles.quickContactCard}
          onPress={handleCall}
          activeOpacity={0.7}
        >
          <Icon name="phone-call" size={28} color={Colors.primary} />
          <Text style={styles.quickContactLabel}>Call Us</Text>
          <Text style={styles.quickContactValue}>1800-123-4567</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickContactCard}
          onPress={handleEmail}
          activeOpacity={0.7}
        >
          <Icon name="mail" size={28} color={Colors.primary} />
          <Text style={styles.quickContactLabel}>Email Us</Text>
          <Text style={styles.quickContactValue}>support@jiofinserv.com</Text>
        </TouchableOpacity>
      </View>

      {/* Contact Form */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Send us a Message</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor={Colors.textTertiary}
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={Colors.textTertiary}
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            placeholderTextColor={Colors.textTertiary}
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Subject</Text>
          <TextInput
            style={styles.input}
            placeholder="What is this about?"
            placeholderTextColor={Colors.textTertiary}
            value={formData.subject}
            onChangeText={(value) => handleInputChange('subject', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Message *</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Tell us how we can help..."
            placeholderTextColor={Colors.textTertiary}
            value={formData.message}
            onChangeText={(value) => handleInputChange('message', value)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.7}
        >
          <Text style={styles.submitButtonText}>Send Message</Text>
        </TouchableOpacity>
      </View>

      {/* Office Information */}
      <View style={styles.officeSection}>
        <Text style={styles.officeTitle}>Our Offices</Text>

        <View style={styles.officeCard}>
          <Icon name="map-pin" size={20} color={Colors.primary} />
          <View style={styles.officeContent}>
            <Text style={styles.officeName}>Head Office - Mumbai</Text>
            <Text style={styles.officeAddress}>
              123 Financial Plaza, Mumbai, Maharashtra 400001
            </Text>
          </View>
        </View>

        <View style={styles.officeCard}>
          <Icon name="map-pin" size={20} color={Colors.primary} />
          <View style={styles.officeContent}>
            <Text style={styles.officeName}>Regional Office - Bangalore</Text>
            <Text style={styles.officeAddress}>
              456 Tech Park, Bangalore, Karnataka 560001
            </Text>
          </View>
        </View>

        <View style={styles.officeCard}>
          <Icon name="map-pin" size={20} color={Colors.primary} />
          <View style={styles.officeContent}>
            <Text style={styles.officeName}>Regional Office - Delhi</Text>
            <Text style={styles.officeAddress}>
              789 Business Hub, New Delhi, Delhi 110001
            </Text>
          </View>
        </View>
      </View>

      {/* Business Hours */}
      <View style={styles.hoursSection}>
        <Text style={styles.hoursTitle}>Business Hours</Text>
        <View style={styles.hoursBox}>
          <View style={styles.hoursItem}>
            <Icon name="calendar" size={16} color={Colors.primary} />
            <Text style={styles.hoursText}>Monday - Friday: 9:00 AM - 6:00 PM</Text>
          </View>
          <View style={styles.hoursItem}>
            <Icon name="calendar" size={16} color={Colors.primary} />
            <Text style={styles.hoursText}>Saturday: 10:00 AM - 4:00 PM</Text>
          </View>
          <View style={styles.hoursItem}>
            <Icon name="calendar" size={16} color={Colors.primary} />
            <Text style={styles.hoursText}>Sunday: Closed</Text>
          </View>
          <Text style={[styles.hoursText, styles.hoursHighlight]}>
            24/7 Support Available via Chat
          </Text>
        </View>
      </View>

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
  quickContactContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  quickContactCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickContactLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
    marginTop: 8,
  },
  quickContactValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.darkCharcoal,
    marginBottom: 16,
    letterSpacing: 0.3,
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
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  officeSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  officeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.darkCharcoal,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  officeCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    gap: 12,
  },
  officeContent: {
    flex: 1,
  },
  officeName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  officeAddress: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  hoursSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  hoursTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.darkCharcoal,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  hoursBox: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  hoursItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  hoursText: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
  },
  hoursHighlight: {
    marginTop: 8,
    fontWeight: '700',
    color: Colors.primary,
  },
  bottomSpacing: {
    height: 80,
  },
});
