import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to user login by default
    router.push('/auth/user/login');
  }, [router]);

  // Return a loading state while redirecting
  return (
    <Layout>
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'var(--secondary-color)'
      }}>
        <h1>Redirecting...</h1>
      </div>
    </Layout>
  );
} 