import { post, postFormData, get } from './api';

export interface LoanApplicationData {
  fullName: string;
  email: string;
  phone: string;
  dob?: string;
  gender?: string;
  address?: string;
  city?: string;
  pincode?: string;
  loanType: string;
  loanAmount: number;
  companyName?: string;
  monthlyIncome?: number;
  existingEmi?: number;
  primaryBank?: string;
  cibilScore?: string;
  bankStatementPdf?: string;
  aadharNumber?: string;
  panNumber?: string;
  aadharFrontImage?: string;
  aadharBackImage?: string;
  aadharPdf?: string;
  panCardImage?: string;
  panCardPdf?: string;
  nomineeName?: string;
  nomineeRelation?: string;
  paymentMethod?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface LoanApplication extends LoanApplicationData {
  id: string;
  referenceId: string;
  userId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoanApplicationResponse {
  message: string;
  application: LoanApplication;
}

export interface LoanApplicationsResponse {
  message: string;
  applications: LoanApplication[];
  count: number;
}


export const createLoanApplication = async (
  data: LoanApplicationData | FormData
): Promise<LoanApplicationResponse> => {
  // Check if data is FormData (has files)
  if (data instanceof FormData) {
    return postFormData<LoanApplicationResponse>('/api/loan-applications', data);
  }
  
  // Otherwise, use regular JSON post
  return post<LoanApplicationResponse>('/api/loan-applications', data);
};

/**
 * Get all loan applications for current user (requires authentication)
 */
export const getMyLoanApplications = async (): Promise<LoanApplicationsResponse> => {
  return get<LoanApplicationsResponse>('/api/loan-applications/my');
};

/**
 * Get a specific loan application by ID (requires authentication)
 */
export const getLoanApplicationById = async (id: string): Promise<{ message: string; application: LoanApplication }> => {
  return get<{ message: string; application: LoanApplication }>(`/api/loan-applications/${id}`);
};
