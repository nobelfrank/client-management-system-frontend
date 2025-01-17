import React from "react";
import { Navigate } from "react-router-dom";
import { motion } from 'framer-motion';

const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  requiredPermissions = {} 
}) => {
  // Retrieve user from local storage
  const user = JSON.parse(localStorage.getItem("user"));

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is allowed
  if (!allowedRoles.includes(user.role)) {
    return (
      <motion.div 
        className="unauthorized-container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="unauthorized-content"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1>Access Denied</h1>
          <p>You do not have permission to access this page.</p>
          <motion.button 
            onClick={() => window.location.href = '/dashboard'}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Return to Dashboard
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  // If specific permissions are required, check them
  if (requiredPermissions) {
    const { canView, canEdit } = requiredPermissions;
    
    // Check view permissions
    if (canView && !canView.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }

    // Check edit permissions
    if (canEdit && !canEdit.includes(user.role)) {
      // Clone children and pass canEdit prop as false
      return React.cloneElement(children, { 
        canEdit: false,
        canView: true 
      });
    }
  }

  // If all checks pass, render the children
  return React.cloneElement(children, { 
    canEdit: true,
    canView: true 
  });
};

export default ProtectedRoute;