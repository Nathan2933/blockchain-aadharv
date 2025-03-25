import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './Dashboard.module.css';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  aadharNumber: string;
  panNumber: string;
  address: string;
  age: number;
  createdAt: string;
  lastLogin?: string;
}

const UserDashboard = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/user/login');
          return;
        }

        const response = await fetch('/api/user/get-profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch user data');
        }

        // Set last login time when fetching user data
        setUserData({
          ...data.user,
          lastLogin: new Date().toISOString()
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err instanceof Error ? err.message : 'Error loading user data');
        if (err instanceof Error && err.message.includes('token')) {
          router.push('/auth/user/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/user/login');
  };

  // Format dates only after component is mounted on client
  const formatDate = (dateString: string) => {
    if (!mounted) return ''; // Return empty string during server-side rendering
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.container}>
          <div className={styles.loading}>Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.container}>
          <div className={styles.error}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Welcome back, {userData?.name}</h1>
          <p className={styles.subtitle}>Manage your profile and data</p>
        </div>

        <div className={styles.content}>
          <div className={styles.mainSection}>
            <div className={styles.card}>
              <h2>Personal Information</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <label>Full Name</label>
                  <p>{userData?.name}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Email Address</label>
                  <p>{userData?.email}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Phone Number</label>
                  <p>{userData?.phone}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Age</label>
                  <p>{userData?.age} years</p>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h2>Identity Documents</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <label>Aadhar Number</label>
                  <p>{userData?.aadharNumber}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>PAN Number</label>
                  <p>{userData?.panNumber}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Address</label>
                  <p>{userData?.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.card}>
              <h2>Quick Actions</h2>
              <div className={styles.actionButtons}>
                <button className={styles.primaryButton}>
                  Edit Profile
                </button>
                <button className={styles.secondaryButton}>
                  Change Password
                </button>
                <button className={styles.dangerButton} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>

            <div className={styles.card}>
              <h2>Account Status</h2>
              <div className={styles.statusInfo}>
                <div className={styles.statusItem}>
                  <label>Member Since</label>
                  <p>{userData?.createdAt ? formatDate(userData.createdAt) : ''}</p>
                </div>
                <div className={styles.statusItem}>
                  <label>Last Login</label>
                  <p>{userData?.lastLogin ? formatDate(userData.lastLogin) : ''}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;