import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './Dashboard.module.css';

interface CommercialData {
  firmName: string;
  managerName: string;
  email: string;
  phone: string;
  gstNumber: string;
  cinNumber: string;
  address: string;
  requestedFields: string[];
  approvalStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
}

const CommercialDashboard = () => {
  const router = useRouter();
  const [commercialData, setCommercialData] = useState<CommercialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCommercialData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/commercial/login');
          return;
        }

        const response = await fetch('/api/commercial/get-profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const responseText = await response.text();
        console.log('API Response:', responseText);
        
        try {
          const data = JSON.parse(responseText);
          
          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch commercial data');
          }

          setCommercialData(data.commercial);
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          throw new Error('Invalid response format from server');
        }
      } catch (err) {
        console.error('Error fetching commercial data:', err);
        setError(err instanceof Error ? err.message : 'Error loading commercial data');
        if (err instanceof Error && err.message.includes('token')) {
          router.push('/auth/commercial/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCommercialData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('commercial');
    router.push('/auth/commercial/login');
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
          <h1>Welcome, {commercialData?.firmName}</h1>
          <p className={styles.subtitle}>Manage your commercial space profile</p>
        </div>

        <div className={styles.content}>
          <div className={styles.mainSection}>
            <div className={styles.card}>
              <h2>Company Information</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <label>Firm Name</label>
                  <p>{commercialData?.firmName}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Manager Name</label>
                  <p>{commercialData?.managerName}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Email</label>
                  <p>{commercialData?.email}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Phone</label>
                  <p>{commercialData?.phone}</p>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h2>Business Details</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <label>GST Number</label>
                  <p>{commercialData?.gstNumber}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>CIN Number</label>
                  <p>{commercialData?.cinNumber}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Business Address</label>
                  <p>{commercialData?.address}</p>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h2>Requested Services</h2>
              <div className={styles.serviceGrid}>
                {commercialData?.requestedFields.map((field, index) => (
                  <div key={index} className={styles.serviceItem}>
                    <span className={styles.serviceIcon}>✓</span>
                    {field}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.card}>
              <h2>Account Status</h2>
              <div className={styles.statusInfo}>
                <div className={styles.statusBadge}>
                  <span className={`${styles.status} ${
                    commercialData?.approvalStatus === 'approved'
                      ? styles.statusApproved
                      : commercialData?.approvalStatus === 'rejected'
                      ? styles.statusRejected
                      : styles.statusPending
                  }`}>
                    {commercialData?.approvalStatus.toUpperCase()}
                  </span>
                </div>
                <div className={styles.statusItem}>
                  <label>Registration Date</label>
                  <p>{new Date(commercialData?.createdAt || '').toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h2>Quick Actions</h2>
              <div className={styles.actionButtons}>
                <button className={styles.primaryButton}>
                  Update Profile
                </button>
                <button className={styles.secondaryButton}>
                  View Documents
                </button>
                <button className={styles.dangerButton} onClick={handleLogout}>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {commercialData?.approvalStatus === 'rejected' && (
          <div className={styles.rejectionNotice}>
            <h2>❌ Application Rejected</h2>
            <p>Your commercial space application has been rejected.</p>
            {commercialData.rejectionReason && (
              <div className={styles.rejectionReason}>
                <strong>Reason:</strong> {commercialData.rejectionReason}
              </div>
            )}
            <p>Please contact our support team for more information or to appeal this decision.</p>
          </div>
        )}

        {commercialData?.approvalStatus === 'pending' && (
          <div className={styles.pendingNotice}>
            <h2>⏳ Application Under Review</h2>
            <p>Your commercial space application is currently being reviewed.</p>
            <p>We will notify you via email once the review is complete.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommercialDashboard; 