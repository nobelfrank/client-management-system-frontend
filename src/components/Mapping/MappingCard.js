import React from 'react';
import { UserCheck, Edit, Trash2 } from 'lucide-react';

const MappingCard = ({ mapping, onEdit, onDelete }) => {
  return (
    <div className="card mapping-card fade-in">
      <div className="mapping-header">
        <UserCheck className="mapping-type-icon" />
        <h2>{mapping.agentName}</h2>
      </div>
      
      <div className="mapping-details">
        <p>
          <span className="detail-label">Client:</span> 
          {mapping.clientName}
        </p>
        <p>
          <span className="detail-label">Status:</span> 
          <span className={`status-badge ${mapping.status.toLowerCase()}`}>
            {mapping.status}
          </span>
        </p>
      </div>

      <div className="card-actions">
        <button 
          className="btn edit-btn" 
          onClick={() => onEdit(mapping)}
        >
          <Edit className="btn-icon" /> Edit
        </button>
        <button 
          className="btn delete-btn" 
          onClick={() => onDelete(mapping.mappingId)}
        >
          <Trash2 className="btn-icon" /> Delete
        </button>
      </div>
    </div>
  );
};

export default MappingCard;