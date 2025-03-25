import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
      const response = await fetch('/api/admin/get-commercial-spaces');
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
      const response = await fetch('/api/admin/update-commercial-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update status');
      }

      // Update local state
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
      const response = await fetch('/api/admin/update-commercial-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

      // Update local state
      setCommercialSpaces(prev =>
        prev.map(space =>
          space._id === selectedSpaceId ? { ...space, status: 'rejected' } : space
        )
      );

      // Reset modal state
      setShowRejectionModal(false);
      setRejectionReason('');
      setSelectedSpaceId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject commercial space');
    }
  };

  const pendingCount = commercialSpaces.filter(r => r.status === 'pending').length;
  const approvedCount = commercialSpaces.filter(r => r.status === 'approved').length;
  const rejectedCount = commercialSpaces.filter(r => r.status === 'rejected').length;

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
        <h1>👋 Welcome, Admin</h1>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h3>📝 Pending Requests</h3>
            <p>{pendingCount}</p>
          </div>
          <div className={styles.statCard}>
            <h3>✅ Approved Spaces</h3>
            <p>{approvedCount}</p>
          </div>
          <div className={styles.statCard}>
            <h3>❌ Rejected Requests</h3>
            <p>{rejectedCount}</p>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Commercial Space Requests</h2>
        <div className={styles.requestsTable}>
          <table>
            <thead>
              <tr>
                <th>Firm Name</th>
                <th>Manager</th>
                <th>Email</th>
                <th>Requested Fields</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {commercialSpaces.map(space => (
                <tr key={space._id}>
                  <td>
                    <strong>{space.firmName}</strong>
                  </td>
                  <td>{space.managerName}</td>
                  <td>
                    <a href={`mailto:${space.email}`} className={styles.email}>
                      {space.email}
                    </a>
                  </td>
                  <td>
                    <ul className={styles.fieldsList}>
                      {space.requestedFields.map(field => (
                        <li key={field}>{field}</li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <span className={`${styles.status} ${styles[`status${space.status.charAt(0).toUpperCase() + space.status.slice(1)}`]}`}>
                      {space.status === 'pending' ? '⏳' : space.status === 'approved' ? '✅' : '❌'} {space.status}
                    </span>
                  </td>
                  <td>
                    {space.status === 'pending' && (
                      <div className={styles.actions}>
                        <button 
                          onClick={() => handleStatusUpdate(space._id, 'approved')}
                          className={styles.approveBtn}
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(space._id, 'rejected')}
                          className={styles.rejectBtn}
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

      {showRejectionModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Reject Commercial Space</h2>
            <p>Please provide a reason for rejection:</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className={styles.textarea}
              placeholder="Enter rejection reason..."
              required
            />
            <div className={styles.modalActions}>
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                  setSelectedSpaceId(null);
                }}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className={styles.rejectBtn}
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