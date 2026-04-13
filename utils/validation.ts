/**
 * Frontend Validation Utilities
 * Client-side validation for auth forms
 */

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone format
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(?:\+\d{1,3})?[\s-]?\d{10}$/;
  return phoneRegex.test(phone.replace(/\s|-/g, ''));
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Validate login form
 */
export const validateLoginForm = (formData: {
  email: string;
  password: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!formData.email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(formData.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  if (!formData.password.trim()) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (formData.password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }

  return errors;
};

/**
 * Validate signup form
 */
export const validateSignupForm = (formData: {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
   city:string;
   address:string;
   pincode:string;
  confirmPassword: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!formData.fullName.trim()) {
    errors.push({ field: 'fullName', message: 'Full name is required' });
  }

  if (!formData.email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(formData.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  if (formData.phone && formData.phone.trim() && !isValidPhone(formData.phone)) {
    errors.push({ field: 'phone', message: 'Invalid phone format' });
  }

  if (!formData.password.trim()) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (formData.password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }

  if (!formData.confirmPassword.trim()) {
    errors.push({ field: 'confirmPassword', message: 'Confirm password is required' });
  } else if (formData.password !== formData.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
  }

  return errors;
};
