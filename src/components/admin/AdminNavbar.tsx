import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { useState, useEffect } from 'react';
import styles from './AdminNavbar.module.css';
import { FiUser, FiLogOut } from 'react-icons/fi';

const AdminNavbar = () => {
  const router = useRouter();
  const { logout } = useAdminAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    // Get admin info from localStorage
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      const admin = JSON.parse(adminData);
      setAdminName(admin.employeeId || 'Admin');
    }
  }, []);

  // Add click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('admin-dropdown');
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/auth/admin/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/admin/dashboard" className={styles.logo}>
          Admin Control Panel
        </Link>

        <div className={`${styles.mainNav} ${showMobileMenu ? styles.show : ''}`}>
          <Link 
            href="/admin/dashboard" 
            className={`${styles.navLink} ${router.pathname === '/admin/dashboard' ? styles.active : ''}`}
          >
            Applications
          </Link>
          <Link 
            href="/admin/commercial-spaces" 
            className={`${styles.navLink} ${router.pathname === '/admin/commercial-spaces' ? styles.active : ''}`}
          >
            Manage Spaces
          </Link>
          <Link 
            href="/admin/reports" 
            className={`${styles.navLink} ${router.pathname === '/admin/reports' ? styles.active : ''}`}
          >
            Reports
          </Link>
          <Link 
            href="/admin/settings" 
            className={`${styles.navLink} ${router.pathname === '/admin/settings' ? styles.active : ''}`}
          >
            Settings
          </Link>
        </div>

        <div className={styles.authNav}>
          <div 
            className={styles.userInfo} 
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ cursor: 'pointer' }}
            id="admin-dropdown"
          >
            <div className={styles.userAvatar}>{adminName.charAt(0).toUpperCase()}</div>
            <span className={styles.userName}>{adminName}</span>
            {showDropdown && (
              <div className={`${styles.userDropdown} ${styles.show}`}>
                <div className={styles.profileHeader}>
                  <div className={styles.userAvatar}>{adminName.charAt(0).toUpperCase()}</div>
                  <span className={styles.profileName}>{adminName}</span>
                </div>
                <Link 
                  href="/admin/profile" 
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

export default AdminNavbar; 