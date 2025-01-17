import React from 'react';
import { FileSignature, DollarSign, Calendar, Edit, Trash2 } from 'lucide-react';

const PolicyCard = ({ policy, onEdit, onDelete }) => {
  if (!policy) return null;

  return (
    <div className="card policy-card fade-in">
      <div className="policy-type-header">
        <FileSignature className="policy-type-icon" />
        <h2>{policy.policyType || 'Unknown Policy Type'}</h2>
      </div>
      
      <div className="policy-details">
        <p>
          <span className="detail-label">Client:</span> 
          {policy.clientName}
        </p>
        <p>
          <DollarSign className="inline-icon" />
          <span className="detail-label">Premium:</span> 
          ${(policy.premium || 0).toFixed(2)}
        </p>
        <p>
          <Calendar className="inline-icon" />
          <span className="detail-label">Start Date:</span> 
          {policy.startDate || 'N/A'}
        </p>
        <p>
          <Calendar className="inline-icon" />
          <span className="detail-label">End Date:</span> 
          {policy.endDate || 'N/A'}
        </p>
      </div>

      <div className="card-actions">
        <button className="btn edit-btn" onClick={() => onEdit(policy)}>
          <Edit className="btn-icon" /> Edit
        </button>
        <button className="btn delete-btn" onClick={() => onDelete(policy.id)}>
          <Trash2 className="btn-icon" /> Delete
        </button>
      </div>
    </div>
  );
};

export default PolicyCard;