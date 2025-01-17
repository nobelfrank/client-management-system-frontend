import { addMonths, isBefore, isAfter, parseISO } from 'date-fns';

export const validatePolicyData = (policyData) => {
  const errors = {};

  if (!policyData.clientId) {
    errors.clientId = 'Please select a client';
  }

  if (!policyData.premium) {
    errors.premium = 'Premium amount is required';
  } else if (isNaN(policyData.premium) || Number(policyData.premium) <= 0) {
    errors.premium = 'Premium must be a positive number';
  } else if (Number(policyData.premium) < 100) {
    errors.premium = 'Premium must be at least $100';
  }

  if (!policyData.startDate) {
    errors.startDate = 'Start date is required';
  } else {
    const startDate = parseISO(policyData.startDate);
    const today = new Date();
    
    if (isBefore(startDate, today)) {
      errors.startDate = 'Start date cannot be in the past';
    }
  }

  if (!policyData.endDate) {
    errors.endDate = 'End date is required';
  } else {
    const startDate = parseISO(policyData.startDate);
    const endDate = parseISO(policyData.endDate);
    const minEndDate = addMonths(startDate, 1);
    
    if (isBefore(endDate, startDate)) {
      errors.endDate = 'End date must be after start date';
    } else if (isBefore(endDate, minEndDate)) {
      errors.endDate = 'Policy duration must be at least 1 month';
    }
  }

  if (!policyData.policyType) {
    errors.policyType = 'Please select a policy type';
  }

  return errors;
};