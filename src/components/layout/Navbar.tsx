import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  // Check if current page is a login page
  const isLoginPage = router.pathname.includes('/login');

  // Render simplified navbar for login pages
  if (isLoginPage) {
    return (
      <nav className={`${styles.navbar} ${styles.simpleNav}`}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoText}>KazH</span>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>KazH</span>
        </Link>

        {/* Mobile menu button */}
        <button 
          className={`${styles.menuButton} ${isMenuOpen ? styles.active : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation links */}
        <div className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
          <div className={styles.mainLinks}>
            <Link 
              href="/" 
              className={`${styles.navLink} ${router.pathname === '/' ? styles.active : ''}`}
            >
              Home
            </Link>
            <Link 
              href="/spaces" 
              className={`${styles.navLink} ${router.pathname === '/spaces' ? styles.active : ''}`}
            >
              Spaces
            </Link>
            <Link 
              href="/about" 
              className={`${styles.navLink} ${router.pathname === '/about' ? styles.active : ''}`}
            >
              About
            </Link>
          </div>

          <div className={styles.authLinks}>
            {session ? (
              <div className={styles.userMenu}>
                <button className={styles.userButton}>
                  <span className={styles.userAvatar}>
                    {session.user?.name?.[0] || 'U'}
                  </span>
                  <span className={styles.userName}>{session.user?.name || 'Account'}</span>
                  <svg className={styles.chevron} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
                <div className={styles.userDropdown}>
                  {session.user?.role === 'ADMIN' && (
                    <Link href="/admin/dashboard" className={styles.dropdownItem}>
                      <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                      </svg>
                      Dashboard
                    </Link>
                  )}
                  <Link href="/profile" className={styles.dropdownItem}>
                    <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Profile
                  </Link>
                  <Link href="/bookings" className={styles.dropdownItem}>
                    <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    My Bookings
                  </Link>
                  <button onClick={handleSignOut} className={styles.dropdownItem}>
                    <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link href="/auth/signin" className={styles.signInButton}>
                  Sign In
                </Link>
                <Link href="/auth/user/login" className={styles.loginButton}>
                  User Login
                </Link>
                <Link href="/auth/commercial/login" className={styles.loginButton}>
                  Commercial Login
                </Link>
                <Link href="/contact" className={styles.contactButton}>
                  Contact Us
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 