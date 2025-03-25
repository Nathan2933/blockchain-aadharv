import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AuthCard from '../../../components/auth/AuthCard';
import styles from '../../../components/auth/AuthCard.module.css';

interface LoginData {
  email: string;
  password: string;
}

const UserLogin = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (router.query.registered === 'true') {
      setError('Registration successful! Please login.');
    }
  }, [router.query]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/auth/user/login', {
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

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to dashboard
      router.push('/user/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login. Please try again.');
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>User Login</h1>
        <p className={styles.subtitle}>Sign in to your account</p>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
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

          <div className={styles.formGroup}>
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

          <div className={styles.links}>
            <Link href="/auth/user/register" className={styles.link}>
              Don't have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLogin; 