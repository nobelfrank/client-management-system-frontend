import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';
import '../../assets/Styles/ClientNotification.css'

const ClientNotifications = ({ userRole, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    // Convert to uppercase for case-insensitive comparison
    const normalizedUserRole = userRole?.toUpperCase();
    
    // Only fetch if user is ADMIN
    if (normalizedUserRole === 'ADMIN') {
      fetchNotifications();
    } else {
      onClose();
    }
  }, [userRole, onClose]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/client-issues');
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const deleteNotification = async (id) => {
    const normalizedUserRole = userRole?.toUpperCase();
    if (normalizedUserRole !== 'ADMIN') return;

    try {
      const response = await fetch(`http://localhost:8080/api/client-issues/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      setNotifications(prev => prev.filter(notification => notification.id !== id));
      
      if (selectedNotification && selectedNotification.id === id) {
        setSelectedNotification(null);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Check if user is admin
  const normalizedUserRole = userRole?.toUpperCase();
  if (normalizedUserRole !== 'ADMIN') {
    return null;
  }

  return (
    <motion.div
      className="notifications-popup"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="notifications-header">
        <h3>Client Issues</h3>
        <X 
          size={24} 
          onClick={onClose} 
          className="close-icon"
        />
      </div>

      {notifications.length === 0 ? (
        <p className="no-notifications">No client issues found</p>
      ) : (
        <ul className="notifications-list">
          {notifications.map((notification) => (
            <li 
              key={notification.id} 
              onClick={() => setSelectedNotification(notification)}
              className="notification-item"
            >
              <div className="notification-content">
                <span className="notification-name">{notification.name}</span>
                <MessageCircle size={16} className="message-icon" />
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedNotification && (
        <motion.div
          className="notification-details"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="notification-details-header">
            <h3>{selectedNotification.name}</h3>
            <div className="notification-actions">
              <X 
                size={24} 
                onClick={() => setSelectedNotification(null)} 
                className="close-icon"
              />
              <button 
                className="delete-btn"
                onClick={() => deleteNotification(selectedNotification.id)}
              >
                Delete
              </button>
            </div>
          </div>
          <div className="notification-details-content">
            <p><strong>Email:</strong> {selectedNotification.email}</p>
            <p><strong>Message:</strong> {selectedNotification.message}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ClientNotifications;