import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'user' | 'commercial' | null>(null);
  
  const isDashboard = router.pathname.startsWith('/user/dashboard');
  const isCommercial = router.pathname.startsWith('/commercial/dashboard');

  useEffect(() => {
    // Check login status and user type
    const token = localStorage.getItem('token');
    const commercialToken = localStorage.getItem('commercial_token');
    
    if (commercialToken) {
      setIsLoggedIn(true);
      setUserType('commercial');
    } else if (token) {
      setIsLoggedIn(true);
      setUserType('user');
    }
  }, []);

  const handleLogout = () => {
    if (isCommercial) {
      localStorage.removeItem('commercial_token');
      localStorage.removeItem('commercial_user');
      router.push('/auth/commercial/login');
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/auth/user/login');
    }
    setIsLoggedIn(false);
    setUserType(null);
  };

  const renderNavLinks = () => {
    if (isCommercial) {
      return (
        // Commercial specific navigation
        <>
          <Link 
            href="/commercial/dashboard" 
            className={`${styles.navLink} ${router.pathname === '/commercial/dashboard' ? styles.active : ''}`}
          >
            Overview
          </Link>
          <Link 
            href="/commercial/listings" 
            className={`${styles.navLink} ${router.pathname === '/commercial/listings' ? styles.active : ''}`}
          >
            My Listings
          </Link>
          <Link 
            href="/commercial/applications" 
            className={`${styles.navLink} ${router.pathname === '/commercial/applications' ? styles.active : ''}`}
          >
            Applications
          </Link>
          <Link 
            href="/commercial/settings" 
            className={`${styles.navLink} ${router.pathname === '/commercial/settings' ? styles.active : ''}`}
          >
            Settings
          </Link>
        </>
      );
    } else if (isDashboard) {
      return (
        // User dashboard navigation
        <>
          <Link 
            href="/user/dashboard" 
            className={`${styles.navLink} ${router.pathname === '/user/dashboard' ? styles.active : ''}`}
          >
            Overview
          </Link>
          <Link 
            href="/user/dashboard/documents" 
            className={`${styles.navLink} ${router.pathname === '/user/dashboard/documents' ? styles.active : ''}`}
          >
            Documents
          </Link>
          <Link 
            href="/user/dashboard/settings" 
            className={`${styles.navLink} ${router.pathname === '/user/dashboard/settings' ? styles.active : ''}`}
          >
            Settings
          </Link>
        </>
      );
    } else {
      return (
        // Public navigation
        <>
          <Link 
            href="/" 
            className={`${styles.navLink} ${router.pathname === '/' ? styles.active : ''}`}
          >
            Home
          </Link>
          <Link 
            href="/spaces" 
            className={`${styles.navLink} ${router.pathname.startsWith('/spaces') ? styles.active : ''}`}
          >
            Spaces
          </Link>
          <Link 
            href="/about" 
            className={`${styles.navLink} ${router.pathname === '/about' ? styles.active : ''}`}
          >
            About
          </Link>
        </>
      );
    }
  };

  const renderAuthButtons = () => {
    if (!isLoggedIn) {
      return (
        <>
          <Link href="/auth/user/login" className={styles.loginLink}>
            User Login
          </Link>
          <Link href="/auth/commercial/login" className={styles.loginLink}>
            Commercial Login
          </Link>
          <Link href="/contact" className={styles.contactButton}>
            Contact Us
          </Link>
        </>
      );
    }

    return (
      <>
        {!isDashboard && !isCommercial && userType === 'user' && (
          <Link href="/user/dashboard" className={styles.dashboardLink}>
            Dashboard
          </Link>
        )}
        {!isCommercial && userType === 'commercial' && (
          <Link href="/commercial/dashboard" className={styles.dashboardLink}>
            Commercial Dashboard
          </Link>
        )}
        <button 
          className={styles.logoutButton}
          onClick={handleLogout}
        >
          Sign Out
        </button>
      </>
    );
  };

  return (
    <nav className={`${styles.navbar} ${isDashboard || isCommercial ? styles.dashboardNav : ''}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          {isCommercial || isDashboard ? isCommercial ? 'Commercial Portal' : 'User Portal' : 'KazH'}
        </div>

        <div className={styles.mainNav}>
          {renderNavLinks()}
        </div>

        <div className={styles.authNav}>
          {renderAuthButtons()}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 