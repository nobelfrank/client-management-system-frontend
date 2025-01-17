import React, { useState, useRef } from 'react';
import { Upload, FileText, Users, AlertTriangle } from 'lucide-react';
import * as BulkService from '../service/BulkInsertService';
import '../../assets/Styles/BulkInsert.css'

const ROLE_PERMISSIONS = {
  ADMIN: {
    client: { allowed: true, description: 'Full access to client bulk upload' },
    agent: { allowed: true, description: 'Full access to agent bulk upload' }
  },
  AGENT: {
    client: { allowed: true, description: 'Limited access to client upload' },
    agent: { allowed: false, description: 'No access to agent upload' }
  }
};

const BulkInsertPage = ({ userRole = 'ADMIN' }) => {
  const [files, setFiles] = useState({
    client: null,
    agent: null
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState({
    client: false,
    agent: false
  });
  const fileInputRefs = {
    client: useRef(null),
    agent: useRef(null)
  };

  const handleFileSelect = (type, event) => {
    const file = event.target.files[0];
    setFiles(prev => ({
      ...prev,
      [type]: file
    }));
    setErrors(prev => ({
      ...prev,
      [type]: null
    }));
  };

  const showToast = (message, type = 'success') => {
    const toastContainer = document.createElement('div');
    toastContainer.className = `toast-container ${type === 'success' ? 'slide-in' : 'slide-in'}`;
    
    toastContainer.innerHTML = `
      <div class="toast ${type === 'success' ? 'toast-success' : 'toast-error'}">
        <svg class="toast-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          ${type === 'success' ? 
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>' :
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>'
          }
        </svg>
        <span class="toast-message">${message}</span>
      </div>
    `;
    
    document.body.appendChild(toastContainer);

    setTimeout(() => {
      toastContainer.classList.replace('slide-in', 'slide-out');
      setTimeout(() => {
        document.body.removeChild(toastContainer);
      }, 300);
    }, 3000);
  };

  const handleBulkInsert = async (type) => {
    const file = files[type];
    if (!file) {
      setErrors(prev => ({
        ...prev,
        [type]: `Please select a ${type} file first`
      }));
      return;
    }

    setIsLoading(prev => ({ ...prev, [type]: true }));
    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiEndpoints = {
        client: BulkService.bulkInsertClients,
        agent: BulkService.bulkInsertAgents
      };

      await apiEndpoints[type](formData);
      showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} bulk insert successful`);
      
      fileInputRefs[type].current.value = '';
      setFiles(prev => ({ ...prev, [type]: null }));
    } catch (error) {
      const errorDetails = {
        client: 'Duplicate entries detected or invalid client data',
        agent: 'Mismatched agent credentials or existing records'
      };

      const errorMessage = errorDetails[type] || 'Bulk insert failed';
      setErrors(prev => ({
        ...prev,
        [type]: errorMessage
      }));
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const renderBulkInsertCard = (type, Icon, title, description) => {
    const { allowed } = ROLE_PERMISSIONS[userRole][type];
    const file = files[type];
    const isLoadingState = isLoading[type];

    return (
      <div className="w-full">
        <div className="bulk-card">
          <div className="card-header">
            <div className="header-content">
              <Icon className="header-icon" />
              <h2 className="header-title">
                {title} Bulk Insert
              </h2>
            </div>
          </div>

          <div className="card-body">
            <div className="file-input-wrapper">
              <input
                type="file"
                ref={fileInputRefs[type]}
                accept=".csv,.xlsx"
                onChange={(e) => handleFileSelect(type, e)}
                disabled={!allowed || isLoadingState}
                className="file-input"
                id={`file-${type}`}
              />
              <CustomButton
                variant="outline"
                onClick={() => fileInputRefs[type].current?.click()}
                disabled={!allowed || isLoadingState}
              >
                <FileText className="header-icon" />
                {file ? file.name : 'Choose File'}
              </CustomButton>
            </div>

            <CustomButton
              onClick={() => handleBulkInsert(type)}
              disabled={!allowed || !file || isLoadingState}
            >
              {isLoadingState ? (
                <svg className="spinner header-icon" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <Upload className="header-icon" />
              )}
              {isLoadingState ? 'Uploading...' :` Upload ${title} File`}
            </CustomButton>

            {errors[type] && (
              <div className="error-message">
                <AlertTriangle className="error-icon" />
                <span>{errors[type]}</span>
              </div>
            )}

            <p className="text-sm text-center text-gray-600">
              {description}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bulk-insert-container">
      <div>
        <div className="bulk-insert-header">
          <h1 className="bulk-insert-title">
            Bulk Insert Management
          </h1>
        </div>
        <div className="flex">
          {renderBulkInsertCard(
            'client',
            FileText,
            'Client',
            'Upload CSV with client details'
          )}
          {renderBulkInsertCard(
            'agent',
            Users,
            'Agent',
            'Upload CSV with agent information'
          )}
        </div>
      </div>
    </div>
  );
};

const CustomButton = ({ 
    children, 
    onClick, 
    disabled, 
    variant = 'primary'
  }) => {
    const variantClass = variant === 'primary' ? 'button-primary' : 'button-outline';
    
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`custom-button ${variantClass}`}
      >
        {children}
      </button>
    );
  };

export default BulkInsertPage;