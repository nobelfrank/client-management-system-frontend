import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit2, Trash2 } from 'lucide-react';

const ClientTable = ({ 
  isLoading, 
  filteredClients, 
  handleViewClient, 
  handleEditInitiate, 
  handleDeleteClient 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoading ? 0.5 : 1 }}
      className="clients-page-content"
    >
      {isLoading ? (
        <div className="loading-spinner">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
            className="spinner"
          />
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date of Birth</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients && Array.isArray(filteredClients) && filteredClients.map(client => (
              <motion.tr 
                key={client.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td>{`${client.firstName} ${client.lastName}`}</td>
                <td>{client.email}</td>
                <td>{client.phoneNumber}</td>
                <td>{new Date(client.dateOfBirth).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="view-button" 
                      onClick={() => handleViewClient(client)}
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="edit-button"
                      onClick={() => handleEditInitiate(client)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteClient(client.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  );
};

export default ClientTable;