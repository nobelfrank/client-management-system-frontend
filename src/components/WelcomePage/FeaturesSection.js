import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Info } from 'lucide-react';


const FeaturesSection = () => {
  return (
    <section id="features" className="welcome-section welcome-features-section">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="welcome-features-content"
      >
        <h2>Key Features</h2>
        <div className="welcome-features-grid">
          <FeatureCard 
            icon={<Users size={40} />}
            title="Client Management"
            description="Advanced tracking and management of client profiles"
          />
          <FeatureCard 
            icon={<MessageCircle size={40} />}
            title="Policy Tracking"
            description="Comprehensive policy management and monitoring"
          />
          <FeatureCard 
            icon={<Info size={40} />}
            title="Agent Allocation"
            description="Intelligent agent assignment and performance tracking"
          />
        </div>
      </motion.div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="welcome-feature-card">
    {icon}
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);


export default FeaturesSection;