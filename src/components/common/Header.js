import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellRing, Calendar, LogOut, AlertTriangle } from 'lucide-react';
import ClientNotifications from '../common/ClientNotification';
import '../../assets/Styles/Header.css';

const Header = ({ onLogout, userRole, userDetails, toggleSidebar, isSidebarOpen }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isNoAccessPopupOpen, setIsNoAccessPopupOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (userRole && !isInitialized) {
      setIsInitialized(true);
    }
  }, [userRole, isInitialized]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = () => {
    return currentDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleNotificationsClick = () => {
    if (!isInitialized) return;
    
    const normalizedUserRole = userRole?.toUpperCase();
    if (normalizedUserRole === 'ADMIN') {
      setShowNotifications(true);
    } else {
      setIsNoAccessPopupOpen(true);
    }
  };

  if (!isInitialized) {
    return null; // Don't render anything until we have user role information
  }

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <Calendar size={20} style={{ marginRight: '10px' }} />
        <span className="header-date">{formatDate()}</span>
      </div>

      <div className="header-right">
        <motion.div
          className="notifications-icon"
          onClick={handleNotificationsClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <BellRing size={24} />
        </motion.div>

        <motion.div
          className="logout-icon"
          onClick={onLogout}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Logout"
        >
          <LogOut size={24} />
        </motion.div>

        {showNotifications && userRole?.toUpperCase() === 'ADMIN' && (
          <ClientNotifications 
            userRole={userRole} 
            onClose={() => setShowNotifications(false)}
          />
        )}

        <AnimatePresence>
          {isNoAccessPopupOpen && (
            <motion.div
              className="no-access-popup"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="no-access-content">
                <AlertTriangle size={40} color="orange" />
                <h3>Access Denied</h3>
                <p>Only administrators can view notifications.</p>
                <button 
                  onClick={() => setIsNoAccessPopupOpen(false)}
                  className="close-no-access-btn"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;