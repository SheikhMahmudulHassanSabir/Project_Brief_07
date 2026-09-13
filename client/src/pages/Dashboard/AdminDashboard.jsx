import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Building2,
  Briefcase,
  FileText,
  Trash2,
  MapPin,
} from 'lucide-react';
import axios from 'axios';
import './EmployerDashboard.css';
import ConfirmModal from '../../components/common/ConfirmModal';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    actionType: null,
    targetId: null,
  });

  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, jobsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/jobs`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setJobs(jobsRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId) => {
    setConfirmState({ isOpen: true, actionType: 'user', targetId: userId });
  };

  const handleDeleteJob = (jobId) => {
    setConfirmState({ isOpen: true, actionType: 'job', targetId: jobId });
  };

  const executeConfirmAction = async () => {
    const { actionType, targetId } = confirmState;
    if (!targetId) return;

    if (actionType === 'user') {
      try {
        await axios.delete(`${API_URL}/admin/users/${targetId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.filter((u) => u._id !== targetId));
        fetchAdminData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete user');
      }
    } else if (actionType === 'job') {
      try {
        await axios.delete(`${API_URL}/jobs/${targetId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(jobs.filter((j) => j._id !== targetId));
        fetchAdminData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete job');
      }
    }
    setConfirmState({ isOpen: false, actionType: null, targetId: null });
  };

  const metrics = stats?.metrics || {
    totalUsers: 0,
    totalEmployers: 0,
    totalJobs: 0,
    totalApplications: 0,
  };

  return (
    <div className="dashboard-page-wrapper">
      <div className="container dashboard-wrapper" style={{ maxWidth: '1200px' }}>
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
              <Shield size={26} color="#0B1F4B" />
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', margin: 0, color: '#0B1F4B' }}>
              Platform Administration
            </h1>
          </div>
          <p style={{ color: '#64748B', fontSize: '1.05rem', margin: '0 0 0 60px' }}>
            System-wide analytics, user governance, vacancy moderation, and platform health
          </p>
        </div>

        {/* KPI Grid */}
        <div className="kpi-matrix">
          <div className="kpi-stat-card">
            <div className="kpi-stat-icon" style={{ background: '#F8FAFC', color: '#0B4FE8' }}>
              <Users size={24} />
            </div>
            <div>
              <div className="kpi-stat-label">Job Seekers</div>
              <div className="kpi-stat-value">{metrics.totalUsers}</div>
            </div>
          </div>

          <div className="kpi-stat-card">
            <div className="kpi-stat-icon" style={{ background: '#F8FAFC', color: '#0F172A' }}>
              <Building2 size={24} />
            </div>
            <div>
              <div className="kpi-stat-label">Employers</div>
              <div className="kpi-stat-value">{metrics.totalEmployers}</div>
            </div>
          </div>

          <div className="kpi-stat-card">
            <div className="kpi-stat-icon" style={{ background: '#F0FDF4', color: '#166534' }}>
              <Briefcase size={24} />
            </div>
            <div>
              <div className="kpi-stat-label">Active Vacancies</div>
              <div className="kpi-stat-value">{metrics.totalJobs}</div>
            </div>
          </div>

          <div className="kpi-stat-card">
            <div className="kpi-stat-icon" style={{ background: '#FFFBEB', color: '#B45309' }}>
              <FileText size={24} />
            </div>
            <div>
              <div className="kpi-stat-label">Applications</div>
              <div className="kpi-stat-value">{metrics.totalApplications}</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-nav-container">
          <button
            className={`tab-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Live Activity
          </button>
          <button
            className={`tab-nav-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Governance ({users.length})
          </button>
          <button
            className={`tab-nav-btn ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('jobs')}
          >
            Job Moderation ({jobs.length})
          </button>
        </div>

        {/* Tab: Overview / Recent Activity */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
            <div className="dashboard-table-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.5rem', color: '#0B1F4B' }}>Recent Registrations</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {stats?.recentUsers?.map((u) => (
                  <div
                    key={u._id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingBottom: '1rem',
                      borderBottom: '1px solid #E2E8F0',
                    }}
                  >
                    <div>
                      <strong style={{ color: '#0F172A', fontSize: '1.05rem', display: 'block', marginBottom: '4px' }}>{u.name}</strong>
                      <div style={{ fontSize: '0.85rem', color: '#64748B' }}>{u.email}</div>
                    </div>
                    <span
                      className={`badge badge-neutral`}
                      style={{ 
                        fontSize: '0.8rem', 
                        padding: '0.4rem 0.8rem', 
                        borderRadius: '999px',
                        background: u.role === 'admin' ? '#FEF2F2' : u.role === 'employer' ? '#F0FDF4' : '#F8FAFC',
                        color: u.role === 'admin' ? '#991B1B' : u.role === 'employer' ? '#166534' : '#0F172A',
                        border: `1px solid ${u.role === 'admin' ? '#FCA5A5' : u.role === 'employer' ? '#86EFAC' : '#E2E8F0'}`,
                      }}
                    >
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-table-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.5rem', color: '#0B1F4B' }}>Recent Applications</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {stats?.recentApplications?.length === 0 ? (
                  <p style={{ color: '#64748B' }}>No recent submissions.</p>
                ) : (
                  stats?.recentApplications?.map((app) => (
                    <div
                      key={app._id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingBottom: '1rem',
                        borderBottom: '1px solid #E2E8F0',
                      }}
                    >
                      <div>
                        <div style={{ color: '#0F172A', fontSize: '1.05rem', fontWeight: '600', marginBottom: '4px' }}>
                          {app.applicant?.name || 'Applicant'} <span style={{ color: '#64748B', fontWeight: '400', fontSize: '0.9rem' }}>applied for</span>
                        </div>
                        <div style={{ color: '#0B4FE8', fontWeight: '700', fontSize: '0.95rem', marginBottom: '4px' }}>
                          {app.job?.title || 'Job'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                          {app.job?.companyName || 'N/A'}
                        </div>
                      </div>
                      <span
                        className={`status-badge ${
                          app.status === 'Shortlisted'
                            ? 'shortlisted'
                            : app.status === 'Rejected'
                            ? 'rejected'
                            : 'pending'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Users Management */}
        {activeTab === 'users' && (
          <div className="dashboard-table-card">
            <div style={{ overflowX: 'auto' }}>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>User & Email</th>
                    <th>Assigned Role</th>
                    <th>Joined Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div className="dashboard-table-job-title">{u.name}</div>
                        <div className="dashboard-table-job-meta">{u.email}</div>
                      </td>
                      <td>
                        <span
                          className={`badge badge-neutral`}
                          style={{ 
                            fontSize: '0.8rem', 
                            padding: '0.4rem 0.8rem', 
                            borderRadius: '999px',
                            background: u.role === 'admin' ? '#FEF2F2' : u.role === 'employer' ? '#F0FDF4' : '#F8FAFC',
                            color: u.role === 'admin' ? '#991B1B' : u.role === 'employer' ? '#166534' : '#0F172A',
                            border: `1px solid ${u.role === 'admin' ? '#FCA5A5' : u.role === 'employer' ? '#86EFAC' : '#E2E8F0'}`,
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td style={{ color: '#0F172A', fontWeight: '500' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        {u.role !== 'admin' ? (
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleDeleteUser(u._id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FEF2F2', color: '#991B1B', borderColor: '#FCA5A5', borderRadius: '999px' }}
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        ) : (
                          <span style={{ color: '#94A3B8', fontSize: '0.85rem', fontStyle: 'italic' }}>Protected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Job Moderation */}
        {activeTab === 'jobs' && (
          <div className="dashboard-table-card">
            <div style={{ overflowX: 'auto' }}>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Category</th>
                    <th>Date Posted</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job._id}>
                      <td>
                        <div className="dashboard-table-job-title">{job.title}</div>
                        <div className="dashboard-table-job-meta">
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} />
                            <span>{job.location}</span>
                          </span>
                        </div>
                      </td>
                      <td style={{ fontWeight: '600', color: '#0F172A' }}>{job.companyName || job.employer?.companyName}</td>
                      <td>
                        <span className="badge badge-neutral" style={{ background: '#F8FAFC', color: '#0F172A', border: '1px solid #E2E8F0', padding: '0.4rem 0.8rem', borderRadius: '999px' }}>
                          {job.category}
                        </span>
                      </td>
                      <td style={{ color: '#0F172A', fontWeight: '500' }}>{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleDeleteJob(job._id)}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FEF2F2', color: '#991B1B', borderColor: '#FCA5A5', borderRadius: '999px' }}
                        >
                          <Trash2 size={14} />
                          <span>Remove</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={confirmState.isOpen}
        title={confirmState.actionType === 'user' ? "Delete User" : "Delete Job Vacancy"}
        message={
          confirmState.actionType === 'user' 
            ? "Are you sure? This will remove the user and all associated jobs/applications."
            : "Delete this job posting from the platform? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={executeConfirmAction}
        onClose={() => setConfirmState({ isOpen: false, actionType: null, targetId: null })}
      />
    </div>
  );
}

export default AdminDashboard;
