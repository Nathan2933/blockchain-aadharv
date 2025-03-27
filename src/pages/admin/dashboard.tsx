import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import styles from './Dashboard.module.css';

interface CommercialSpace {
  _id: string;
  firmName: string;
  managerName: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedFields: string[];
  createdAt: string;
}

const AdminDashboard = () => {
  const router = useRouter();
  const { isLoading: authLoading, logout } = useAdminAuth();
  const [commercialSpaces, setCommercialSpaces] = useState<CommercialSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);

  useEffect(() => {
    fetchCommercialSpaces();
  }, []);

  const fetchCommercialSpaces = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/get-commercial-spaces', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch commercial spaces');
      }

      setCommercialSpaces(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected') => {
    if (newStatus === 'rejected') {
      setSelectedSpaceId(id);
      setShowRejectionModal(true);
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/update-commercial-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update status');
      }

      setCommercialSpaces(prev =>
        prev.map(space =>
          space._id === id ? { ...space, status: newStatus } : space
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleReject = async () => {
    if (!selectedSpaceId || !rejectionReason) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/update-commercial-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: selectedSpaceId,
          status: 'rejected',
          rejectionReason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reject commercial space');
      }

      setCommercialSpaces(prev =>
        prev.map(space =>
          space._id === selectedSpaceId ? { ...space, status: 'rejected' } : space
        )
      );

      setShowRejectionModal(false);
      setRejectionReason('');
      setSelectedSpaceId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject commercial space');
    }
  };

  if (authLoading || loading) {
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

  const pendingCount = commercialSpaces.filter(r => r.status === 'pending').length;
  const approvedCount = commercialSpaces.filter(r => r.status === 'approved').length;
  const rejectedCount = commercialSpaces.filter(r => r.status === 'rejected').length;

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>Admin Dashboard</h1>
            <p className={styles.subtitle}>Manage commercial space applications</p>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.pending}`}>
            <h3>Pending</h3>
            <p className={styles.statNumber}>{pendingCount}</p>
          </div>
          <div className={`${styles.statCard} ${styles.approved}`}>
            <h3>Approved</h3>
            <p className={styles.statNumber}>{approvedCount}</p>
          </div>
          <div className={`${styles.statCard} ${styles.rejected}`}>
            <h3>Rejected</h3>
            <p className={styles.statNumber}>{rejectedCount}</p>
          </div>
        </div>

        <div className={styles.card}>
          <h2>Commercial Space Applications</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Firm Name</th>
                  <th>Manager</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {commercialSpaces.map((space) => (
                  <tr key={space._id}>
                    <td>{space.firmName}</td>
                    <td>{space.managerName}</td>
                    <td>{space.email}</td>
                    <td>
                      <span className={`${styles.status} ${styles[`status${space.status.charAt(0).toUpperCase() + space.status.slice(1)}`]}`}>
                        {space.status.toUpperCase()}
                      </span>
                    </td>
                    <td>{new Date(space.createdAt).toLocaleDateString()}</td>
                    <td>
                      {space.status === 'pending' && (
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.approveButton}
                            onClick={() => handleStatusUpdate(space._id, 'approved')}
                          >
                            Approve
                          </button>
                          <button
                            className={styles.rejectButton}
                            onClick={() => handleStatusUpdate(space._id, 'rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showRejectionModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Reject Application</h2>
            <p>Please provide a reason for rejection:</p>
            <textarea
              className={styles.textarea}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
            />
            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                  setSelectedSpaceId(null);
                }}
              >
                Cancel
              </button>
              <button
                className={styles.confirmButton}
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 