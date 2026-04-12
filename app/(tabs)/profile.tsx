import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '@/store/authStore';
import { Colors } from '@/constants/colors';
import { Icon } from '@/components/Icon';
import * as loanService from '@/services/loan.service';

interface LoanApp {
  id: string;
  referenceId: string;
  loanType: string;
  loanAmount: number;
  status: string;
  createdAt: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  
  const [applications, setApplications] = useState<LoanApp[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch applications when user becomes authenticated
  const fetchApplications = async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true);
      const response = await loanService.getMyLoanApplications();
      setApplications(response.applications as LoanApp[]);
    } catch (error: any) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchApplications();
    }, [isAuthenticated])
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchApplications();
    setIsRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: async () => {
          await logout();
          router.replace('/(tabs)/profile');
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleStartNewApplication = () => {
    router.push('/applications/new');
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleSignup = () => {
    router.push('/auth/signup');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#FF9500';
      case 'approved':
        return '#34C759';
      case 'rejected':
        return '#FF3B30';
      case 'processing':
        return '#007AFF';
      default:
        return Colors.textSecondary;
    }
  };

  // Logged out state
  if (!isAuthenticated) {
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
            iconName="profile"
            title="Your Profile"
            desc="Keep your personal and financial information up to date"
          />
        </View>
      </ScrollView>
    );
  }

  // Logged in state
  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      {/* User Profile Card */}
      <View style={styles.profileCard}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          
          {user?.phone && (
            <Text style={styles.userPhone}>📱 {user.phone}</Text>
          )}
        </View>

        {/* Edit Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditProfile}
          activeOpacity={0.7}
        >
          <Icon name="info" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Profile Details Section */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Profile Details</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Name</Text>
          <Text style={styles.detailValue}>{user?.name || '-'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email</Text>
          <Text style={styles.detailValue}>{user?.email || '-'}</Text>
        </View>

        {user?.phone && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>{user.phone}</Text>
          </View>
        )}

        {user?.gender && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Gender</Text>
            <Text style={styles.detailValue}>{user.gender}</Text>
          </View>
        )}

        {user?.address && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={styles.detailValue}>{user.address}</Text>
          </View>
        )}

        {user?.city && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>City</Text>
            <Text style={styles.detailValue}>{user.city}</Text>
          </View>
        )}
      </View>

      {/* My Applications Section */}
      <View style={styles.applicationsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Applications</Text>
          <TouchableOpacity
            onPress={handleStartNewApplication}
            activeOpacity={0.7}
          >
            <Text style={styles.newAppButton}>+ New</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : applications.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="info" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyStateTitle}>No Applications Found</Text>
            <Text style={styles.emptyStateText}>
              Start your first loan application today
            </Text>
            <TouchableOpacity
              style={styles.startAppButton}
              onPress={handleStartNewApplication}
              activeOpacity={0.7}
            >
              <Text style={styles.startAppButtonText}>Start New Application</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.applicationsList}>
            {applications.map((app) => (
              <View key={app.id} style={styles.applicationCard}>
                <View style={styles.appHeader}>
                  <View style={styles.appTitleContainer}>
                    <Text style={styles.appLoanType}>
                      {app.loanType}
                    </Text>
                    <Text style={styles.appRefId}>Ref: {app.referenceId.slice(0, 8)}</Text>
                  </View>
                  <View 
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(app.status) }
                    ]}
                  >
                    <Text style={styles.statusText}>{app.status}</Text>
                  </View>
                </View>

                <View style={styles.appDetails}>
                  <View style={styles.appDetailRow}>
                    <Text style={styles.appDetailLabel}>Amount:</Text>
                    <Text style={styles.appDetailValue}>
                      ₹{app.loanAmount.toLocaleString('en-IN')}
                    </Text>
                  </View>
                  <View style={styles.appDetailRow}>
                    <Text style={styles.appDetailLabel}>Applied on:</Text>
                    <Text style={styles.appDetailValue}>
                      {formatDate(app.createdAt)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Icon name="profile" size={20} color="#FF3B30" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* Footer spacing */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

interface BenefitItemProps {
  iconName: string;
  title: string;
  desc: string;
}

function BenefitItem({ iconName, title, desc }: BenefitItemProps) {
  return (
    <View style={styles.benefitItem}>
      <View style={styles.benefitIconContainer}>
        <Icon name={iconName} size={24} color={Colors.primary} />
      </View>
      <View style={styles.benefitContent}>
        <Text style={styles.benefitTitle}>{title}</Text>
        <Text style={styles.benefitDesc}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  
  // Logged out state
  promptContainer: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: 'center',
  },
  promptIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  promptText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  benefitsSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  benefitIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  benefitDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },

  // Logged in state
  profileCard: {
    flexDirection: 'row',
    margin: 16,
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },

  detailsSection: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
  },

  applicationsSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  newAppButton: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  loadingContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  startAppButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  startAppButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  applicationsList: {
    gap: 12,
  },
  applicationCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  appTitleContainer: {
    flex: 1,
  },
  appLoanType: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  appRefId: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
  },
  appDetails: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  appDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  appDetailLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  appDetailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },

  logoutButton: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FF3B30' + '15',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
});

          