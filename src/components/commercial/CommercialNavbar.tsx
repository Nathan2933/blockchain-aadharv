import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiHome, FiGrid, FiFileText, FiSettings, FiUser, FiLogOut } from 'react-icons/fi';
import styles from './CommercialNavbar.module.css';

const CommercialNavbar = () => {
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get user info from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.name || 'User');
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('user-dropdown');
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Implement logout logic
    router.push('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/commercial/dashboard" className={styles.logo}>
          <FiGrid className={styles.logoIcon} />
          Commercial Space
        </Link>

        <div className={`${styles.mainNav} ${showMobileMenu ? styles.show : ''}`}>
          <Link 
            href="/commercial/dashboard" 
            className={`${styles.navLink} ${router.pathname === '/commercial/dashboard' ? styles.active : ''}`}
          >
            <FiHome className={styles.navIcon} />
            Dashboard
          </Link>
          <Link 
            href="/commercial/spaces" 
            className={`${styles.navLink} ${router.pathname === '/commercial/spaces' ? styles.active : ''}`}
          >
            <FiGrid className={styles.navIcon} />
            Spaces
          </Link>
          <Link 
            href="/commercial/applications" 
            className={`${styles.navLink} ${router.pathname === '/commercial/applications' ? styles.active : ''}`}
          >
            <FiFileText className={styles.navIcon} />
            Applications
          </Link>
          <Link 
            href="/commercial/settings" 
            className={`${styles.navLink} ${router.pathname === '/commercial/settings' ? styles.active : ''}`}
          >
            <FiSettings className={styles.navIcon} />
            Settings
          </Link>
        </div>

        <div className={styles.authNav}>
          <div 
            className={`${styles.userInfo} ${showDropdown ? styles.active : ''}`}
            onClick={() => setShowDropdown(!showDropdown)}
            id="user-dropdown"
          >
            <div className={styles.userAvatar}>{userName.charAt(0).toUpperCase()}</div>
            <span className={styles.userName}>{userName}</span>
            
            {showDropdown && (
              <div className={`${styles.userDropdown} ${styles.show}`}>
                <div className={styles.profileHeader}>
                  <div className={styles.userAvatar}>{userName.charAt(0).toUpperCase()}</div>
                  <span className={styles.profileName}>{userName}</span>
                </div>
                <Link 
                  href="/commercial/profile" 
                  className={styles.dropdownItem}
                >
                  <FiUser className={styles.icon} />
                  Profile
                </Link>
                <button 
                  onClick={handleLogout} 
                  className={styles.dropdownItem}
                >
                  <FiLogOut className={styles.icon} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        <button 
          className={`${styles.menuButton} ${showMobileMenu ? styles.active : ''}`}
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default CommercialNavbar; 