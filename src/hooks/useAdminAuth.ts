import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export const useAdminAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
          throw new Error('No token found');
        }

        // Verify token with backend
        const response = await fetch('/api/admin/verify-token', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Invalid token');
        }

      } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('adminToken');
        router.push('/auth/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const logout = () => {
    localStorage.removeItem('adminToken');
    router.push('/auth/admin/login');
  };

  return { isLoading, logout };
}; 