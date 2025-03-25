import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isDashboard = router.pathname.startsWith('/user/dashboard');

  useEffect(() => {
    // Check login status only after component mounts on client
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    router.push('/auth/user/login');
  };

  return (
    <nav className={`${styles.navbar} ${isDashboard ? styles.dashboardNav : ''}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          KazH
        </Link>

        <div className={styles.mainNav}>
          {isDashboard ? (
            // Dashboard specific navigation
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
          ) : (
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
          )}
        </div>

        <div className={styles.authNav}>
          {!isLoggedIn ? (
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
          ) : (
            <>
              {!isDashboard && (
                <Link href="/user/dashboard" className={styles.dashboardLink}>
                  Dashboard
                </Link>
              )}
              <button 
                className={styles.logoutButton}
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 