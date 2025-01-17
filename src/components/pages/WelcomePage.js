import React, { useState } from 'react';
import { Home, Users, MessageCircle, Info, LogIn, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../WelcomePage/WelcomePage'
const WelcomePage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
  };

  const testimonialSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star 
        key={index} 
        size={20} 
        fill={index < rating ? '#FFD700' : 'none'}
        color={index < rating ? '#FFD700' : '#888'}
        stroke={index < rating ? '#FFD700' : '#888'}
      />
    ));
  };

  const handleLogin = () => {
    navigate('/login', {
      state: { from: 'welcome' }
    });
  };

  return (
    <div className="welcome-container">
      {/* Navigation Bar */}
      <nav className="welcome-navbar">
        <div className="logo">ClientPro</div>
        <div className="nav-links">
          <button 
            onClick={() => scrollToSection('home')} 
            className={activeSection === 'home' ? 'active' : ''}
          >
            <Home size={20} /> Home
          </button>
          <button 
            onClick={() => scrollToSection('features')} 
            className={activeSection === 'features' ? 'active' : ''}
          >
            <Users size={20} /> Features
          </button>
          <button 
            onClick={() => scrollToSection('testimonials')} 
            className={activeSection === 'testimonials' ? 'active' : ''}
          >
            <MessageCircle size={20} /> Testimonials
          </button>
          <button 
            onClick={() => scrollToSection('about')} 
            className={activeSection === 'about' ? 'active' : ''}
          >
            <Info size={20} /> About Us
          </button>
        </div>
        <button className="login-btn" onClick={handleLogin}>
          <LogIn size={20} /> Login
        </button>
      </nav>

      {/* Home Section */}
      <section id="home" className="section home-section">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="home-content"
        >
          <h1>Streamline Your Client Management</h1>
          <p>Effortlessly manage clients, assign agents, and track policies with our comprehensive system.</p>
          <button className="cta-btn" onClick={handleLogin}>Get Started</button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="section features-section">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="features-content"
        >
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <Users size={40} />
              <h3>Client Management</h3>
              <p>Advanced tracking and management of client profiles</p>
            </div>
            <div className="feature-card">
              <MessageCircle size={40} />
              <h3>Policy Tracking</h3>
              <p>Comprehensive policy management and monitoring</p>
            </div>
            <div className="feature-card">
              <Info size={40} />
              <h3>Agent Allocation</h3>
              <p>Intelligent agent assignment and performance tracking</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section testimonials-section">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="testimonials-content"
        >
          <h2>Client Testimonials</h2>
          <Slider {...testimonialSettings} className="testimonial-slider">
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {renderStars(5)}
              </div>
              <p>"An incredible system that transformed our client management process with its intuitive design and powerful features."</p>
              <div className="testimonial-author">
                <span>John Doe</span>
                <span>CEO, TechCorp Solutions</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {renderStars(4)}
              </div>
              <p>"Perfect solution for tracking policies and managing agent assignments. Highly recommend for streamlining operations."</p>
              <div className="testimonial-author">
                <span>Jane Smith</span>
                <span>Operations Manager, Global Enterprises</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {renderStars(5)}
              </div>
              <p>"ClientPro has revolutionized how we manage client relationships. Exceptional tool with remarkable efficiency."</p>
              <div className="testimonial-author">
                <span>Michael Chen</span>
                <span>Director, Innovation Partners</span>
              </div>
            </div>
          </Slider>
        </motion.div>
      </section>

      {/* About Us Section */}
      <section id="about" className="section about-section">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="about-content"
        >
          <h2>About ClientPro</h2>
          <p>Founded in 2018, ClientPro is a leading client management platform dedicated to empowering businesses with cutting-edge technology. Our mission is to simplify complex client interactions, provide actionable insights, and drive operational excellence.</p>
          <div className="about-highlights">
            <div className="highlight">
              <h3>500+</h3>
              <p>Satisfied Clients</p>
            </div>
            <div className="highlight">
              <h3>5+</h3>
              <p>Years in Business</p>
            </div>
            <div className="highlight">
              <h3>24/7</h3>
              <p>Customer Support</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>ClientPro</h4>
            <p>Transforming client management through innovative technology</p>
          </div>
          <div className="footer-section">
            <h4>Our Services</h4>
            <ul>
              <li>Policy Management</li>
              <li>Client Management</li>
              <li>Agnet Management</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>Email: nobelfrank46@gmail.com</p>
            <p>Phone: +984 211 1871</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 ClientPro. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;