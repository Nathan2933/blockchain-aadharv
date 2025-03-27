import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../../components/auth/AuthCard.module.css';

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  aadharNumber: string;
  panNumber: string;
  address: string;
  age: string;
  password: string;
  confirmPassword: string;
}

const UserRegister = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    phone: '',
    aadharNumber: '',
    panNumber: '',
    address: '',
    age: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    // Validate age
    const age = parseInt(formData.age);
    if (isNaN(age) || age < 18) {
      setError('You must be at least 18 years old');
      setIsLoading(false);
      return;
    }

    // Validate Aadhar number
    if (!/^\d{12}$/.test(formData.aadharNumber)) {
      setError('Aadhar number must be 12 digits');
      setIsLoading(false);
      return;
    }

    // Validate PAN number
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
      setError('Invalid PAN number format (e.g., ABCDE1234F)');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Submitting registration data:', { ...formData, password: '[HIDDEN]' });
      
      const response = await fetch('/api/auth/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          confirmPassword: undefined // Remove confirmPassword from the request
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === 'Email already registered') {
          setError('User already exists');
          return;
        }else if (data.message === 'aadharNumber already exists') {
          setError('Aadhar number already registered');
          return;
        }else if (data.message === 'panNumber already exists') {
          setError('PAN number already registered');
          return;
        } else {
          throw new Error(data.message || 'Registration failed');
        }
      }

      console.log('Registration successful:', data);
      router.push('/auth/user/login?registered=true');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Register for a new user account</p>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              className={styles.input}
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

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
            <label className={styles.label}>Phone Number</label>
            <input
              type="tel"
              name="phone"
              className={styles.input}
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Aadhar Number</label>
            <input
              type="text"
              name="aadharNumber"
              className={styles.input}
              value={formData.aadharNumber}
              onChange={handleChange}
              required
              placeholder="12-digit Aadhar number"
              maxLength={12}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>PAN Number</label>
            <input
              type="text"
              name="panNumber"
              className={styles.input}
              value={formData.panNumber}
              onChange={handleChange}
              required
              placeholder="PAN number (e.g., ABCDE1234F)"
              maxLength={10}
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Address</label>
            <textarea
              name="address"
              className={styles.textarea}
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter your full address"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Age</label>
            <input
              type="number"
              name="age"
              className={styles.input}
              value={formData.age}
              onChange={handleChange}
              required
              placeholder="Enter your age"
              min="18"
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
              placeholder="Create a password"
              minLength={8}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className={styles.input}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              minLength={8}
            />
          </div>

          <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>

          <div className={`${styles.formGroup} ${styles.fullWidth} ${styles.links}`}>
            <span>Already registered?</span>
            <a href="/auth/user/login" className={styles.link}>
              Login here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegister; 