import React from 'react';
import { AlertTriangle } from 'lucide-react';

const AgentForm = ({ formData, formErrors, handleInputChange, formMode }) => {
  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        return value.trim() !== '' ? '' : 'First Name is required';
      case 'lastName':
        return value.trim() !== '' ? '' : 'Last Name is required';
      case 'phoneNumber':
        return /^\d{10}$/.test(value) ? '' : 'Phone number must be 10 digits';
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email format';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    handleInputChange(e, error);
  };

  return (
    <form>
      <div className="input-wrapper">
        {['firstName', 'lastName', 'phoneNumber', 'email'].map((field) => (
          <div key={field} className="agents-page-details-field">
            <label>{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}</label>
            <input
              type={field === 'email' ? 'email' : field === 'phoneNumber' ? 'tel' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              disabled={formMode === 'view'}
              className={formErrors[field] ? 'input-error-border' : ''}
              placeholder={field === 'phoneNumber' ? 'Enter 10-digit phone number' : 
                         field === 'email' ? 'Enter email address' : ''}
            />
            {formErrors[field] && (
              <div className="input-error">
                <AlertTriangle size={16} /> {formErrors[field]}
              </div>
            )}
          </div>
        ))}
      </div>
    </form>
  );
};

export default AgentForm;