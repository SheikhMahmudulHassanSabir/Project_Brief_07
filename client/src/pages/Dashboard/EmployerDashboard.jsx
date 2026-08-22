import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Users,
  Star,
  Plus,
  Trash2,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import axios from 'axios';
import './EmployerDashboard.css';

function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listings');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  const [jobForm, setJobForm] = useState({
    title: '',
    category: 'Engineering',
    location: '',
    salaryRange: '$80,000 - $120,000 / yr',
    requirements: '',
    description: '',
  });

  const [formMsg, setFormMsg] = useState({ type: '', text: '' });
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchEmployerJobs();
  }, []);

  const fetchEmployerJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/jobs/my-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setFormMsg({ type: '', text: '' });

    try {
      await axios.post(
        `${API_URL}/jobs`,
        {
          ...jobForm,
          companyName: user.companyName || user.name,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFormMsg({ type: 'success', text: 'Job posted successfully!' });
      setTimeout(() => {
        setIsPostModalOpen(false);
        setJobForm({
          title: '',
          category: 'Engineering',
          location: '',
          salaryRange: '$80,000 - $120,000 / yr',
          requirements: '',
          description: '',
        });
        setFormMsg({ type: '', text: '' });
        fetchEmployerJobs();
      }, 1000);
    } catch (err) {
      setFormMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to post job. Please try again.',
      });
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job vacancy and all its applicants?')) return;

    try {
      await axios.delete(`${API_URL}/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter((j) => j._id !== jobId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete job');
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

  return (
    <div className="page-wrapper">
      <div className="container dashboard-wrapper">
        {/* Header Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>Employer Portal</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Welcome back, <strong>{user.name}</strong> • <span style={{ color: 'var(--palette-accent)', fontWeight: '600' }}>{user.companyName || 'Company Workspace'}</span>
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setIsPostModalOpen(true)}>
            <Plus size={18} />
            <span>Post New Vacancy</span>
          </button>
        </div>

        {/* KPI Grid */}
        <div className="kpi-matrix">
          <div className="kpi-stat-card">
            <div className="kpi-stat-icon" style={{ background: 'var(--primary-50)', color: 'var(--palette-accent)' }}>
              <Briefcase size={24} color="var(--palette-accent)" />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>
                Active Vacancies
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>{totalJobsCount}</div>
            </div>
          </div>

          <div className="kpi-stat-card">
            <div className="kpi-stat-icon" style={{ background: 'var(--bg-surface-subtle)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }}>
              <Users size={24} color="var(--text-primary)" />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>
                Total Applicants
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>{totalApplicantsCount}</div>
            </div>
          </div>

          <div className="kpi-stat-card">
            <div className="kpi-stat-icon" style={{ background: 'var(--success-bg)', color: 'var(--success-text)' }}>
              <Star size={24} color="var(--success-text)" />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>
                Shortlisted
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>{totalShortlistedCount}</div>
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
          <div className="table-container">
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}>
                <div className="skeleton" style={{ height: '40px', width: '100%', marginBottom: '1rem' }} />
                <div className="skeleton" style={{ height: '40px', width: '100%', marginBottom: '1rem' }} />
                <div className="skeleton" style={{ height: '40px', width: '100%' }} />
              </div>
            ) : jobs.length === 0 ? (
              <div className="empty-state">
                <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'var(--bg-surface-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '1px solid var(--border-default)' }}>
                  <Briefcase size={26} color="var(--palette-accent)" />
                </div>
                <h3 className="empty-state-title">No Active Listings</h3>
                <p className="empty-state-desc">You haven't posted any job openings yet. Start by publishing your first vacancy.</p>
                <button className="btn btn-primary" onClick={() => setIsPostModalOpen(true)}>
                  <Plus size={16} />
                  <span>Publish First Vacancy</span>
                </button>
              </div>
            ) : (
              <table className="data-table">
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
                  {jobs.map((job) => (
                    <tr key={job._id}>
                      <td>
                        <strong>{job.title}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{job.salaryRange}</div>
                      </td>
                      <td>
                        <span className="badge badge-primary">{job.category}</span>
                      </td>
                      <td>{job.location}</td>
                      <td>
                        <span style={{ fontWeight: '700', color: job.applicantCount > 0 ? 'var(--palette-accent)' : 'var(--text-muted)' }}>
                          {job.applicantCount || 0} candidate(s)
                        </span>
                        {job.shortlistedCount > 0 && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--success-text)' }}>
                            ({job.shortlistedCount} shortlisted)
                          </div>
                        )}
                      </td>
                      <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-sm btn-secondary" onClick={() => openApplicantsModal(job)}>
                            Review Candidates
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteJob(job._id)} title="Delete job">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 2: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="card" style={{ padding: '2.5rem', border: '1.5px solid var(--border-default)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Organization Profile</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
              <div>
                <label className="form-label" style={{ color: 'var(--text-muted)' }}>Company Name</label>
                <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>{user.companyName || 'N/A'}</div>
              </div>
              <div>
                <label className="form-label" style={{ color: 'var(--text-muted)' }}>Industry Sector</label>
                <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>{user.industry || 'Technology'}</div>
              </div>
              <div>
                <label className="form-label" style={{ color: 'var(--text-muted)' }}>Company Website</label>
                <div>
                  {user.companyWebsite ? (
                    <a href={user.companyWebsite} target="_blank" rel="noreferrer" style={{ color: 'var(--palette-accent)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span>{user.companyWebsite}</span>
                      <ExternalLink size={14} />
                    </a>
                  ) : (
                    'Not specified'
                  )}
                </div>
              </div>
              <div>
                <label className="form-label" style={{ color: 'var(--text-muted)' }}>Company Size</label>
                <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>{user.companySize || '1-10'} employees</div>
              </div>
            </div>
          </div>
        )}

        {/* Post Job Modal */}
        {isPostModalOpen && (
          <div className="app-modal-overlay" onClick={() => setIsPostModalOpen(false)}>
            <div className="app-modal-box" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>Publish New Job Vacancy</h2>
                <button onClick={() => setIsPostModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <X size={22} />
                </button>
              </div>

              {formMsg.text && (
                <div className={`alert ${formMsg.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                  {formMsg.text}
                </div>
              )}

              <form onSubmit={handlePostJob} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Position Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Senior Frontend Engineer"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Category *</label>
                    <select
                      className="form-select"
                      value={jobForm.category}
                      onChange={(e) => setJobForm({ ...jobForm, category: e.target.value })}
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Product">Product</option>
                      <option value="Sales">Sales</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Work Location *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Remote / New York, NY"
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Salary Range</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. $100,000 - $130,000 / yr"
                      value={jobForm.salaryRange}
                      onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Key Requirements (comma separated)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="React, TypeScript, 4+ yrs exp"
                      value={jobForm.requirements}
                      onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Job Description *</label>
                  <textarea
                    rows="5"
                    className="form-textarea"
                    placeholder="Outline key responsibilities, qualifications, and role perks..."
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '0.5rem' }}>
                  Publish Job Vacancy
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Review Applicants Modal */}
        {isApplicantsModalOpen && (
          <div className="app-modal-overlay" onClick={() => setIsApplicantsModalOpen(false)}>
            <div className="app-modal-box" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>Applicants: {selectedJob?.title}</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
                    Managing {applicants.length} candidate submission{applicants.length === 1 ? '' : 's'}
                  </p>
                </div>
                <button onClick={() => setIsApplicantsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <X size={22} />
                </button>
              </div>

              {loadingApplicants ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>Loading candidate profiles...</div>
              ) : applicants.length === 0 ? (
                <div className="empty-state">
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--bg-surface-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '1px solid var(--border-default)' }}>
                    <Users size={24} color="var(--palette-accent)" />
                  </div>
                  <h3 className="empty-state-title">No Candidates Yet</h3>
                  <p className="empty-state-desc">No applications have been submitted for this position yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {applicants.map((app) => (
                    <div
                      key={app._id}
                      className="card"
                      style={{
                        padding: '1.25rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        border: '1.5px solid var(--border-default)',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                          {app.applicant?.name || 'Candidate'}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          {app.applicant?.email} • {app.applicant?.location || 'Remote'}
                        </div>
                        {app.applicant?.headline && (
                          <div style={{ color: 'var(--palette-accent)', fontSize: '0.88rem', marginTop: '4px', fontWeight: '600' }}>
                            {app.applicant.headline}
                          </div>
                        )}
                        {app.applicant?.skills && app.applicant.skills.length > 0 && (
                          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '6px' }}>
                            {app.applicant.skills.map((s, idx) => (
                              <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
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

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn btn-sm btn-secondary"
                            style={{ color: 'var(--success-text)', background: 'var(--success-bg)', borderColor: 'var(--success-border)', display: 'flex', alignItems: 'center', gap: '4px' }}
                            onClick={() => handleStatusChange(app._id, 'Shortlisted')}
                          >
                            <Check size={14} />
                            <span>Shortlist</span>
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                            onClick={() => handleStatusChange(app._id, 'Rejected')}
                          >
                            <X size={14} />
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
    </div>
  );
}

export default EmployerDashboard;
