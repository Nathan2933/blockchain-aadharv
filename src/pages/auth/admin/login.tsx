import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AuthCard from '../../../components/auth/AuthCard';
import styles from '../../../components/auth/AuthCard.module.css';

const AdminLogin = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    employeeId: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and admin data
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('admin', JSON.stringify(data.admin));
      
      // Redirect to dashboard
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Admin Login" 
      subtitle="Access the administrative dashboard"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <div className={styles.errorMessage}>{error}</div>
        </div>}
        
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label className={styles.label}>Employee ID</label>
          <input
            type="text"
            name="employeeId"
            className={styles.input}
            value={formData.employeeId}
            onChange={handleChange}
            required
            placeholder="Enter your employee ID"
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <div className={`${styles.formGroup} ${styles.fullWidth} ${styles.links}`}>
        </div>
      </form>
    </AuthCard>
  );
};

export default AdminLogin; 