import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AuthCard from '../../../components/auth/AuthCard';
import specific from './Login.module.css';
import styles from '../../../components/auth/AuthCard.module.css';

interface LoginData {
  email: string;
  password: string;
}

const UserLogin = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { registered } = router.query;
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (registered === 'true') {
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
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error('Server error: Invalid response format');
      }

      if (!response.ok) {
        if (data.message === 'Invalid credentials') {
          setError('Invalid credentials');
          return;
        }else if (data.message === 'Internal server error') {
          setError('Internal server error');
          return;
        } else {
          throw new Error(data.message || 'Login failed');
        }
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to dashboard
      router.push('/user/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>User Login</h1>
        <p className={styles.subtitle}>Sign in to your account</p>

        <form onSubmit={handleSubmit} className={`${styles.form} ${styles.formGroup} ${specific.form} ${styles.fullWidth}`}>
          {error && <div className={`${styles.errorMessage} ${specific.label}`}>{error}</div>}
          <div className={`${styles.formGroup} ${specific.form} ${styles.fullWidth}`}>
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

          <div className={`${styles.formGroup} ${specific.form} ${styles.fullWidth}`}>
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

          <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

          <div className={`${styles.formGroup} ${styles.fullWidth} ${styles.links}`}>
          <span>Don't have an account?</span>
          <a href="/auth/user/register" className={styles.link}>
            Register here
          </a>
        </div>
        </form>
      </div>
    </div>
  );
};

export default UserLogin; 