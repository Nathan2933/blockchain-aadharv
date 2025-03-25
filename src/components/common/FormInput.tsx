import React from 'react';
import styles from './FormInput.module.css';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  optional?: boolean;
}

const FormInput = ({ label, error, optional, ...props }: FormInputProps) => {
  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>
        {label}
        {optional && <span className={styles.optional}> (Optional)</span>}
      </label>
      <input className={`${styles.input} ${error ? styles.error : ''}`} {...props} />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

export default FormInput; 