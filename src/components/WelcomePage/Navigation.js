import React, { useState } from 'react';
import { Home, Users, MessageCircle, Info, LogIn, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navigation = ({ activeSection, scrollToSection }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = () => {
    navigate('/login', {
      state: { from: 'welcome' }
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (section) => {
    scrollToSection(section);
    setIsMenuOpen(false);
  };

  return (
    <nav className="welcome-sticky-nav">
      <div className="welcome-logo">ClientPro</div>
      
      {/* Mobile menu button */}
      <button 
        className="mobile-menu-btn md:hidden"
        onClick={toggleMenu}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navigation links - desktop and mobile */}
      <div className={`welcome-nav-links ${isMenuOpen ? 'mobile-menu-open' : ''}`}>
        <button 
          onClick={() => handleNavClick('home')} 
          className={activeSection === 'home' ? 'active' : ''}
        >
          <Home size={20} /> Home
        </button>
        <button 
          onClick={() => handleNavClick('features')} 
          className={activeSection === 'features' ? 'active' : ''}
        >
          <Users size={20} /> Features
        </button>
        <button 
          onClick={() => handleNavClick('testimonials')} 
          className={activeSection === 'testimonials' ? 'active' : ''}
        >
          <MessageCircle size={20} /> Testimonials
        </button>
        <button 
          onClick={() => handleNavClick('about')} 
          className={activeSection === 'about' ? 'active' : ''}
        >
          <Info size={20} /> About Us
        </button>
        {/* Mobile login button */}
        <button className="welcome-login-btn md:hidden " onClick={handleLogin}>
          <LogIn size={20} /> Login
        </button>
      </div>
      
      {/* Desktop login button */}
      <button className="welcome-login-btn hidden md:flex" onClick={handleLogin}>
        <LogIn size={20} /> Login
      </button>
    </nav>
  );
};

export default Navigation;