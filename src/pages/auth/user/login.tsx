import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AuthCard from '../../../components/auth/AuthCard';
import styles from '../../../components/auth/AuthCard.module.css';

const UserLogin = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
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
    // TODO: Implement user login logic
    try {
      // Temporary login success simulation
      console.log('Login attempt:', formData);
      router.push('/user/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <AuthCard 
      title="User Login" 
      subtitle="Access your secure digital identity"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <div className={styles.errorMessage}>{error}</div>
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

        <div className={`${styles.formGroup} ${styles.fullWidth} ${styles.links}`}>
          <Link href="/auth/user/register" className={styles.link}>
            Create new account
          </Link>
          <Link href="/auth/user/forgot-password" className={styles.link}>
            Forgot password?
          </Link>
        </div>
      </form>
    </AuthCard>
  );
};

export default UserLogin; 