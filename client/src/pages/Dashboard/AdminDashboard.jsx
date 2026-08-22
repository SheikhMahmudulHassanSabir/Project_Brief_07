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

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

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

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure? This will remove the user and all associated jobs/applications.')) return;

    try {
      await axios.delete(`${API_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== userId));
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Delete this job posting from the platform?')) return;

    try {
      await axios.delete(`${API_URL}/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter((j) => j._id !== jobId));
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete job');
    }
  };

  const metrics = stats?.metrics || {
    totalUsers: 0,
    totalEmployers: 0,
    totalJobs: 0,
    totalApplications: 0,
  };

  return (
    <div className="page-wrapper">
      <div className="container dashboard-wrapper">
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
            <Shield size={28} color="var(--palette-accent)" />
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
              Platform Administration
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            System-wide analytics, user governance, vacancy moderation, and platform health
          </p>
        </div>

        {/* KPI Grid */}
        <div className="kpi-matrix">
          <div className="kpi-stat-card">
            <div className="kpi-stat-icon" style={{ background: 'var(--primary-50)', color: 'var(--palette-accent)' }}>
              <Users size={24} color="var(--palette-accent)" />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>
                Job Seekers
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>{metrics.totalUsers}</div>
            </div>
          </div>

          <div className="kpi-stat-card">
            <div className="kpi-stat-icon" style={{ background: 'var(--bg-surface-subtle)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }}>
              <Building2 size={24} color="var(--text-primary)" />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>
                Employers
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>{metrics.totalEmployers}</div>
            </div>
          </div>

          <div className="kpi-stat-card">
            <div className="kpi-stat-icon" style={{ background: 'var(--success-bg)', color: 'var(--success-text)' }}>
              <Briefcase size={24} color="var(--success-text)" />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>
                Active Vacancies
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>{metrics.totalJobs}</div>
            </div>
          </div>

          <div className="kpi-stat-card">
            <div className="kpi-stat-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning-text)' }}>
              <FileText size={24} color="var(--warning-text)" />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>
                Applications
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>{metrics.totalApplications}</div>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ padding: '1.75rem', border: '1.5px solid var(--border-default)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Recent Registrations</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {stats?.recentUsers?.map((u) => (
                  <div
                    key={u._id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingBottom: '0.75rem',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>{u.name}</strong>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </div>
                    <span
                      className={`badge ${
                        u.role === 'admin'
                          ? 'badge-danger'
                          : u.role === 'employer'
                          ? 'badge-primary'
                          : 'badge-neutral'
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: '1.75rem', border: '1.5px solid var(--border-default)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Recent Applications</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {stats?.recentApplications?.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No recent submissions.</p>
                ) : (
                  stats?.recentApplications?.map((app) => (
                    <div
                      key={app._id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingBottom: '0.75rem',
                        borderBottom: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div>
                        <strong style={{ color: 'var(--text-primary)' }}>{app.applicant?.name || 'Applicant'}</strong> applied for{' '}
                        <em style={{ color: 'var(--palette-accent)' }}>{app.job?.title || 'Job'}</em>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          Company: {app.job?.companyName || 'N/A'}
                        </div>
                      </div>
                      <span
                        className={`badge ${
                          app.status === 'Shortlisted'
                            ? 'badge-success'
                            : app.status === 'Rejected'
                            ? 'badge-danger'
                            : 'badge-warning'
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
          <div className="table-container">
            <table className="data-table">
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
                      <strong>{u.name}</strong>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{u.email}</div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          u.role === 'admin'
                            ? 'badge-danger'
                            : u.role === 'employer'
                            ? 'badge-primary'
                            : 'badge-neutral'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      {u.role !== 'admin' && (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteUser(u._id)}
                          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Trash2 size={13} />
                          <span>Delete User</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: Job Moderation */}
        {activeTab === 'jobs' && (
          <div className="table-container">
            <table className="data-table">
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
                      <strong style={{ color: 'var(--text-primary)' }}>{job.title}</strong>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <MapPin size={12} color="var(--palette-accent)" />
                        <span>{job.location}</span>
                      </div>
                    </td>
                    <td>{job.companyName || job.employer?.companyName}</td>
                    <td>
                      <span className="badge badge-primary">{job.category}</span>
                    </td>
                    <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteJob(job._id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Trash2 size={13} />
                        <span>Remove Listing</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
