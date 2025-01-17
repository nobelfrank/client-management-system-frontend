import React from 'react';
import { motion } from 'framer-motion';


const AboutSection = () => {
  return (
    <section id="about" className="welcome-section welcome-about-section">
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="welcome-about-content"
      >
        <h2>About ClientPro</h2>
        <p>Founded in 2018, ClientPro is a leading client management platform dedicated to empowering businesses with cutting-edge technology. Our mission is to simplify complex client interactions, provide actionable insights, and drive operational excellence.</p>
        <div className="welcome-about-highlights">
          <Highlight number="500+" label="Satisfied Clients" />
          <Highlight number="5+" label="Years in Business" />
          <Highlight number="24/7" label="Customer Support" />
        </div>
      </motion.div>
    </section>
  );
};

const Highlight = ({ number, label }) => (
  <div className="welcome-highlight">
    <h3>{number}</h3>
    <p>{label}</p>
    </div>
);

export default AboutSection;