import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AuthCard from '../../../components/auth/AuthCard';
import FormInput from '../../../components/common/FormInput';
import { ADMIN_CREDENTIALS } from '../../../config/admin';
import styles from '../../../components/auth/AuthCard.module.css';

const AdminLogin = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    employeeId: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate credentials
    if (formData.employeeId === ADMIN_CREDENTIALS.employeeId && 
        formData.password === ADMIN_CREDENTIALS.password) {
      // TODO: Set admin session/token
      router.push('/admin/dashboard');
    } else {
      setError('Invalid employee ID or password');
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
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Login
        </button>
      </form>
    </AuthCard>
  );
};

export default AdminLogin; 