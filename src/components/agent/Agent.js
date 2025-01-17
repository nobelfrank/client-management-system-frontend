import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AgentSearch from '../agent/AgentSearch';
import AgentTable from '../agent/AgentTable';
import AgentModal from '../agent/AgentModal';
import Notification from './Notification';
import '../agent/Agent.css';

const Agent = () => {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [formMode, setFormMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/agents', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch agents');
      const data = await response.json();
      setAgents(data);
      setFilteredAgents(data);
    } catch (error) {
      showNotification('error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = agents.filter(
      agent => 
      ` ${agent.firstName} ${agent.lastName}`.toLowerCase().includes(term) ||
        agent.email.toLowerCase().includes(term)
    );
    setFilteredAgents(filtered);
  };

  const handleInputChange = (e, error = null) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const errors = {};
    Object.entries(formData).forEach(([key, value]) => {
      switch (key) {
        case 'firstName':
        case 'lastName':
          if (!value.trim()) errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
          break;
        case 'phoneNumber':
          if (!/^\d{10}$/.test(value)) errors[key] = 'Phone number must be 10 digits';
          break;
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors[key] = 'Invalid email format';
          break;
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAgent = async () => {
    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:8080/api/agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to add agent');
        
        await response.json();
        fetchAgents();
        setIsModalOpen(false);
        showNotification('success', 'Agent added successfully');
        setFormData({
          firstName: '',
          lastName: '',
          phoneNumber: '',
          email: ''
        });
      } catch (error) {
        showNotification('error', error.message);
      }
    }
  };

  const handleEditAgent = async () => {
    if (validateForm() && currentAgent) {
      try {
        const response = await fetch(`http://localhost:8080/api/agents/${currentAgent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to update agent');
        
        fetchAgents();
        setIsModalOpen(false);
        showNotification('success', 'Agent updated successfully');
      } catch (error) {
        showNotification('error', error.message);
      }
    }
  };

  const handleDeleteAgent = async (agentId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/agents/${agentId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete agent');
      
      fetchAgents();
      showNotification('success', 'Agent deleted successfully');
    } catch (error) {
      showNotification('error', error.message);
    }
  };

  const handleViewAgent = (agent) => {
    setCurrentAgent(agent);
    setFormMode('view');
    setFormData({
      firstName: agent.firstName,
      lastName: agent.lastName,
      phoneNumber: agent.phoneNumber,
      email: agent.email
    });
    setIsModalOpen(true);
  };

  const handleEditInitiate = (agent) => {
    setCurrentAgent(agent);
    setFormMode('edit');
    setFormData({
      firstName: agent.firstName,
      lastName: agent.lastName,
      phoneNumber: agent.phoneNumber,
      email: agent.email
    });
    setIsModalOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="agents-page-container"
    >
      <Notification notification={notification} />

      <div className="agents-page-header">
        <AgentSearch searchTerm={searchTerm} handleSearch={handleSearch} />
        <button 
          className="agents-page-add-button"
          onClick={() => {
            setFormMode('add');
            setCurrentAgent(null);
            setFormData({
              firstName: '',
              lastName: '',
              phoneNumber: '',
              email: ''
            });
            setIsModalOpen(true);
          }}
        >
          <PlusCircle size={20} /> Add Agent
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0.5 : 1 }}
        className="agents-page-content"
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
          <AgentTable 
            filteredAgents={filteredAgents}
            handleViewAgent={handleViewAgent}
            handleEditInitiate={handleEditInitiate}
            handleDeleteAgent={handleDeleteAgent}
          />
        )}
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              className="agents-page-details-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)} 
            />
            <AgentModal 
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              formMode={formMode}
              formData={formData}
              formErrors={formErrors}
              handleInputChange={handleInputChange}
              handleSubmit={formMode === 'add' ? handleAddAgent : handleEditAgent}
            />
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Agent;