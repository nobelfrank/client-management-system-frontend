import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import AgentForm from './AgentForm';

const AgentModal = ({ 
  isOpen, 
  onClose, 
  formMode, 
  formData, 
  formErrors, 
  handleInputChange, 
  handleSubmit 
}) => (
  <motion.div 
    className="agents-page-details-modal"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
  >
    <div className="agents-page-details-header">
      <h2>
        {formMode === 'add' ? 'Add New Agent' : 
         formMode === 'edit' ? 'Edit Agent' : 
         'Agent Details'}
      </h2>
      <button className="agents-page-details-close-button" onClick={onClose}>
        <X size={24} />
      </button>
    </div>

    {formMode === 'view' ? (
      <div className="agent-details-view">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="details-row">
            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> 
            {value}
          </div>
        ))}
      </div>
    ) : (
      <>
        <AgentForm
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
          formMode={formMode}
        />
        <div className="agents-page-details-actions">
          <button 
            type="button"
            className="agents-page-details-create-button"
            onClick={handleSubmit}
          >
            {formMode === 'add' ? 'Create Agent' : 'Update Agent'}
          </button>
        </div>
      </>
    )}
  </motion.div>
);

export default AgentModal;