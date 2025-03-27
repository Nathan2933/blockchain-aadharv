import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import AdminNavbar from '../admin/AdminNavbar';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  
  // Check if current path is a login page or admin page
  const isLoginPage = router.pathname.includes('/auth/');
  const isAdminPage = router.pathname.startsWith('/admin/');

  return (
    <div className={styles.layout}>
      {!isLoginPage && !isAdminPage && <Navbar />}
      {!isLoginPage && isAdminPage && <AdminNavbar />}
      <main className={`${styles.main} ${isLoginPage ? styles.noNavbar : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout; 