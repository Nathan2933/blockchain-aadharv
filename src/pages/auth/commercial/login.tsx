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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleRequestApproval = async () => {
    setIsRequestingApproval(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/commercial/request-approval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit approval request');
      }

      setStatus('pending');
      setError('Approval request submitted successfully. You will be notified via email once approved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit approval request');
    } finally {
      setIsRequestingApproval(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/commercial/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          setStatus(data.status);
          setError(data.message);
          return;
        }
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('commercialSpace', JSON.stringify(data.commercialSpace));
      
      // Redirect to dashboard
      router.push('/commercial/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login. Please try again.');
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