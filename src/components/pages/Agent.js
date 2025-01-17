

import React,{useState,useEffect} from 'react';
import { 
    Search, 
    PlusCircle, 
    Eye, 
    Edit2, 
    Trash2, 
    X,
    CheckCircle2,
    AlertTriangle
  } from 'lucide-react';
  import { motion, AnimatePresence } from 'framer-motion';
  import '../../assets/Styles/Agent.css'
  
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
  
        if (!response.ok) {
          throw new Error('Failed to fetch agents');
        }
  
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
  
    const validateForm = () => {
      const errors = {};
      
      if (!formData.firstName || formData.firstName.trim() === '') {
        errors.firstName = 'First Name is required';
      }
  
      if (!formData.lastName || formData.lastName.trim() === '') {
        errors.lastName = 'Last Name is required';
      }
  
      const phoneRegex = /^\d{10}$/;
      if (!formData.phoneNumber) {
        errors.phoneNumber = 'Phone number is required';
      } else if (!phoneRegex.test(formData.phoneNumber)) {
        errors.phoneNumber = 'Phone number must be 10 digits';
      }
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!emailRegex.test(formData.email)) {
        errors.email = 'Invalid email format';
      }
  
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    const handleAddAgent = async () => {
      if (validateForm()) {
        try {
          const response = await fetch('http://localhost:8080/api/agents', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
  
          if (!response.ok) {
            throw new Error('Failed to add agent');
          }
  
          const newAgent = await response.json();
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
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
  
          if (!response.ok) {
            throw new Error('Failed to update agent');
          }
  
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
  
        if (!response.ok) {
          throw new Error('Failed to delete agent');
        }
  
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
  
    const NotificationPopup = () => (
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`notification notification-${notification.type}`}
          >
            {notification.type === 'success' 
              ? <CheckCircle2 size={20} /> 
              : <AlertTriangle size={20} />
            }
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    );
  
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="agents-page-container"
      >
        <NotificationPopup />
  
        <div className="agents-page-header">
          <div className="agents-page-search">
            <Search color="var(--primary-color)" size={20} />
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
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
                        <button 
                          className="view-button" 
                          onClick={() => handleViewAgent(agent)}
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="edit-button"
                          onClick={() => handleEditInitiate(agent)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="delete-button"
                          onClick={() => handleDeleteAgent(agent.id)}
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
              <motion.div 
                className="agents-page-details-modal"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="agents-page-details-header">
                  <h2>
                    {formMode === 'add' 
                      ? 'Add New Agent' 
                      : formMode === 'edit' 
                        ? 'Edit Agent' 
                        : 'Agent Details'}
                  </h2>
                  <button 
                    className="agents-page-details-close-button"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <X size={24} />
                  </button>
                </div>
                {formMode === 'view' ? (
                  <div className="agent-details-view">
                    <div className="details-row">
                      <strong>Name:</strong> 
                      {`${formData.firstName} ${formData.lastName}`}
                    </div>
                    <div className="details-row">
                      <strong>Phone:</strong> 
                      {formData.phoneNumber}
                    </div>
                    <div className="details-row">
                      <strong>Email:</strong> 
                      {formData.email}
                    </div>
                  </div>
                ) : (
                  <form>
                    <div className="input-wrapper">
                      <div className="agents-page-details-field">
                        <label>First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={formMode === 'view'}
                          className={formErrors.firstName ? 'input-error-border' : ''}
                        />
                        {formErrors.firstName && (
                          <div className="input-error">
                            <AlertTriangle size={16} /> {formErrors.firstName}
                          </div>
                        )}
                      </div>
  
                      <div className="agents-page-details-field">
                        <label>Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={formMode === 'view'}
                          className={formErrors.lastName ? 'input-error-border' : ''}
                        />
                        {formErrors.lastName && (
                          <div className="input-error">
                            <AlertTriangle size={16} /> {formErrors.lastName}
                          </div>
                        )}
                      </div>
  
                      <div className="agents-page-details-field">
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="Enter 10-digit phone number"
                          disabled={formMode === 'view'}
                          className={formErrors.phoneNumber ? 'input-error-border' : ''}
                        />
                        {formErrors.phoneNumber && (
                          <div className="input-error">
                            <AlertTriangle size={16} /> {formErrors.phoneNumber}
                          </div>
                        )}
                      </div>
  
                      <div className="agents-page-details-field">
                        <label>Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter email address"
                          disabled={formMode === 'view'}
                          className={formErrors.email ? 'input-error-border' : ''}
                        />
                        {formErrors.email && (
                          <div className="input-error">
                            <AlertTriangle size={16} /> {formErrors.email}
                          </div>
                        )}
                      </div>
                    </div>
  
                    {formMode !== 'view' && (
                      <div className="agents-page-details-actions">
                        <button 
                          type="button"
                          className="agents-page-details-create-button"
                          onClick={formMode === 'add' ? handleAddAgent : handleEditAgent}
                        >
                          {formMode === 'add' ? 'Create Agent' : 'Update Agent'}
                        </button>
                      </div>
                    )}
                  </form>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };
  
  export default Agent;