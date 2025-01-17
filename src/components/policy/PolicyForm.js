import React from 'react';
import { validatePolicyData } from './validationUtils';

const PolicyForm = ({ 
  policyData, 
  setPolicyData, 
  clients, 
  policyTypeOptions, 
  onSave, 
  onCancel, 
  popupType 
}) => {
  const [errors, setErrors] = React.useState({});

  const handleSubmit = () => {
    const validationErrors = validatePolicyData(policyData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});
    onSave();
  };

  const handleChange = (field, value) => {
    setPolicyData({ ...policyData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <div className="popup fade-in">
      <div className="popup-content">
        <h2>{popupType === "create" ? "Create New Policy" : "Edit Policy"}</h2>
        
        <label>
          Select Client:
          <select
            value={policyData.clientId}
            onChange={(e) => handleChange('clientId', e.target.value)}
            className={errors.clientId ? 'error' : ''}
          >
            <option value="">-- Select Client --</option>
            {Array.isArray(clients) && clients.map((client) => (
              <option key={client.id} value={client.id}>
                {`${client.firstName} ${client.lastName}`}
              </option>
            ))}
          </select>
          {errors.clientId && <span className="error-message">{errors.clientId}</span>}
        </label>
        
        <label>
          Policy Type:
          <select
            value={policyData.policyType}
            onChange={(e) => handleChange('policyType', e.target.value)}
            className={errors.policyType ? 'error' : ''}
          >
            {policyTypeOptions.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.policyType && <span className="error-message">{errors.policyType}</span>}
        </label>

        <label>
          Premium:
          <input
            type="number"
            value={policyData.premium}
            onChange={(e) => handleChange('premium', e.target.value)}
            placeholder="Enter premium amount"
            className={errors.premium ? 'error' : ''}
          />
          {errors.premium && <span className="error-message">{errors.premium}</span>}
        </label>

        <label>
          Start Date:
          <input
            type="date"
            value={policyData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className={errors.startDate ? 'error' : ''}
          />
          {errors.startDate && <span className="error-message">{errors.startDate}</span>}
        </label>

        <label>
          End Date:
          <input
            type="date"
            value={policyData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className={errors.endDate ? 'error' : ''}
          />
          {errors.endDate && <span className="error-message">{errors.endDate}</span>}
        </label>

        <div className="popup-actions">
          <button className="btn save-btn" onClick={handleSubmit}>
            Save
          </button>
          <button className="btn cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicyForm;