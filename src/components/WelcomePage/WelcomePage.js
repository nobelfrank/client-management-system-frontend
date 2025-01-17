import React, { useState } from 'react';
import Navigation from '../WelcomePage/Navigation';
import HomeSection from '../WelcomePage/HomeSection';
import FeaturesSection from '../WelcomePage/FeaturesSection';
import TestimonialsSection from '../WelcomePage/TestimonialsSection';
import AboutSection from '../WelcomePage/AboutSection';
import SiteFooter from '../WelcomePage/SiteFooter';
import '../WelcomePage/WelcomePage.css'


const WelcomePage = () => {
  const [activeSection, setActiveSection] = useState('home');

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="welcome-container">
      <Navigation 
        activeSection={activeSection} 
        scrollToSection={scrollToSection} 
      />
      <HomeSection />
      <FeaturesSection />
      <TestimonialsSection />
      <AboutSection />
      <SiteFooter />
    </div>
  );
};

export default WelcomePage;