import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome,
  FaPalette,
  FaFileAlt,
  FaCreditCard,
  FaChevronDown,
  FaRocket
} from 'react-icons/fa';
import styles from './Header.module.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest(`.${styles.header}`)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Navigation items based on user state and current page
  const getNavigationItems = () => {
    const baseItems = [
      {
        label: 'Accueil',
        path: '/',
        icon: <FaHome />,
        show: true
      }
    ];

    if (currentUser) {
      baseItems.push(
        {
          label: 'Modèles',
          path: '/templates',
          icon: <FaPalette />,
          show: location.pathname !== '/templates'
        },
        {
          label: 'Créer CV',
          path: '/create-cv',
          icon: <FaFileAlt />,
          show: location.pathname !== '/create-cv'
        },
        {
          label: 'Mon Espace',
          path: '/dashboard',
          icon: <FaUser />,
          show: location.pathname !== '/dashboard'
        }
      );
    }

    return baseItems.filter(item => item.show);
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      <motion.header
        className={`${styles.header} ${isScrolled ? styles.scrolled : ''} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        <div className={styles.headerContainer}>

          {/* Logo Section */}
          <motion.div
            className={styles.logo}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigation('/')}
          >
            <motion.div
              className={styles.logoIcon}
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <FaRocket />
            </motion.div>
            <div className={styles.logoText}>
              <span className={styles.logoMain}>MBOA</span>
              <span className={styles.logoAccent}>CV</span>
            </div>
            <motion.div
              className={styles.logoGlow}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            <ul className={styles.navList}>
              {navigationItems.map((item, index) => (
                <motion.li
                  key={item.path}
                  className={styles.navItem}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <motion.button
                    className={`${styles.navLink} ${location.pathname === item.path ? styles.active : ''}`}
                    onClick={() => handleNavigation(item.path)}
                    whileHover={{
                      scale: 1.05,
                      y: -2
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    <span className={styles.navLabel}>{item.label}</span>
                    {location.pathname === item.path && (
                      <motion.div
                        className={styles.activeIndicator}
                        layoutId="activeIndicator"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    )}
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* User Actions */}
          <div className={styles.userActions}>
            {currentUser ? (
              <div className={styles.userMenu}>
                <motion.button
                  className={styles.userButton}
                  onClick={() => toggleDropdown('user')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={styles.userAvatar}>
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt="Avatar" />
                    ) : (
                      <FaUser />
                    )}
                  </div>
                  <span className={styles.userName}>
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                  <motion.div
                    animate={{ rotate: activeDropdown === 'user' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaChevronDown />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {activeDropdown === 'user' && (
                    <motion.div
                      className={styles.dropdown}
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <button
                        className={styles.dropdownItem}
                        onClick={() => handleNavigation('/dashboard')}
                      >
                        <FaUser />
                        <span>Mon Espace</span>
                      </button>
                      <div className={styles.dropdownDivider} />
                      <button
                        className={styles.dropdownItem}
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt />
                        <span>Déconnexion</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                className={styles.loginButton}
                onClick={() => handleNavigation('/login')}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(0, 243, 255, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUser />
                <span>Connexion</span>
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className={styles.mobileMenuButton}
            onClick={toggleMobileMenu}
            whileTap={{ scale: 0.95 }}
            animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </motion.button>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              className={styles.mobileNav}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className={styles.mobileNavContent}>
                <ul className={styles.mobileNavList}>
                  {navigationItems.map((item, index) => (
                    <motion.li
                      key={item.path}
                      className={styles.mobileNavItem}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <button
                        className={`${styles.mobileNavLink} ${location.pathname === item.path ? styles.active : ''}`}
                        onClick={() => handleNavigation(item.path)}
                      >
                        <span className={styles.mobileNavIcon}>{item.icon}</span>
                        <span className={styles.mobileNavLabel}>{item.label}</span>
                      </button>
                    </motion.li>
                  ))}
                </ul>

                {/* Mobile User Actions */}
                {currentUser && (
                  <div className={styles.mobileUserActions}>
                    <div className={styles.mobileUserInfo}>
                      <div className={styles.mobileUserAvatar}>
                        {currentUser.photoURL ? (
                          <img src={currentUser.photoURL} alt="Avatar" />
                        ) : (
                          <FaUser />
                        )}
                      </div>
                      <div className={styles.mobileUserDetails}>
                        <div className={styles.mobileUserName}>
                          {currentUser.displayName || currentUser.email?.split('@')[0]}
                        </div>
                        <div className={styles.mobileUserEmail}>
                          {currentUser.email}
                        </div>
                      </div>
                    </div>
                    <button
                      className={styles.mobileLogoutButton}
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className={styles.mobileOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;