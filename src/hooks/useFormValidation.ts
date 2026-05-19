import { useState } from 'react';

interface ValidationErrors {
  [key: string]: string;
}

export function useFormValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email';
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const validateName = (name: string, fieldName: string = 'Name'): string | null => {
    if (!name) return `${fieldName} is required`;
    if (name.trim().length < 2) return `${fieldName} must be at least 2 characters`;
    return null;
  };

  const setFieldError = (field: string, error: string | null) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[field] = error;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  const clearErrors = () => setErrors({});

  return {
    errors,
    setFieldError,
    clearErrors,
    validateEmail,
    validatePassword,
    validateName,
  };
}
