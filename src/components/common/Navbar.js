import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  FileText, 
  Link2, 
  Upload,
  HelpCircle, 
  ChevronsLeft, 
  ChevronsRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../assets/Styles/Navbar.css';
import HelpModal from './HelpModal';

const Navbar = ({ onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { 
      icon: <LayoutDashboard />, 
      label: 'Dashboard', 
      path: '/dashboard' 
    },
    { 
      icon: <Users />, 
      label: 'Clients', 
      path: '/clients' 
    },
    { 
      icon: <UserCheck />, 
      label: 'Agents', 
      path: '/agents' 
    },
    { 
      icon: <FileText />, 
      label: 'Policies', 
      path: '/policies' 
    },
    { 
      icon: <Link2 />, 
      label: 'Client-Agent Mapping', 
      path: '/mapping' 
    },
    { 
      icon: <Upload />, 
      label: 'Bulk Insert', 
      path: '/bulk-insert' 
    }
  ];

  const toggleSidebar = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    onToggle(newExpandedState);
  };

  const toggleHelpModal = () => {
    setIsHelpModalOpen(!isHelpModalOpen);
  };

  return (
    <>
      <motion.div 
        className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
        initial={{ width: '250px' }}
        animate={{ 
          width: isExpanded ? '250px' : '80px',
          transition: { duration: 0.3 }
        }}
      >
        <motion.div 
          className="sidebar-toggle"
          onClick={toggleSidebar}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isExpanded ? <ChevronsLeft /> : <ChevronsRight />}
        </motion.div>

        <div className="sidebar-logo">
          <span className="logo-text">
            Client Management System
          </span>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <div className="menu-item-content">
                {item.icon}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          ))}
        </nav>

        <div 
          className="help-section"
          onClick={toggleHelpModal}
        >
          <div className="menu-item-content">
            <HelpCircle />
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Need Help?
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <HelpModal 
        isOpen={isHelpModalOpen} 
        onClose={toggleHelpModal} 
      />
    </>
  );
};

export default Navbar;