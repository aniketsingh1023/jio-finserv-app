// app/contact.tsx
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
  Modal,
  ImageBackground,
  Easing,
  ColorValue,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// ─── COLORS ──────────────────────────────────────────────────────────────────

const DESIGN_COLORS = {
  warmMustard: '#D58F16',
  softOlive: '#CDC58E',
  goldenYellow: '#F1B643',
  lightGray: '#BDBBBC',
  darkNavy: '#252A39',
};

// ─── TYPES ───────────────────────────────────────────────────────────────────

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

// ─── ANIMATED INPUT ──────────────────────────────────────────────────────────

const AnimatedInput: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  isMultiline?: boolean;
  keyboardType?: any;
}> = ({
  icon,
  placeholder,
  value,
  onChangeText,
  isMultiline,
  keyboardType,
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
  }, [value, isFocused]);

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E8E9ED', DESIGN_COLORS.warmMustard],
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
    color: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [DESIGN_COLORS.lightGray, DESIGN_COLORS.warmMustard],
    }),
  };

  return (
    // ✅ FIXED: Animated.View instead of View
    <Animated.View
      style={[
        styles.floatingInputContainer,
        { borderColor } as any,
      ]}
    >
      <Animated.Text style={[styles.floatingLabel, labelStyle as any]}>
        {placeholder}
      </Animated.Text>

      <View style={styles.inputRow}>
        <Ionicons
          name={icon}
          size={20}
          color={
            isFocused
              ? DESIGN_COLORS.warmMustard
              : DESIGN_COLORS.lightGray
          }
        />

        <TextInput
          style={[
            styles.floatingInput,
            isMultiline && styles.textAreaInput,
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType={keyboardType}
          multiline={isMultiline}
          numberOfLines={isMultiline ? 4 : 1}
          textAlignVertical={isMultiline ? 'top' : 'center'}
        />
      </View>
    </Animated.View>
  );
};

// ─── QUICK ACTION CARD ───────────────────────────────────────────────────────

const QuickActionCard: React.FC<{
  item: QuickAction;
  index: number;
}> = ({ item, index }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 100),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.quickActionCard}
        onPress={item.action}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={item.gradient}
          style={styles.quickActionGradient}
        >
          <Ionicons name={item.icon} size={28} color="#fff" />
          <Text style={styles.quickActionTitle}>{item.title}</Text>
          <Text style={styles.quickActionSubtitle}>
            {item.subtitle}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────

export default function ContactScreen() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Call Us',
      subtitle: 'Instant Support',
      icon: 'call-outline',
      gradient: [
        DESIGN_COLORS.warmMustard,
        DESIGN_COLORS.goldenYellow,
      ],
      action: () =>
        Linking.openURL('tel:+9118001234567'),
    },
    {
      id: '2',
      title: 'WhatsApp',
      subtitle: 'Chat with us',
      icon: 'logo-whatsapp',
      gradient: ['#25D366', '#128C7E'],
      action: () =>
        Linking.openURL(
          'https://wa.me/9118001234567?text=Hello'
        ),
    },
    {
      id: '3',
      title: 'Email',
      subtitle: 'Write to us',
      icon: 'mail-outline',
      gradient: [
        DESIGN_COLORS.darkNavy,
        '#3A4050',
      ],
      action: () =>
        Linking.openURL(
          'mailto:support@jiofinserv.com'
        ),
    },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios' ? 'padding' : 'height'
      }
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
      >
        {/* HERO */}
        <ImageBackground
          source={{
            uri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
          }}
          style={styles.heroContainer}
        >
          <LinearGradient
            colors={[
              'rgba(0,0,0,0.7)',
              'rgba(0,0,0,0.9)',
            ]}
            style={styles.heroOverlay}
          >
            <Text style={styles.heroTitle}>
              Get in Touch
            </Text>
            <Text style={styles.heroSubtitle}>
              We’re here to help you anytime
            </Text>
          </LinearGradient>
        </ImageBackground>

        {/* QUICK ACTIONS */}
        <View style={styles.quickActionsWrapper}>
          {quickActions.map((item, index) => (
            <QuickActionCard
              key={item.id}
              item={item}
              index={index}
            />
          ))}
        </View>

        {/* FORM */}
        <View style={styles.formWrapper}>
          <AnimatedInput
            icon="person-outline"
            placeholder="Full Name"
            value={formData.name}
            onChangeText={v =>
              handleInputChange('name', v)
            }
          />

          <AnimatedInput
            icon="mail-outline"
            placeholder="Email"
            value={formData.email}
            onChangeText={v =>
              handleInputChange('email', v)
            }
          />

          <AnimatedInput
            icon="call-outline"
            placeholder="Phone"
            value={formData.phone}
            onChangeText={v =>
              handleInputChange('phone', v)
            }
          />

          <AnimatedInput
            icon="document-text-outline"
            placeholder="Message"
            value={formData.message}
            onChangeText={v =>
              handleInputChange('message', v)
            }
            isMultiline
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FC' },
  scrollContent: { paddingBottom: 40 },

  heroContainer: {
    height: height * 0.35,
    width: '100%',
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#ddd',
    marginTop: 8,
  },

  quickActionsWrapper: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },

  quickActionCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickActionGradient: {
    padding: 16,
    alignItems: 'center',
  },
  quickActionTitle: {
    color: '#fff',
    fontWeight: '700',
    marginTop: 8,
  },
  quickActionSubtitle: {
    color: '#eee',
    fontSize: 12,
  },

  formWrapper: {
    padding: 16,
  },

  floatingInputContainer: {
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
  },

  floatingLabel: {
    position: 'absolute',
    left: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 4,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  floatingInput: {
    flex: 1,
    paddingVertical: 10,
  },

  textAreaInput: {
    height: 80,
  },
});