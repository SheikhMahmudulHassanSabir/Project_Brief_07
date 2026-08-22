import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  MapPin,
  Search,
  Trash2,
  Building2,
  Mail,
} from 'lucide-react';
import axios from 'axios';
import './EmployerDashboard.css';

function JobSeekerDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/applications/my-applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;

    try {
      await axios.delete(`${API_URL}/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(applications.filter((app) => app._id !== applicationId));
      setMsg('Application withdrawn successfully.');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to withdraw application');
    }
  };

  const totalSubmitted = applications.length;
  const totalShortlisted = applications.filter((a) => a.status === 'Shortlisted').length;
  const totalPending = applications.filter((a) => a.status === 'Pending').length;

  return (
    <div className="page-wrapper">
      <div className="container dashboard-wrapper">
        {/* Header Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>Candidate Portal</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Welcome back, <strong>{user.name}</strong> • Track your applications & opportunities
            </p>
          </div>
          <Link to="/jobs" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Search size={16} />
            <span>Browse Open Vacancies</span>
          </Link>
        </div>

        {/* Status Alert */}
        {msg && (
          <div className="alert alert-success" style={{ marginBottom: '2rem' }}>
            <CheckCircle2 size={18} />
            <span>{msg}</span>
          </div>
        )}

        {/* KPI Grid */}
        <div className="kpi-matrix">
          <div className="kpi-stat-card">
            <div className="kpi-stat-icon" style={{ background: 'var(--primary-50)', color: 'var(--palette-accent)' }}>
              <FileText size={24} color="var(--palette-accent)" />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>
                Applied Jobs
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>{totalSubmitted}</div>
            </div>
          </div>

          <div className="kpi-stat-card">
            <div className="kpi-stat-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning-text)' }}>
              <Clock size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>
                Under Review
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>{totalPending}</div>
            </div>
          </div>

          <div className="kpi-stat-card">
            <div className="kpi-stat-icon" style={{ background: 'var(--success-bg)', color: 'var(--success-text)' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>
                Shortlisted
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>{totalShortlisted}</div>
            </div>
          </div>
        </div>

        {/* Grid: Applications List + Candidate Profile Card */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'flex-start' }} className="responsive-dashboard-grid">
          {/* Applications Table */}
          <div className="table-container">
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-surface)' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>Application History</h2>
            </div>

            {loading ? (
              <div style={{ padding: '2.5rem', textAlign: 'center' }}>
                <div className="skeleton" style={{ height: '35px', marginBottom: '1rem' }} />
                <div className="skeleton" style={{ height: '35px', marginBottom: '1rem' }} />
                <div className="skeleton" style={{ height: '35px' }} />
              </div>
            ) : applications.length === 0 ? (
              <div className="empty-state">
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--bg-surface-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '1px solid var(--border-default)' }}>
                  <FileText size={24} color="var(--palette-accent)" />
                </div>
                <h3 className="empty-state-title">No Applications Submitted</h3>
                <p className="empty-state-desc">You haven't applied to any job positions yet. Explore openings to get started.</p>
                <Link to="/jobs" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Search size={16} />
                  <span>Explore Openings</span>
                </Link>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Position & Company</th>
                    <th>Date Applied</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <strong>{app.job?.title || 'Job Listing'}</strong>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Building2 size={13} />
                            {app.job?.companyName || 'Employer'}
                          </span>
                          <span>•</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={13} />
                            {app.job?.location || 'Remote'}
                          </span>
                        </div>
                      </td>
                      <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td>
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
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleWithdraw(app._id)}
                          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Trash2 size={13} />
                          <span>Withdraw</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Profile Card */}
          <div className="card" style={{ padding: '1.75rem', border: '1.5px solid var(--border-default)' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'var(--primary-gradient)',
                border: '2px solid var(--palette-accent)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '800',
                marginBottom: '1rem',
                boxShadow: 'var(--primary-shadow)',
              }}
            >
              {user.name?.charAt(0) || 'C'}
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>{user.name}</h3>
            <div style={{ color: 'var(--palette-accent)', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.4rem' }}>
              {user.headline || 'Job Seeker'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} color="var(--palette-accent)" />
              <span>{user.location || 'Location not set'}</span>
            </div>

            <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '1rem', marginTop: '1rem' }}>
              <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '0.5rem' }}>
                Skills & Expertise
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, index) => (
                    <span key={index} className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No skills listed</span>
                )}
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', background: 'var(--bg-surface-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', border: '1px solid var(--border-default)' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mail size={12} color="var(--palette-accent)" />
                <span>Account Email</span>
              </div>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginTop: '2px' }}>{user.email}</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .responsive-dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default JobSeekerDashboard;
