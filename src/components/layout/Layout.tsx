import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const isAuthPage = router.pathname.includes('/auth/');

  return (
    <div className={styles.layout}>
      {!isAuthPage && <Navbar />}
      <main className={`${styles.main} ${!isAuthPage ? styles.hasNavbar : ''}`}>
        {children}
      </main>
    </div>
  );
} 