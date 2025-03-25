import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './Dashboard.module.css';

interface UserData {
  name: string;
  email: string;
  phone: string;
  aadharNumber: string;
  panNumber: string;
  address: string;
  age: number;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvalDate?: string;
  rejectionReason?: string;
}

const UserDashboard = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      router.push('/auth/user/login');
      return;
    }

    // Parse user data
    try {
      const parsedUser = JSON.parse(user);
      setUserData(parsedUser);
    } catch (err) {
      console.error('Error parsing user data:', err);
      setError('Error loading user data');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/user/login');
  };

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return styles.statusApproved;
      case 'rejected':
        return styles.statusRejected;
      default:
        return styles.statusPending;
    }
  };

  const getApprovalStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return '✅';
      case 'rejected':
        return '❌';
      default:
        return '⏳';
    }
  };

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>👋 Welcome, {userData?.name}</h1>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h3>📱 Profile Status</h3>
            <p className={`${styles.status} ${getApprovalStatusColor(userData?.approvalStatus || 'pending')}`}>
              {getApprovalStatusIcon(userData?.approvalStatus || 'pending')} {userData?.approvalStatus?.charAt(0).toUpperCase() + userData?.approvalStatus?.slice(1)}
            </p>
          </div>
          <div className={styles.statCard}>
            <h3>🔑 Last Login</h3>
            <p>{new Date().toLocaleDateString()}</p>
          </div>
          <div className={styles.statCard}>
            <h3>📅 Member Since</h3>
            <p>{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {userData?.approvalStatus === 'rejected' && (
        <div className={`${styles.section} ${styles.rejectionNotice}`}>
          <h2>❌ Account Rejected</h2>
          <p>Your account has been rejected by the administrator.</p>
          {userData.rejectionReason && (
            <div className={styles.rejectionReason}>
              <strong>Reason:</strong> {userData.rejectionReason}
            </div>
          )}
          <p>Please contact support for more information or to appeal this decision.</p>
        </div>
      )}

      {userData?.approvalStatus === 'pending' && (
        <div className={`${styles.section} ${styles.pendingNotice}`}>
          <h2>⏳ Pending Approval</h2>
          <p>Your account is currently pending approval from the administrator.</p>
          <p>You will be notified via email once your account has been reviewed.</p>
        </div>
      )}

      <div className={styles.section}>
        <h2>Profile Information</h2>
        <div className={styles.profileInfo}>
          <div className={styles.infoGroup}>
            <label>Name</label>
            <p>{userData?.name}</p>
          </div>
          <div className={styles.infoGroup}>
            <label>Email</label>
            <p>{userData?.email}</p>
          </div>
          <div className={styles.infoGroup}>
            <label>Phone</label>
            <p>{userData?.phone}</p>
          </div>
          <div className={styles.infoGroup}>
            <label>Aadhar Number</label>
            <p>{userData?.aadharNumber}</p>
          </div>
          <div className={styles.infoGroup}>
            <label>PAN Number</label>
            <p>{userData?.panNumber}</p>
          </div>
          <div className={styles.infoGroup}>
            <label>Address</label>
            <p>{userData?.address}</p>
          </div>
          <div className={styles.infoGroup}>
            <label>Age</label>
            <p>{userData?.age}</p>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Account Actions</h2>
        <div className={styles.actions}>
          <button className={styles.editButton}>
            Edit Profile
          </button>
          <button className={styles.changePasswordButton}>
            Change Password
          </button>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 