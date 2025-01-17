import React from 'react';


const SiteFooter = () => {
  return (
    <footer className="welcome-site-footer">
      <div className="welcome-footer-content">
        <div className="welcome-footer-section">
          <h4>ClientPro</h4>
          <p>Transforming client management through innovative technology</p>
        </div>
        <div className="welcome-footer-section">
          <h4>Our Services</h4>
          <ul>
            <li>Policy Management</li>
            <li>Client Management</li>
            <li>Agent Management</li>
          </ul>
        </div>
        <div className="welcome-footer-section">
          <h4>Contact Us</h4>
          <p>Email: nobelfrank46@gmail.com</p>
          <p>Phone: +984 211 1871</p>
        </div>
      </div>
      <div className="welcome-footer-bottom">
        <p>&copy; 2024 ClientPro. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default SiteFooter;