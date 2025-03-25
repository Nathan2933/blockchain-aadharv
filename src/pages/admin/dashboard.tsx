import React, { useState } from 'react';
import styles from './Dashboard.module.css';

interface CommercialRequest {
  id: string;
  firmName: string;
  managerName: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedFields: string[];
  timestamp: string;
}

const AdminDashboard = () => {
  // Mock data for commercial space requests
  const [requests, setRequests] = useState<CommercialRequest[]>([
    {
      id: '1',
      firmName: 'Hotel Luxury Inn',
      managerName: 'John Doe',
      email: 'john@luxuryinn.com',
      status: 'pending',
      requestedFields: ['Name', 'Phone', 'Email'],
      timestamp: '2024-03-25 10:30 AM'
    },
    {
      id: '2',
      firmName: 'City Hospital',
      managerName: 'Jane Smith',
      email: 'jane@cityhospital.com',
      status: 'pending',
      requestedFields: ['Name', 'Aadhar', 'Phone', 'Email'],
      timestamp: '2024-03-25 11:45 AM'
    },
    {
      id: '3',
      firmName: 'Tech Solutions Inc',
      managerName: 'Mike Johnson',
      email: 'mike@techsolutions.com',
      status: 'approved',
      requestedFields: ['Name', 'Email', 'Phone'],
      timestamp: '2024-03-25 09:15 AM'
    },
    {
      id: '4',
      firmName: 'Global Bank',
      managerName: 'Sarah Wilson',
      email: 'sarah@globalbank.com',
      status: 'rejected',
      requestedFields: ['Name', 'Aadhar', 'PAN', 'Phone'],
      timestamp: '2024-03-24 03:20 PM'
    }
  ]);

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'approved' } : req
    ));
    // TODO: Generate and assign QR code
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'rejected' } : req
    ));
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>👋 Welcome, Admin</h1>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h3>📝 Pending Requests</h3>
            <p>{pendingCount}</p>
            <span className={styles.trend}>
              {pendingCount > 0 ? '↑' : '→'} {pendingCount} this week
            </span>
          </div>
          <div className={styles.statCard}>
            <h3>✅ Approved Spaces</h3>
            <p>{approvedCount}</p>
            <span className={styles.trend}>
              {approvedCount > 0 ? '↑' : '→'} {approvedCount} this week
            </span>
          </div>
          <div className={styles.statCard}>
            <h3>❌ Rejected Requests</h3>
            <p>{rejectedCount}</p>
            <span className={styles.trend}>
              {rejectedCount > 0 ? '↑' : '→'} {rejectedCount} this week
            </span>
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
              {requests.map(request => (
                <tr key={request.id}>
                  <td>
                    <strong>{request.firmName}</strong>
                  </td>
                  <td>{request.managerName}</td>
                  <td>
                    <a href={`mailto:${request.email}`} className={styles.email}>
                      {request.email}
                    </a>
                  </td>
                  <td>
                    <ul className={styles.fieldsList}>
                      {request.requestedFields.map(field => (
                        <li key={field}>{field}</li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <span className={`${styles.status} ${styles[`status${request.status.charAt(0).toUpperCase() + request.status.slice(1)}`]}`}>
                      {request.status === 'pending' ? '⏳' : request.status === 'approved' ? '✅' : '❌'} {request.status}
                    </span>
                  </td>
                  <td>
                    {request.status === 'pending' && (
                      <div className={styles.actions}>
                        <button 
                          onClick={() => handleApprove(request.id)}
                          className={styles.approveBtn}
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(request.id)}
                          className={styles.rejectBtn}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {request.status === 'approved' && (
                      <button className={styles.qrBtn}>
                        View QR
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Recent Activity</h2>
        <div className={styles.activityList}>
          {requests.map(request => (
            <div key={request.id} className={styles.activityItem}>
              <div className={styles.activityIcon}>
                {request.status === 'pending' ? '🔔' : request.status === 'approved' ? '✅' : '❌'}
              </div>
              <div className={styles.activityContent}>
                <p>
                  <strong>{request.firmName}</strong> requested registration
                </p>
                <span className={styles.timestamp}>
                  🕒 {request.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 