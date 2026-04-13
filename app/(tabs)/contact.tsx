import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Linking,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  Dimensions,
  ImageBackground,
  ColorValue,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import * as contactService from '@/services/contact.service';

const { width, height } = Dimensions.get('window');

const DESIGN_COLORS = {
  warmMustard: '#D58F16',
  softOlive: '#CDC58E',
  goldenYellow: '#F1B643',
  lightGray: '#BDBBBC',
  darkNavy: '#252A39',
  background: '#F8F9FC',
  white: '#FFFFFF',
  error: '#FF3B30',
  success: '#16A34A',
  border: '#E8E9ED',
  textPrimary: '#1E2430',
  textSecondary: '#6B7280',
};

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: readonly [ColorValue, ColorValue, ...ColorValue[]];
  action: () => void;
}

interface AnimatedInputProps {
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  isMultiline?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  error?: string;
  maxLength?: number;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  icon,
  placeholder,
  value,
  onChangeText,
  isMultiline = false,
  keyboardType = 'default',
  error,
  maxLength,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: value || isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, isFocused, labelAnim]);

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: isFocused ? 1 : error ? 2 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isFocused, error, borderAnim]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [DESIGN_COLORS.border, DESIGN_COLORS.warmMustard, DESIGN_COLORS.error],
  });

  const labelStyle = {
    top: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [isMultiline ? 20 : 16, -8],
    }),
    fontSize: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [15, 12],
    }),
    color: error
      ? DESIGN_COLORS.error
      : labelAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [DESIGN_COLORS.lightGray, DESIGN_COLORS.warmMustard],
        }),
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Animated.View style={[styles.floatingInputContainer, { borderColor } as any]}>
        <Animated.Text style={[styles.floatingLabel, labelStyle as any]}>
          {placeholder}
        </Animated.Text>

        <View style={styles.inputRow}>
          <Ionicons
            name={icon}
            size={20}
            color={
              error
                ? DESIGN_COLORS.error
                : isFocused
                ? DESIGN_COLORS.warmMustard
                : DESIGN_COLORS.lightGray
            }
          />

          <TextInput
            style={[styles.floatingInput, isMultiline && styles.textAreaInput]}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            keyboardType={keyboardType}
            multiline={isMultiline}
            numberOfLines={isMultiline ? 5 : 1}
            textAlignVertical={isMultiline ? 'top' : 'center'}
            autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
            maxLength={maxLength}
            placeholderTextColor="transparent"
          />
        </View>
      </Animated.View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const QuickActionCard: React.FC<{ item: QuickAction; index: number }> = ({
  item,
  index,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 100),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [index, scaleAnim, translateY]);

  return (
    <Animated.View
      style={{
        flex: 1,
        transform: [{ scale: scaleAnim }, { translateY }],
      }}
    >
      <TouchableOpacity style={styles.quickActionCard} onPress={item.action} activeOpacity={0.9}>
        <LinearGradient colors={item.gradient} style={styles.quickActionGradient}>
          <Ionicons name={item.icon} size={26} color="#fff" />
          <Text style={styles.quickActionTitle}>{item.title}</Text>
          <Text style={styles.quickActionSubtitle}>{item.subtitle}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function ContactScreen() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    let sanitizedValue = value;

    switch (field) {
      case 'name':
        sanitizedValue = value.replace(/[^A-Za-z ]/g, '');
        break;
      case 'email':
        sanitizedValue = value.trim().toLowerCase();
        break;
      case 'phone':
        sanitizedValue = value.replace(/\D/g, '').slice(0, 10);
        break;
      case 'subject':
        sanitizedValue = value.slice(0, 100);
        break;
      case 'message':
        sanitizedValue = value.slice(0, 1000);
        break;
      default:
        sanitizedValue = value;
    }

    setFormData((prev) => ({ ...prev, [field]: sanitizedValue }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!/^[A-Za-z ]+$/.test(formData.name.trim())) {
      newErrors.name = 'Only letters and spaces allowed';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid @gmail.com email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits and start with 6-9';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    const isValid = validateForm();

    if (!isValid) {
      Alert.alert('Validation Error', 'Please fix the highlighted fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      await contactService.submitContactForm({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Alert.alert(
        'Message Sent',
        'Your message has been submitted successfully. Our team will contact you soon.'
      );

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setErrors({});
    } catch (error: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Submission Failed', error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Call Us',
      subtitle: 'Instant Support',
      icon: 'call-outline',
      gradient: [DESIGN_COLORS.warmMustard, DESIGN_COLORS.goldenYellow],
      action: () => Linking.openURL('tel:+9118001234567'),
    },
    {
      id: '2',
      title: 'WhatsApp',
      subtitle: 'Chat with us',
      icon: 'logo-whatsapp',
      gradient: ['#25D366', '#128C7E'],
      action: () => Linking.openURL('https://wa.me/9118001234567?text=Hello'),
    },
    {
      id: '3',
      title: 'Email',
      subtitle: 'Write to us',
      icon: 'mail-outline',
      gradient: [DESIGN_COLORS.darkNavy, '#3A4050'],
      action: () => Linking.openURL('mailto:support@jiofinserv.com'),
    },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={{
            uri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
          }}
          style={styles.heroContainer}
        >
          <LinearGradient
            colors={['rgba(17,24,39,0.72)', 'rgba(17,24,39,0.92)']}
            style={styles.heroOverlay}
          >
            <View style={styles.heroBadge}>
              <Ionicons name="chatbubbles-outline" size={14} color="#fff" />
              <Text style={styles.heroBadgeText}>24/7 CUSTOMER SUPPORT</Text>
            </View>

            <Text style={styles.heroTitle}>Get in Touch</Text>
            <Text style={styles.heroSubtitle}>
              Have a question, feedback, or issue? Send us a message and our team will help you.
            </Text>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.quickActionsWrapper}>
          {quickActions.map((item, index) => (
            <QuickActionCard key={item.id} item={item} index={index} />
          ))}
        </View>

        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Send us a Message</Text>
            <Text style={styles.formSubtitle}>
              Fill in the form below and we’ll get back to you as soon as possible.
            </Text>
          </View>

          <AnimatedInput
            icon="person-outline"
            placeholder="Full Name"
            value={formData.name}
            onChangeText={(v) => handleInputChange('name', v)}
            error={errors.name}
            maxLength={50}
          />

          <AnimatedInput
            icon="mail-outline"
            placeholder="Email Address"
            value={formData.email}
            onChangeText={(v) => handleInputChange('email', v)}
            keyboardType="email-address"
            error={errors.email}
            maxLength={80}
          />

          <AnimatedInput
            icon="call-outline"
            placeholder="Phone Number"
            value={formData.phone}
            onChangeText={(v) => handleInputChange('phone', v)}
            keyboardType="phone-pad"
            error={errors.phone}
            maxLength={10}
          />

          <AnimatedInput
            icon="book-outline"
            placeholder="Subject"
            value={formData.subject}
            onChangeText={(v) => handleInputChange('subject', v)}
            error={errors.subject}
            maxLength={100}
          />

          <AnimatedInput
            icon="document-text-outline"
            placeholder="Message"
            value={formData.message}
            onChangeText={(v) => handleInputChange('message', v)}
            isMultiline
            error={errors.message}
            maxLength={1000}
          />

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[DESIGN_COLORS.warmMustard, DESIGN_COLORS.goldenYellow]}
              style={styles.submitGradient}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="send-outline" size={18} color="#fff" />
                  <Text style={styles.submitButtonText}>Submit Message</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Why contact us?</Text>
          <Text style={styles.infoText}>
            We can help you with loan queries, application issues, repayment concerns, account
            updates, and general support.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN_COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroContainer: {
    height: height * 0.34,
    width: '100%',
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 18,
  },
  heroBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#E5E7EB',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 21,
  },
  quickActionsWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: -28,
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  quickActionGradient: {
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: 'center',
    minHeight: 108,
    justifyContent: 'center',
  },
  quickActionTitle: {
    color: '#fff',
    fontWeight: '700',
    marginTop: 10,
    fontSize: 13,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    color: '#F9FAFB',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  formCard: {
    marginTop: 22,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  formHeader: {
    marginBottom: 14,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: DESIGN_COLORS.textPrimary,
  },
  formSubtitle: {
    fontSize: 13,
    color: DESIGN_COLORS.textSecondary,
    marginTop: 6,
    lineHeight: 19,
  },
  floatingInputContainer: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
  },
  floatingLabel: {
    position: 'absolute',
    left: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    zIndex: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  floatingInput: {
    flex: 1,
    paddingVertical: 10,
    color: DESIGN_COLORS.textPrimary,
    fontSize: 14,
  },
  textAreaInput: {
    height: 110,
    paddingTop: 10,
  },
  errorText: {
    marginTop: 6,
    marginLeft: 4,
    color: DESIGN_COLORS.error,
    fontSize: 12,
    fontWeight: '500',
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitGradient: {
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  infoCard: {
    marginTop: 20,
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#FFF8E8',
    borderWidth: 1,
    borderColor: '#F4D38A',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: DESIGN_COLORS.darkNavy,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
    color: DESIGN_COLORS.textSecondary,
  },
});