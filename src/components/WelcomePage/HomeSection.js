import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';


const HomeSection = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login', {
      state: { from: 'welcome' }
    });
  };

  return (
    <section id="home" className="welcome-section welcome-home-section">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="welcome-home-content"
      >
        <h1>Streamline Your Client Management</h1>
        <p>Effortlessly manage clients, assign agents, and track policies with our comprehensive system.</p>
        <button className="welcome-cta-btn" onClick={handleLogin}>Get Started</button>
      </motion.div>
    </section>
  );
};

export default HomeSection;