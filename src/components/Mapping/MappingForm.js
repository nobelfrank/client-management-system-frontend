import React from 'react';
import { validateMappingData } from '../Mapping/MappingValidation';

const MappingForm = ({ 
  mappingData, 
  setMappingData, 
  clients, 
  agents, 
  statusOptions,
  existingMappings,
  onSave, 
  onCancel, 
  popupType 
}) => {
  const [errors, setErrors] = React.useState({});

  const handleSubmit = () => {
    const validationErrors = validateMappingData(mappingData, existingMappings);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});
    onSave();
  };

  const handleChange = (field, value) => {
    setMappingData({ ...mappingData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <div className="popup fade-in">
      <div className="popup-content">
        <h2>
          {popupType === "create" ? "Create New Mapping" : "Edit Mapping"}
        </h2>
        
        {errors.general && (
          <div className="error-message general-error">
            {errors.general}
          </div>
        )}

        <label>
          Select Client:
          <select
            value={mappingData.clientId}
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
          Select Agent:
          <select
            value={mappingData.agentId}
            onChange={(e) => handleChange('agentId', e.target.value)}
            className={errors.agentId ? 'error' : ''}
          >
            <option value="">-- Select Agent --</option>
            {Array.isArray(agents) && agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {`${agent.firstName} ${agent.lastName}`}
              </option>
            ))}
          </select>
          {errors.agentId && <span className="error-message">{errors.agentId}</span>}
        </label>

        <label>
          Status:
          <select
            value={mappingData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className={errors.status ? 'error' : ''}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {errors.status && <span className="error-message">{errors.status}</span>}
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

export default MappingForm;