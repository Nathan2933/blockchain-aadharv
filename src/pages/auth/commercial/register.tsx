import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AuthCard from '../../../components/auth/AuthCard';
import styles from '../../../components/auth/AuthCard.module.css';

interface CommercialRegistrationData {
  firmName: string;
  managerName: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  requestedFields: string[];
  password: string;
  confirmPassword: string;
}

const CommercialRegister = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<CommercialRegistrationData>({
    firmName: '',
    managerName: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    requestedFields: [],
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');

  const availableFields = [
    { id: 'name', label: 'Name' },
    { id: 'phone', label: 'Phone Number' },
    { id: 'email', label: 'Email Address' },
    { id: 'aadhar', label: 'Aadhar Number' },
    { id: 'pan', label: 'PAN Number' },
    { id: 'address', label: 'Address' },
    { id: 'age', label: 'Age' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleCheckboxChange = (fieldId: string) => {
    setFormData(prev => {
      const newFields = prev.requestedFields.includes(fieldId)
        ? prev.requestedFields.filter(f => f !== fieldId)
        : [...prev.requestedFields, fieldId];
      return { ...prev, requestedFields: newFields };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.requestedFields.length === 0) {
      setError('Please select at least one field to request from users');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/commercial/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firmName: formData.firmName,
          managerName: formData.managerName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          description: formData.description,
          requestedFields: formData.requestedFields,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      router.push('/auth/commercial/login?registered=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register. Please try again.');
    }
  };

  return (
    <AuthCard 
      title="Commercial Space Registration" 
      subtitle="Register your business to access user data"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <div className={styles.errorMessage}>{error}</div>
        </div>}
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Firm Name</label>
          <input
            type="text"
            name="firmName"
            className={styles.input}
            value={formData.firmName}
            onChange={handleChange}
            required
            placeholder="Enter your firm name"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Manager Name</label>
          <input
            type="text"
            name="managerName"
            className={styles.input}
            value={formData.managerName}
            onChange={handleChange}
            required
            placeholder="Enter manager's name"
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
          <label className={styles.label}>Business Address</label>
          <input
            type="text"
            name="address"
            className={styles.input}
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="Enter your business address"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Business Description</label>
          <textarea
            name="description"
            className={styles.textarea}
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Describe your business and why you need user data"
            rows={4}
          />
        </div>

        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label className={styles.label}>Requested User Data Fields</label>
          <div className={styles.checkboxGroup}>
            {availableFields.map(field => (
              <label key={field.id} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={formData.requestedFields.includes(field.id)}
                  onChange={() => handleCheckboxChange(field.id)}
                />
                {field.label}
              </label>
            ))}
          </div>
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

        <button type="submit" className={styles.submitButton}>
          Register
        </button>

        <div className={`${styles.formGroup} ${styles.fullWidth} ${styles.links}`}>
          <span>Already registered?</span>
          <a href="/auth/commercial/login" className={styles.link}>
            Login here
          </a>
        </div>
      </form>
    </AuthCard>
  );
};

export default CommercialRegister; 