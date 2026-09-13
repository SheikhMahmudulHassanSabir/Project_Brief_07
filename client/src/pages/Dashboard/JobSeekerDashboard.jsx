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
import './EmployerDashboard.css'; // Shared premium dashboard styles
import Welcome from '../../components/common/Welcome';
import PageTitle from '../../components/common/PageTitle';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useAuth } from '../../context/AuthContext';

function JobSeekerDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [appToWithdraw, setAppToWithdraw] = useState(null);

  const { user, token } = useAuth();
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

  const handleWithdraw = (applicationId) => {
    setAppToWithdraw(applicationId);
    setIsConfirmOpen(true);
  };

  const executeWithdraw = async () => {
    if (!appToWithdraw) return;
    try {
      await axios.delete(`${API_URL}/applications/${appToWithdraw}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(applications.filter((app) => app._id !== appToWithdraw));
      setMsg('Application withdrawn successfully.');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to withdraw application');
    } finally {
      setAppToWithdraw(null);
    }
  };

  const totalSubmitted = applications.length;
  const totalShortlisted = applications.filter((a) => a.status === 'Shortlisted').length;
  const totalPending = applications.filter((a) => a.status === 'Pending').length;

  const filteredApplications = applications.filter((app) => 
    (app.job?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (app.job?.companyName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-page-wrapper">
      <div className="container dashboard-wrapper" style={{ maxWidth: '1200px' }}>
        {/* Header Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <Welcome 
            dashboardTitle="Candidate Portal" 
            userName={user.name} 
            subtitle="Track your applications & opportunities" 
          />
          <Link to="/jobs" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '999px', padding: '0.8rem 1.5rem' }}>
            <Search size={18} />
            <span>Browse Open Vacancies</span>
          </Link>
        </div>

        {/* Status Alert */}
        {msg && (
          <div className="auth-alert success" style={{ marginBottom: '2rem' }}>
            <CheckCircle2 size={20} />
            <span>{msg}</span>
          </div>
        )}

        {/* KPI Grid */}
        <div className="kpi-matrix">
          <div className="kpi-stat-card">
            <div className="kpi-stat-icon" style={{ background: '#F8FAFC', color: '#0B4FE8' }}>
              <FileText size={24} />
            </div>
            <div>
              <div className="kpi-stat-label">Applied Jobs</div>
              <div className="kpi-stat-value">{totalSubmitted}</div>
            </div>
          </div>

          <div className="kpi-stat-card">
            <div className="kpi-stat-icon" style={{ background: '#FFFBEB', color: '#B45309' }}>
              <Clock size={24} />
            </div>
            <div>
              <div className="kpi-stat-label">Under Review</div>
              <div className="kpi-stat-value">{totalPending}</div>
            </div>
          </div>

          <div className="kpi-stat-card">
            <div className="kpi-stat-icon" style={{ background: '#F0FDF4', color: '#166534' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="kpi-stat-label">Shortlisted</div>
              <div className="kpi-stat-value">{totalShortlisted}</div>
            </div>
          </div>
        </div>

        {/* Grid: Applications List + Candidate Profile Card */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'flex-start' }} className="responsive-dashboard-grid">
          {/* Applications Table */}
          <div className="dashboard-table-card">
            <div className="dashboard-table-header">
              <h2 className="dashboard-table-title">Application History</h2>
              
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input 
                    type="text" 
                    placeholder="Search roles or companies..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '0.6rem 1rem 0.6rem 2.2rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', background: '#F8FAFC', color: '#0F172A', fontSize: '0.95rem' }}
                  />
                </div>
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="btn btn-sm btn-secondary" style={{ borderRadius: '12px', background: '#ffffff', borderColor: '#E2E8F0', color: '#0F172A' }}>
                    Clear
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}>
                <div className="skeleton" style={{ height: '40px', marginBottom: '1rem' }} />
                <div className="skeleton" style={{ height: '40px', marginBottom: '1rem' }} />
                <div className="skeleton" style={{ height: '40px' }} />
              </div>
            ) : applications.length === 0 ? (
              <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid #E2E8F0' }}>
                  <FileText size={28} color="#0B4FE8" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0B1F4B', marginBottom: '0.5rem' }}>No Applications Submitted</h3>
                <p style={{ color: '#64748B', marginBottom: '2rem' }}>You haven't applied to any job positions yet. Explore openings to get started.</p>
                <Link to="/jobs" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '999px' }}>
                  <Search size={18} />
                  <span>Explore Openings</span>
                </Link>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <Search size={40} color="#94A3B8" style={{ margin: '0 auto 1rem', display: 'block' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0B1F4B', marginBottom: '0.5rem' }}>No results found</h3>
                <p style={{ color: '#64748B', marginBottom: '1.5rem' }}>We couldn't find any applications matching "{searchQuery}".</p>
                <button onClick={() => setSearchQuery('')} className="btn btn-secondary" style={{ borderRadius: '999px', background: '#ffffff', color: '#0F172A', borderColor: '#E2E8F0' }}>Clear Search</button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Position & Company</th>
                      <th>Date Applied</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((app) => (
                      <tr key={app._id}>
                        <td>
                          <div className="dashboard-table-job-title">{app.job?.title || 'Job Listing'}</div>
                          <div className="dashboard-table-job-meta">
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Building2 size={14} />
                              {app.job?.companyName || 'Employer'}
                            </span>
                            <span>•</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={14} />
                              {app.job?.location || 'Remote'}
                            </span>
                          </div>
                        </td>
                        <td style={{ color: '#0F172A', fontWeight: '500' }}>{new Date(app.createdAt).toLocaleDateString()}</td>
                        <td>
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
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleWithdraw(app._id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FEF2F2', color: '#991B1B', borderColor: '#FCA5A5', borderRadius: '999px' }}
                          >
                            <Trash2 size={14} />
                            <span>Withdraw</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Profile Card */}
          <div className="dashboard-table-card" style={{ padding: '2rem' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0B4FE8 0%, #55C7EE 100%)',
                border: '3px solid #ffffff',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: '800',
                marginBottom: '1.25rem',
                boxShadow: '0 4px 10px rgba(11, 79, 232, 0.2)',
              }}
            >
              {user.name?.charAt(0) || 'C'}
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 0.25rem 0', color: '#0B1F4B' }}>{user.name}</h3>
            <div style={{ color: '#0B4FE8', fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              {user.headline || 'Job Seeker'}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} />
              <span>{user.location || 'Location not set'}</span>
            </div>

            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem', marginTop: '1.25rem' }}>
              <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#64748B', fontWeight: '700', marginBottom: '0.75rem' }}>
                Skills & Expertise
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {user.skills && user.skills.length > 0 && user.skills[0] !== "" ? (
                  user.skills.map((skill, index) => (
                    <span key={index} className="badge badge-primary" style={{ fontSize: '0.8rem', borderRadius: '999px', background: '#F8FAFC', color: '#0F172A', border: '1px solid #E2E8F0' }}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.9rem', color: '#94A3B8' }}>No skills listed</span>
                )}
              </div>
            </div>

            <div style={{ marginTop: '1.75rem', background: '#F8FAFC', padding: '1rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ color: '#64748B', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                <Mail size={14} />
                <span>Account Email</span>
              </div>
              <div style={{ fontWeight: '600', color: '#0F172A', marginTop: '4px' }}>{user.email}</div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <Link to="/profile" className="btn btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', borderRadius: '999px', background: '#ffffff', color: '#0F172A', borderColor: '#DCE6F2' }}>
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        title="Withdraw Application"
        message="Are you sure you want to withdraw this application? This action cannot be undone."
        confirmText="Withdraw"
        cancelText="Cancel"
        type="danger"
        onConfirm={executeWithdraw}
        onClose={() => {
          setIsConfirmOpen(false);
          setAppToWithdraw(null);
        }}
      />

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
