// MainLayout.jsx
import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from 'framer-motion';
import './Main.css';
import ProtectedRoute from '../src/components/pages/ProtectedRoute';

// Lazy load components
const Navbar = React.lazy(() => import('../src/components/common/Navbar'));
const Header = React.lazy(() => import('../src/components/common/Header'));
const Dashboard = React.lazy(() => import('../src/components/pages/Dashboard'));
const Client = React.lazy(() => import('../src/components/pages/Client'));
const Agent = React.lazy(() => import('../src/components/agent/Agent'));
const Policy = React.lazy(() => import('../src/components/policy/Policy'));
const ClientAgentMapping = React.lazy(() => import('../src/components/Mapping/ClientAgentMappingPage'));
const NotFound = React.lazy(() => import('../src/components/pages/NotFound'));
const Login = React.lazy(() => import('../src/components/auth/Login'));
const Signup = React.lazy(() => import('../src/components/auth/SignUp'));
const Welcome = React.lazy(() => import('../src/components/WelcomePage/WelcomePage'));
const BulkInsert = React.lazy(() => import('../src/components/pages/BulkInsert'));

const LoadingSpinner = () => (
  <motion.div 
    className="loading-spinner-container"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="loading-spinner"></div>
  </motion.div>
);

const UnauthorizedPage = () => (
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
        className="back-to-dashboard-btn"
      >
        Return to Dashboard
      </motion.button>
    </motion.div>
  </motion.div>
);

const PublicRoutes = () => (
  <Routes>
    <Route path="/" element={<Welcome />} />
    <Route path="/welcome" element={<Welcome />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/unauthorized" element={<UnauthorizedPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const PrivateRoutes = ({ user }) => (
  <Routes>
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute 
          user={user}
          allowedRoles={["ADMIN", "AGENT", "CLIENT"]}
          requiredPermissions={{
            canView: ["ADMIN", "AGENT", "CLIENT"],
            canEdit: ["ADMIN", "AGENT"]
          }}
        >
          <Dashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/clients"
      element={
        <ProtectedRoute 
          user={user}
          allowedRoles={["ADMIN", "AGENT"]}
          requiredPermissions={{
            canView: ["ADMIN", "AGENT"],
            canEdit: ["ADMIN"]
          }}
        >
          <Client />
        </ProtectedRoute>
      }
    />

    <Route
      path="/agents"
      element={
        <ProtectedRoute 
          user={user}
          allowedRoles={["ADMIN", "AGENT"]}
          requiredPermissions={{
            canView: ["ADMIN", "AGENT"],
            canEdit: ["ADMIN"]
          }}
        >
          <Agent />
        </ProtectedRoute>
      }
    />

    <Route
      path="/mapping"
      element={
        <ProtectedRoute 
          user={user}
          allowedRoles={["ADMIN"]}
          requiredPermissions={{
            canView: ["ADMIN", "AGENT", "CLIENT"],
            canEdit: ["ADMIN"]
          }}
        >
          <ClientAgentMapping />
        </ProtectedRoute>
      }
    />

    <Route
      path="/policies"
      element={
        <ProtectedRoute 
          user={user}
          allowedRoles={["ADMIN", "AGENT", "CLIENT"]}
          requiredPermissions={{
            canView: ["ADMIN", "AGENT", "CLIENT"],
            canEdit: ["ADMIN", "AGENT"]
          }}
        >
          <Policy />
        </ProtectedRoute>
      }
    />

    <Route
      path="/bulk-insert"
      element={
        <ProtectedRoute 
          user={user}
          allowedRoles={["ADMIN", "AGENT"]}
          requiredPermissions={{
            canView: ["ADMIN", "AGENT"],
            canEdit: ["ADMIN"]
          }}
        >
          <BulkInsert />
        </ProtectedRoute>
      }
    />
  </Routes>
);

const AppContent = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error initializing user:", error);
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();

    // Check if current path requires auth
    const publicPaths = ['/welcome', '/', '/login', '/signup'];
    if (!publicPaths.includes(location.pathname) && !localStorage.getItem("user")) {
      window.location.href = '/login';
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile && isNavbarOpen) {
        setIsNavbarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isNavbarOpen]);

  const handleNavbarToggle = () => setIsNavbarOpen(prev => !prev);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  const isPublicPage = () => {
    const publicPaths = ['/welcome', '/', '/login', '/signup', '/unauthorized'];
    return publicPaths.includes(location.pathname) || location.pathname === '/404';
  };

  if (isLoading) return <LoadingSpinner />;

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  // Public pages layout
  if (isPublicPage()) {
    return (
      <motion.div 
        className="public-container"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <PublicRoutes />
        </Suspense>
      </motion.div>
    );
  }

  // Authenticated pages layout
  return (
    <div className="authenticated-container">
      <AnimatePresence mode="wait">
        <Suspense fallback={<LoadingSpinner />}>
          <Header 
            toggleSidebar={handleNavbarToggle}
            isSidebarOpen={isNavbarOpen}
            onLogout={handleLogout}
            userRole={user?.role}
            userDetails={user}
          />
          <Navbar 
            isOpen={isNavbarOpen}
            onToggle={handleNavbarToggle}
            onLogout={handleLogout}
            userRole={user?.role}
            isMobile={isMobile}
          />
        </Suspense>
      </AnimatePresence>

      <motion.main 
        className={`main-content ${isNavbarOpen && !isMobile ? "sidebar-open" : "sidebar-collapsed"}`}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <PrivateRoutes user={user} />
        </Suspense>
      </motion.main>
    </div>
  );
};

const MainLayout = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default MainLayout;