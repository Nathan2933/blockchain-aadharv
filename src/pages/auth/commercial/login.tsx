import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AuthCard from '../../../components/auth/AuthCard';
import styles from '../../../components/auth/AuthCard.module.css';

interface CommercialLoginData {
  email: string;
  password: string;
}

const CommercialLogin = () => {
  const router = useRouter();
  const { registered } = router.query;
  const [formData, setFormData] = useState<CommercialLoginData>({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);
  const [isRequestingApproval, setIsRequestingApproval] = useState(false);

  useEffect(() => {
    if (registered === 'true') {
      setStatus('pending');
      setError('Your registration is pending admin approval. You will be notified via email once approved.');
    }
  }, [registered]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (status === 'pending') {
      intervalId = setInterval(async () => {
        try {
          setError(null);
          const token = localStorage.getItem('token');
          if (!token) {
            console.log('No token found during status check');
            setStatus(null);
            return;
          }

          const response = await fetch('/api/commercial/check-status', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const data = await response.json();
          console.log('Status check response:', data);

          if (response.ok && data.status !== 'pending') {
            setStatus(null);
          }
        } catch (err) {
          console.error('Error checking status:', err);
          setStatus(null);
        }
      }, 2000); // Changed from 1000 to 300000 (5 minutes)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleRequestApproval = async () => {
    setIsRequestingApproval(true);
    setError('');

    try {
      // Get stored credentials for rejected account
      const storedCredentials = localStorage.getItem('tempCredentials');
      if (!storedCredentials) {
        setError('Please login again to request approval');
        return;
      }

      const credentials = JSON.parse(storedCredentials);
      
      const response = await fetch('/api/commercial/request-approval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit approval request');
      }

      setStatus('pending');
      setError('Approval request submitted successfully. You will be notified via email once approved.');
      // Clear stored credentials after successful request
      localStorage.removeItem('tempCredentials');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit approval request');
    } finally {
      setIsRequestingApproval(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    console.log('Submitting form data:', formData);
    
    try {
      // Clear any existing tokens/data first
      localStorage.removeItem('token');
      localStorage.removeItem('commercialSpace');

      const response = await fetch('/api/commercial/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);

      if (!response.ok) {
        if (response.status === 403) {
          // Store credentials temporarily for rejected status
          if (data.status === 'rejected') {
            localStorage.setItem('tempCredentials', JSON.stringify(formData));
          }
          setStatus(data.status);
          setError(data.message || 'Access forbidden. Please check your approval status.');
          return;
        }
        if (response.status === 401) {
          setError('Invalid email or password. Please try again.');
          return;
        }
        throw new Error(data.message || 'Login failed');
      }

      // Only store token and user data if login was successful
      if (data.token && data.commercialSpace) {
        try {
          const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
          console.log("Decoded Token Payload:", tokenPayload);
          
          localStorage.setItem('token', data.token);
          localStorage.setItem('commercialSpace', JSON.stringify(data.commercialSpace));
          
          // Redirect to dashboard only on successful login
          router.push('/commercial/dashboard');
        } catch (tokenError) {
          console.error('Token parsing error:', tokenError);
          setError('Invalid token received. Please try logging in again.');
          localStorage.removeItem('token');
          localStorage.removeItem('commercialSpace');
          return;
        }
      } else {
        setError('Invalid response from server. Missing token or user data.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to login. Please try again.');
      // Only clear storage if not in rejected state
      if (status !== 'rejected') {
        localStorage.removeItem('token');
        localStorage.removeItem('commercialSpace');
        localStorage.removeItem('tempCredentials');
      }
    }
  };

  return (
    <AuthCard 
      title="Commercial Space Login" 
      subtitle="Access your business dashboard"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <div className={`${styles.errorMessage} ${status === 'pending' ? styles.pendingMessage : ''}`}>
            {error}
          </div>
        </div>}
        
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label className={styles.label}>Email Address</label>
          <input
            type="email"
            name="email"
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            disabled={status === 'pending'}
          />
        </div>

        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            className={styles.input}
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            disabled={status === 'pending'}
          />
        </div>

        {status === 'rejected' && (
          <button 
            type="button"
            onClick={handleRequestApproval}
            className={`${styles.submitButton} ${styles.requestApprovalButton}`}
            disabled={isRequestingApproval}
          >
            {isRequestingApproval ? 'Submitting Request...' : 'Request Approval'}
          </button>
        )}

        {status !== 'rejected' && (
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={status === 'pending'}
          >
            {status === 'pending' ? 'Pending Approval' : 'Login'}
          </button>
        )}

        <div className={`${styles.formGroup} ${styles.fullWidth} ${styles.links}`}>
          <span>Don't have an account?</span>
          <a href="/auth/commercial/register" className={styles.link}>
            Register here
          </a>
        </div>
      </form>
    </AuthCard>
  );
};

export default CommercialLogin; 