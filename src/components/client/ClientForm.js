import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

// This component encapsulates the notification and validation logic
const ClientForm = ({
  notification,
  validateName,
  validateEmail,
  validatePhoneNumber,
  validatePostalCode,
  validateDateOfBirth,
  validateForm,
  children
}) => {
  // Notification popup component
  const NotificationPopup = () => (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`notification notification-${notification.type}`}
        >
          {notification.type === 'success' 
            ? <CheckCircle2 size={20} /> 
            : <AlertTriangle size={20} />
          }
          {notification.message}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <NotificationPopup />
      {children}
    </>
  );
};

// Export validation functions for reuse
export const validateName = (name) => {
  if (!name) return 'Name is required';
  if (name.trim().length < 3) return 'Name must be at least 3 characters long';
  if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name can only contain letters and spaces';
  return '';
};

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return 'Invalid email format';
  return '';
};

export const validatePhoneNumber = (phone) => {
  if (!phone) return 'Phone number is required';
  const phoneRegex = /^\+?\d{10,}$/;
  if (!phoneRegex.test(phone)) return 'Invalid phone number';
  return '';
};

export const validatePostalCode = (postalCode) => {
  if (!postalCode) return 'Postal code is required';
  const postalCodeRegex = /^\d{5}$/;
  if (!postalCodeRegex.test(postalCode)) return 'Postal code must be 6 digits';
  return '';
};

export const validateDateOfBirth = (dob) => {
  if (!dob) return 'Date of Birth is required';
  
  const birthDate = new Date(dob);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  if (age < 18) return 'Must be at least 18 years old';
  
  return '';
};

export default ClientForm;