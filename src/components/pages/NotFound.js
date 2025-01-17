import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowRight } from 'lucide-react';
import NotFoundImage from '../../assets/img/NotFound.jpg';
import '../../assets/Styles/NotFound.css'

const NotFound = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user"));
    
    // If user exists, navigate to dashboard
    if (user) {
      navigate('/dashboard');
    } else {
      // If no user, redirect to login
      navigate('/login');
    }
  };

  return (
    <motion.div 
      className="not-found-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="not-found-content"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.img 
          src={NotFoundImage}
          alt="Page Not Found"
          className="not-found-image"
          animate={{
            y: [0, -10, 0],
            transition: { 
              duration: 2, 
              repeat: Infinity 
            }
          }}
        />
        <h1 className="not-found-title">404 - Page Not Found</h1>
        <p className="not-found-description">
          Oops! The page you're looking for seems to have wandered off into the digital wilderness.
        </p>
        <button 
          onClick={handleBackToDashboard}
          className="back-to-dashboard-btn"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="btn-icon" />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;