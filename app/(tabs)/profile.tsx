import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Icon } from '@/components/Icon';
import { Ionicons } from "@expo/vector-icons";

interface UserProfile {
  isLoggedIn: boolean;
  name?: string;
  email?: string;
  phone?: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    isLoggedIn: false,
  });

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleSignup = () => {
    router.push('/auth/signup');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: () => {
          setUserProfile({ isLoggedIn: false });
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Redirecting to edit profile...');
  };

  if (!userProfile.isLoggedIn) {
    return (
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        {/* Login Prompt */}
        <View style={styles.promptContainer}>
          <View style={styles.promptIconContainer}>
            <Icon name="profile" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.promptTitle}>Sign In to Your Account</Text>
          <Text style={styles.promptText}>
            Log in to view your loans, track applications, and manage your account
          </Text>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleLogin}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryButtonText}>Log In</Text>
          </TouchableOpacity>

          {/* Signup Button */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSignup}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>Why Sign In?</Text>
          <BenefitItem
           iconName="info"
            title="Track Applications"
            desc="Monitor the status of your loan applications"
          />
          <BenefitItem
            iconName="money"
            title="Manage Loans"
            desc="View and manage all your active loans"
          />
          <BenefitItem
            iconName="download"
            title="View History"
            desc="Access your complete transaction history"
          />
          <BenefitItem
            iconName="notification"
            title="Get Notifications"
            desc="Receive important updates about your loans"
          />
          <BenefitItem
            iconName="settings"
          title="Account Settings"
           desc="Manage your profile and preferences"
        />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Icon name="profile" size={48} color={Colors.primary} />
        </View>

        <Text style={styles.profileName}>Rajesh Kumar</Text>
        <Text style={styles.profileEmail}>rajesh.kumar@email.com</Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditProfile}
          activeOpacity={0.7}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Account Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>

        <InfoItem label="Name" value="Rajesh Kumar" />
        <InfoItem label="Email" value="rajesh.kumar@email.com" />
        <InfoItem label="Phone" value="+91-9876-543-210" />
        <InfoItem label="Member Since" value="January 2024" />
      </View>

      {/* My Loans */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Loans</Text>

        <LoanItem
          loanType="Personal Loan"
          amount="₹500,000"
          emi="₹8,500"
          status="Active"
        />
        <LoanItem
          loanType="Home Loan"
          amount="₹25,00,000"
          emi="₹50,000"
          status="Active"
        />
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <SettingItem iconName="security" label="Change Password" onPress={() => {}} />
        <SettingItem iconName="notification" label="Notifications" onPress={() => {}} />
        <SettingItem iconName="download" label="Documents" onPress={() => {}} />
        <SettingItem iconName="phone-call" label="Support" onPress={() => {}} />
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const BenefitItem = ({
  iconName,
  title,
  desc,
}: {
  iconName: string;
  title: string;
  desc: string;
}) => (
  <View style={styles.benefitItem}>
    <Icon name={iconName as any} size={24} color={Colors.primary} />
    <View style={styles.benefitContent}>
      <Text style={styles.benefitTitle}>{title}</Text>
      <Text style={styles.benefitDesc}>{desc}</Text>
    </View>
  </View>
);

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const LoanItem = ({
  loanType,
  amount,
  emi,
  status,
}: {
  loanType: string;
  amount: string;
  emi: string;
  status: string;
}) => (
  <View style={styles.loanItem}>
    <View style={styles.loanHeader}>
      <Text style={styles.loanType}>{loanType}</Text>
      <Text style={[styles.loanStatus, styles.loanStatusActive]}>{status}</Text>
    </View>
    <View style={styles.loanDetails}>
      <View style={styles.loanDetail}>
        <Text style={styles.loanDetailLabel}>Amount</Text>
        <Text style={styles.loanDetailValue}>{amount}</Text>
      </View>
      <View style={styles.loanDetail}>
        <Text style={styles.loanDetailLabel}>Monthly EMI</Text>
        <Text style={styles.loanDetailValue}>{emi}</Text>
      </View>
    </View>
  </View>
);

const SettingItem = ({
  iconName,
  label,
  onPress,
}: {
  iconName: string;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
    <Icon name={iconName as any} size={20} color={Colors.primary} />
    <Text style={styles.settingLabel}>{label}</Text>
    <Icon name="arrow-right" size={18} color={Colors.textTertiary} />
  </TouchableOpacity>
);

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
  },
  promptContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  promptIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  promptTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  promptText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: Colors.white,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  benefitsSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  benefitIcon: {
    fontSize: 24,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  benefitDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  profileCard: {
    marginHorizontal: 16,
    marginVertical: 20,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,t: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    fontSize: 36,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: Colors.accent,
    borderRadius: 6,
  },
  editButtonText: {
    color: Colors.darkCharcoal,
    fontWeight: '600',
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  loanItem: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  loanType: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  loanStatus: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  loanStatusActive: {
    backgroundColor: Colors.accent,
    color: Colors.darkCharcoal,
  },
  loanDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  loanDetail: {
    flex: 1,
  },
  loanDetailLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  loanDetailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  settingLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  settingArrow: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 12,
    backgroundColor: Colors.error,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  bottomSpacing: {
    height: 80,
  },
});
