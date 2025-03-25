import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  
  // Check if current path is a login page
  const isLoginPage = router.pathname.includes('/auth/');

  return (
    <div className={styles.layout}>
      {!isLoginPage && <Navbar />}
      <main className={`${styles.main} ${isLoginPage ? styles.noNavbar : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout; 