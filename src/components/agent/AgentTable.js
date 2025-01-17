import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AgentTable = ({ filteredAgents, handleViewAgent, handleEditInitiate, handleDeleteAgent }) => (
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Phone</th>
        <th>Email</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredAgents.map(agent => (
        <motion.tr 
          key={agent.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <td>{`${agent.firstName} ${agent.lastName}`}</td>
          <td>{agent.phoneNumber}</td>
          <td>{agent.email}</td>
          <td>
            <div className="action-buttons">
              <button className="view-button" onClick={() => handleViewAgent(agent)}>
                <Eye size={16} />
              </button>
              <button className="edit-button" onClick={() => handleEditInitiate(agent)}>
                <Edit2 size={16} />
              </button>
              <button className="delete-button" onClick={() => handleDeleteAgent(agent.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </td>
        </motion.tr>
      ))}
    </tbody>
  </table>
);

export default AgentTable;