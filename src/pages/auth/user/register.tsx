import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AuthCard from '../../../components/auth/AuthCard';
import styles from '../../../components/auth/AuthCard.module.css';

const UserRegister = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    aadharNumber: '',
    panNumber: '',
    documents: null,
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, documents: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement registration logic
    console.log('Registration data:', formData);
    router.push('/auth/user/login');
  };

  return (
    <AuthCard 
      title="Create User Account" 
      subtitle="Register to manage your digital identity securely"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Full Name</label>
          <input
            type="text"
            name="fullName"
            className={styles.input}
            value={formData.fullName}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
        </div>

        <div className={styles.formGroup}>
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

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Phone Number <span className={styles.optional}>(Optional)</span>
          </label>
          <input
            type="tel"
            name="phoneNumber"
            className={styles.input}
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Aadhar Number <span className={styles.optional}>(Optional)</span>
          </label>
          <input
            type="text"
            name="aadharNumber"
            className={styles.input}
            value={formData.aadharNumber}
            onChange={handleChange}
            placeholder="Enter your Aadhar number"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            PAN Number <span className={styles.optional}>(Optional)</span>
          </label>
          <input
            type="text"
            name="panNumber"
            className={styles.input}
            value={formData.panNumber}
            onChange={handleChange}
            placeholder="Enter your PAN number"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Government Documents <span className={styles.optional}>(Optional)</span>
          </label>
          <input
            type="file"
            name="documents"
            className={styles.input}
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
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
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Create Account
        </button>
      </form>
    </AuthCard>
  );
};

export default UserRegister; 