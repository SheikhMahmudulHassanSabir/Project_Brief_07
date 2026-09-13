import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  Star,
  Plus,
  Trash2,
  Check,
  X,
  ExternalLink,
  Search,
} from 'lucide-react';
import axios from 'axios';
import './EmployerDashboard.css';
import Welcome from '../../components/common/Welcome';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useAuth } from '../../context/AuthContext';

function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listings');
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const { user, token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchEmployerJobs();
  }, [user]);

  const fetchEmployerJobs = async () => {
    try {
      setLoading(true);
      const allJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
      const myJobs = allJobs.filter(job => job.employerId === user?.id);
      setJobs(myJobs);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = (jobId) => {
    setJobToDelete(jobId);
    setIsConfirmOpen(true);
  };

  const executeDeleteJob = async () => {
    if (!jobToDelete) return;
    try {
      const allJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
      const updatedJobs = allJobs.filter(j => j._id !== jobToDelete);
      localStorage.setItem('jobs', JSON.stringify(updatedJobs));
      setJobs(jobs.filter((j) => j._id !== jobToDelete));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete job');
    } finally {
      setJobToDelete(null);
    }
  };

  const openApplicantsModal = async (job) => {
    setSelectedJob(job);
    setIsApplicantsModalOpen(true);
    setLoadingApplicants(true);
    try {
      const res = await axios.get(`${API_URL}/applications/job/${job._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplicants(res.data);
    } catch (err) {
      console.error('Error fetching applicants:', err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await axios.put(
        `${API_URL}/applications/${applicationId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplicants((prev) =>
        prev.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app))
      );
      fetchEmployerJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update applicant status');
    }
  };

  const totalJobsCount = jobs.length;
  const totalApplicantsCount = jobs.reduce((acc, curr) => acc + (curr.applicantCount || 0), 0);
  const totalShortlistedCount = jobs.reduce((acc, curr) => acc + (curr.shortlistedCount || 0), 0);

  const filteredJobs = jobs.filter(job => 
    (job.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (job.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-page-wrapper">
      <div className="container dashboard-wrapper" style={{ maxWidth: '1200px' }}>
        {/* Header Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <Welcome 
            dashboardTitle="Employer Portal" 
            userName={user?.name} 
            organizationName={user?.companyName || 'Company Workspace'} 
          />
          <Link to="/post-job" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '999px', padding: '0.8rem 1.5rem' }}>
            <Plus size={18} />
            <span>Post New Vacancy</span>
          </Link>
        </div>

        {/* KPI Grid */}
        <div className="kpi-matrix">
          <div className="kpi-stat-card">
            <div className="kpi-stat-icon" style={{ background: '#F8FAFC', color: '#0B4FE8' }}>
              <Briefcase size={24} />
            </div>
            <div>
              <div className="kpi-stat-label">Active Vacancies</div>
              <div className="kpi-stat-value">{totalJobsCount}</div>
            </div>
          </div>

          <div className="kpi-stat-card">
            <div className="kpi-stat-icon" style={{ background: '#F8FAFC', color: '#0F172A' }}>
              <Users size={24} />
            </div>
            <div>
              <div className="kpi-stat-label">Total Applicants</div>
              <div className="kpi-stat-value">{totalApplicantsCount}</div>
            </div>
          </div>

          <div className="kpi-stat-card">
            <div className="kpi-stat-icon" style={{ background: '#F0FDF4', color: '#166534' }}>
              <Star size={24} />
            </div>
            <div>
              <div className="kpi-stat-label">Shortlisted</div>
              <div className="kpi-stat-value">{totalShortlistedCount}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-nav-container">
          <button
            className={`tab-nav-btn ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            My Job Listings ({totalJobsCount})
          </button>
          <button
            className={`tab-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Company Profile
          </button>
        </div>

        {/* Tab 1: Listings Table */}
        {activeTab === 'listings' && (
          <div className="dashboard-table-card">
            <div className="dashboard-table-header">
              <h2 className="dashboard-table-title">Active Job Listings</h2>
              
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input 
                    type="text" 
                    placeholder="Search jobs..." 
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
                <div className="skeleton" style={{ height: '40px', width: '100%', marginBottom: '1rem' }} />
                <div className="skeleton" style={{ height: '40px', width: '100%', marginBottom: '1rem' }} />
                <div className="skeleton" style={{ height: '40px', width: '100%' }} />
              </div>
            ) : jobs.length === 0 ? (
              <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid #E2E8F0' }}>
                  <Briefcase size={28} color="#0B4FE8" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0B1F4B', marginBottom: '0.5rem' }}>No Active Listings</h3>
                <p style={{ color: '#64748B', marginBottom: '2rem' }}>You haven't posted any job openings yet. Start by publishing your first vacancy.</p>
                <Link to="/post-job" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '999px' }}>
                  <Plus size={18} />
                  <span>Publish First Vacancy</span>
                </Link>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <Search size={40} color="#94A3B8" style={{ margin: '0 auto 1rem', display: 'block' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0B1F4B', marginBottom: '0.5rem' }}>No results found</h3>
                <p style={{ color: '#64748B', marginBottom: '1.5rem' }}>We couldn't find any job listings matching "{searchQuery}".</p>
                <button onClick={() => setSearchQuery('')} className="btn btn-secondary" style={{ borderRadius: '999px', background: '#ffffff', color: '#0F172A', borderColor: '#E2E8F0' }}>Clear Search</button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Position Title</th>
                      <th>Category</th>
                      <th>Location</th>
                      <th>Candidates</th>
                      <th>Date Posted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.map((job) => (
                      <tr key={job._id}>
                        <td>
                          <div className="dashboard-table-job-title">{job.title}</div>
                          <div className="dashboard-table-job-meta">{job.salaryRange || 'Competitive'}</div>
                        </td>
                        <td>
                          <span className="badge badge-neutral" style={{ background: '#F8FAFC', color: '#0F172A', border: '1px solid #E2E8F0', padding: '0.4rem 0.8rem', borderRadius: '999px' }}>
                            {job.category}
                          </span>
                        </td>
                        <td style={{ color: '#0F172A', fontWeight: '500' }}>{job.location}</td>
                        <td>
                          <div style={{ fontWeight: '700', color: job.applicantCount > 0 ? '#0B4FE8' : '#64748B' }}>
                            {job.applicantCount || 0} candidate(s)
                          </div>
                          {job.shortlistedCount > 0 && (
                            <div style={{ fontSize: '0.8rem', color: '#166534', marginTop: '2px', fontWeight: '600' }}>
                              ({job.shortlistedCount} shortlisted)
                            </div>
                          )}
                        </td>
                        <td style={{ color: '#64748B' }}>{new Date(job.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-sm btn-secondary" onClick={() => openApplicantsModal(job)} style={{ borderRadius: '999px', background: '#ffffff', borderColor: '#E2E8F0', color: '#0F172A' }}>
                              Review
                            </button>
                            <button className="btn btn-sm btn-secondary" onClick={() => handleDeleteJob(job._id)} title="Delete job" style={{ background: '#FEF2F2', color: '#991B1B', borderColor: '#FCA5A5', borderRadius: '50%', width: '32px', height: '32px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="dashboard-table-card" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#0B1F4B', fontWeight: '800' }}>Organization Profile</h2>
              <Link to="/profile" className="btn btn-secondary btn-sm" style={{ borderRadius: '999px', background: '#ffffff', color: '#0F172A', borderColor: '#DCE6F2', padding: '0.5rem 1.25rem' }}>Edit Profile</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem' }}>
              <div>
                <div style={{ color: '#64748B', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem' }}>Company Name</div>
                <div style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0F172A' }}>{user?.companyName || 'N/A'}</div>
              </div>
              <div>
                <div style={{ color: '#64748B', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem' }}>Industry Sector</div>
                <div style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0F172A' }}>{user?.industry || 'Technology'}</div>
              </div>
              <div>
                <div style={{ color: '#64748B', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem' }}>Company Website</div>
                <div>
                  {user?.companyWebsite ? (
                    <a href={user.companyWebsite} target="_blank" rel="noreferrer" style={{ color: '#0B4FE8', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                      <span>{user.companyWebsite}</span>
                      <ExternalLink size={16} />
                    </a>
                  ) : (
                    <span style={{ color: '#0F172A', fontWeight: '600' }}>Not specified</span>
                  )}
                </div>
              </div>
              <div>
                <div style={{ color: '#64748B', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem' }}>Company Size</div>
                <div style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0F172A' }}>{user?.companySize || '1-10'} employees</div>
              </div>
            </div>
          </div>
        )}

        {/* Review Applicants Modal */}
        {isApplicantsModalOpen && (
          <div className="app-modal-overlay" onClick={() => setIsApplicantsModalOpen(false)}>
            <div className="app-modal-box" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0, color: '#0B1F4B' }}>Applicants for {selectedJob?.title}</h2>
                  <p style={{ color: '#64748B', fontSize: '1rem', margin: '8px 0 0 0' }}>
                    Reviewing {applicants.length} candidate submission{applicants.length === 1 ? '' : 's'}
                  </p>
                </div>
                <button onClick={() => setIsApplicantsModalOpen(false)} style={{ background: '#F8FAFC', border: 'none', cursor: 'pointer', color: '#64748B', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={20} />
                </button>
              </div>

              {loadingApplicants ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>Loading candidate profiles...</div>
              ) : applicants.length === 0 ? (
                <div style={{ padding: '3rem 2rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid #E2E8F0' }}>
                    <Users size={28} color="#0B1F4B" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0B1F4B', marginBottom: '0.5rem' }}>No Candidates Yet</h3>
                  <p style={{ color: '#64748B' }}>No applications have been submitted for this position yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {applicants.map((app) => (
                    <div
                      key={app._id}
                      style={{
                        padding: '1.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '1.5rem',
                        background: '#ffffff',
                        border: '1px solid #E2E8F0',
                        borderRadius: '24px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0B1F4B', marginBottom: '0.25rem' }}>
                          {app.applicant?.name || 'Candidate'}
                        </div>
                        <div style={{ color: '#64748B', fontSize: '0.95rem', fontWeight: '500' }}>
                          {app.applicant?.email} • {app.applicant?.location || 'Remote'}
                        </div>
                        {app.applicant?.headline && (
                          <div style={{ color: '#0B4FE8', fontSize: '0.95rem', marginTop: '6px', fontWeight: '700' }}>
                            {app.applicant.headline}
                          </div>
                        )}
                        {app.applicant?.skills && app.applicant.skills.length > 0 && (
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '1rem' }}>
                            {app.applicant.skills.map((s, idx) => (
                              <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', borderRadius: '999px', background: '#F8FAFC', color: '#0F172A', border: '1px solid #E2E8F0' }}>
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
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

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn btn-sm btn-secondary"
                            style={{ color: '#166534', background: '#F0FDF4', borderColor: '#86EFAC', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '6px' }}
                            onClick={() => handleStatusChange(app._id, 'Shortlisted')}
                          >
                            <Check size={16} />
                            <span>Shortlist</span>
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            style={{ color: '#991B1B', background: '#FEF2F2', borderColor: '#FCA5A5', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '6px' }}
                            onClick={() => handleStatusChange(app._id, 'Rejected')}
                          >
                            <X size={16} />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        title="Delete Vacancy"
        message="Are you sure you want to delete this job vacancy and all its applicants? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={executeDeleteJob}
        onClose={() => {
          setIsConfirmOpen(false);
          setJobToDelete(null);
        }}
      />
    </div>
  );
}

export default EmployerDashboard;
