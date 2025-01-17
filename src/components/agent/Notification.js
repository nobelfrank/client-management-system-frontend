import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Notification = ({ notification }) => (
  <AnimatePresence>
    {notification && (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className={`notification notification-${notification.type}`}
      >
        {notification.type === 'success' 
          ? <CheckCircle2 size={20} /> 
          : <AlertTriangle size={20} />
        }
        {notification.message}
      </motion.div>
    )}
  </AnimatePresence>
);

export default Notification;