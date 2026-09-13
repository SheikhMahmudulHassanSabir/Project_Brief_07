import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  DollarSign,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Briefcase,
  Share2,
  Check,
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './JobDetails.css';

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [copied, setCopied] = useState(false);
  const [alertMsg, setAlertMsg] = useState({ type: '', text: '' });
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [coverNote, setCoverNote] = useState('');

  const { user, token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchJobDetails();
    if (token && user?.role === 'job-seeker') {
      checkApplicationStatus();
    }
  }, [id, token, user]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/jobs/${id}`);
      setJob(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Job vacancy not found.');
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const res = await axios.get(`${API_URL}/applications/my-applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const applied = res.data.some((app) => (app.job?._id || app.job) === id);
      setIsApplied(applied);
    } catch (err) {
      console.error('Error checking application status:', err);
    }
  };

  const handleOpenApplyModal = () => {
    if (!token || !user) {
      navigate('/login');
      return;
    }
    if (user.role === 'employer') {
      setAlertMsg({
        type: 'error',
        text: 'Employer accounts cannot apply for vacancies. Please log in with a candidate account.',
      });
      return;
    }
    setApplyModalOpen(true);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setApplying(true);
    setAlertMsg({ type: '', text: '' });

    try {
      await axios.post(
        `${API_URL}/applications`,
        { jobId: id, coverNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsApplied(true);
      setApplyModalOpen(false);
      setAlertMsg({
        type: 'success',
        text: 'Application submitted successfully! Track your candidate status in the dashboard.',
      });
    } catch (err) {
      setAlertMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit application.',
      });
    } finally {
      setApplying(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="job-details-page container" style={{ padding: '4rem 1.5rem' }}>
        <div className="skeleton" style={{ height: '40px', width: '30%', marginBottom: '1.5rem' }} />
        <div className="skeleton" style={{ height: '200px', width: '100%', marginBottom: '2rem' }} />
        <div className="skeleton" style={{ height: '300px', width: '100%' }} />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-details-page container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="job-details-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3.5rem' }}>
          <AlertCircle size={48} color="#0B1F4B" style={{ margin: '0 auto 1.5rem' }} />
          <h2 style={{ marginBottom: '1rem', fontSize: '1.8rem', fontWeight: '800', color: '#0B1F4B' }}>Position Not Found</h2>
          <p style={{ color: '#64748B', marginBottom: '2rem', fontSize: '1.05rem' }}>
            {error || 'This job listing is no longer active or may have been deleted.'}
          </p>
          <Link to="/jobs" className="btn btn-primary pill-btn" style={{ padding: '0.8rem 1.5rem' }}>
            Explore Open Vacancies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      {/* Sticky Header Actions */}
      <section className="job-details-header">
        <div className="container flex justify-between items-center flex-wrap gap-4">
          <Link
            to="/jobs"
            className="flex items-center gap-2 font-semibold"
            style={{ color: '#64748B', transition: 'color 0.2s' }}
          >
            <ArrowLeft size={18} />
            <span>Back to All Vacancies</span>
          </Link>

          <button
            onClick={handleShare}
            className="btn btn-secondary pill-btn flex items-center gap-2"
            style={{ padding: '0.5rem 1.25rem', background: '#ffffff', borderColor: '#DCE6F2' }}
          >
            {copied ? <Check size={16} color="#166534" /> : <Share2 size={16} />}
            <span>{copied ? 'Link Copied!' : 'Share Position'}</span>
          </button>
        </div>
      </section>

      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        {/* Feedback Alert */}
        {alertMsg.text && (
          <div className={`auth-alert ${alertMsg.type === 'success' ? 'success' : 'error'}`} style={{ marginBottom: '2rem' }}>
            {alertMsg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span>{alertMsg.text}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2.5rem', alignItems: 'flex-start' }} className="job-details-layout">
          {/* Main Job Content Column */}
          <div>
            {/* Header Card */}
            <div className="job-details-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <span className="badge badge-primary" style={{ padding: '0.5rem 1rem', borderRadius: '999px', fontWeight: '700' }}>
                  {job.category}
                </span>
                <span style={{ fontSize: '0.9rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                  <Clock size={16} />
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h1 className="job-details-title">
                {job.title}
              </h1>

              <div className="job-details-company">
                <Building2 size={24} />
                <span>{job.companyName}</span>
              </div>

              {/* Key Meta Grid */}
              <div className="job-details-meta-grid">
                <div className="job-details-meta-item">
                  <div className="job-details-meta-icon">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="job-details-meta-label">Location</div>
                    <div className="job-details-meta-value">{job.location}</div>
                  </div>
                </div>

                <div className="job-details-meta-item">
                  <div className="job-details-meta-icon">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <div className="job-details-meta-label">Salary Range</div>
                    <div className="job-details-meta-value">{job.salaryRange || 'Competitive'}</div>
                  </div>
                </div>

                <div className="job-details-meta-item">
                  <div className="job-details-meta-icon">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <div className="job-details-meta-label">Job Type</div>
                    <div className="job-details-meta-value">Full-Time</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="job-details-card">
              <h2 className="job-details-section-title">
                Position Overview & Responsibilities
              </h2>
              <div className="job-details-content" style={{ whiteSpace: 'pre-line' }}>
                {job.description}
              </div>

              {/* Skills & Requirements Section */}
              {job.requirements && job.requirements.length > 0 && (
                <div style={{ marginTop: '3rem', borderTop: '1px solid #DCE6F2', paddingTop: '2.5rem' }}>
                  <h3 className="job-details-section-title">
                    Key Qualifications & Skills
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {job.requirements.map((req, idx) => (
                      <span
                        key={idx}
                        className="badge badge-neutral"
                        style={{ padding: '0.6rem 1.2rem', fontSize: '0.95rem', borderRadius: '999px', fontWeight: '600', background: '#F8FAFC', color: '#0F172A', border: '1px solid #E2E8F0' }}
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar CTA & Company Info */}
          <div className="job-details-sidebar">
            {/* Quick Action Box */}
            <div className="job-details-card job-details-cta-card">
              <h3 className="job-details-cta-title">
                Interested in this role?
              </h3>
              <p className="job-details-cta-desc">
                Submit your profile directly to {job.companyName}'s hiring team for review.
              </p>

              {isApplied ? (
                <button
                  disabled
                  className="btn btn-secondary pill-btn"
                  style={{ width: '100%', color: '#166534', background: '#F0FDF4', borderColor: '#86EFAC', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '1rem' }}
                >
                  <CheckCircle2 size={20} />
                  <span>Application Submitted</span>
                </button>
              ) : (
                <button
                  onClick={handleOpenApplyModal}
                  className="btn btn-primary pill-btn"
                  style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem' }}
                >
                  Apply for Position
                </button>
              )}
            </div>

            {/* Employer Info Card */}
            <div className="job-details-card job-details-company-card">
              <h3 className="job-details-section-title" style={{ fontSize: '1.25rem' }}>
                About the Company
              </h3>

              <div className="company-field">
                <div className="company-field-label">Company</div>
                <div className="company-field-value">{job.companyName}</div>
              </div>

              {job.employer?.industry && (
                <div className="company-field">
                  <div className="company-field-label">Industry</div>
                  <div className="company-field-value">{job.employer.industry}</div>
                </div>
              )}

              {job.employer?.companySize && (
                <div className="company-field">
                  <div className="company-field-label">Company Size</div>
                  <div className="company-field-value">{job.employer.companySize} employees</div>
                </div>
              )}

              {job.employer?.companyWebsite && (
                <div className="company-field">
                  <div className="company-field-label">Website</div>
                  <a
                    href={job.employer.companyWebsite}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#0B4FE8', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                  >
                    <span>Visit Website</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {applyModalOpen && (
        <div className="app-modal-overlay" onClick={() => setApplyModalOpen(false)} style={{ zIndex: 100 }}>
          <div className="app-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', borderRadius: '32px', padding: '3rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.75rem', color: '#0B1F4B' }}>
              Submit Application
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem', marginBottom: '2rem' }}>
              Applying to <strong>{job.companyName}</strong> as <strong>{user?.name}</strong>
            </p>

            <form onSubmit={handleSubmitApplication} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0F172A' }}>Note / Cover Introduction (Optional)</label>
                <div style={{ background: '#F8FAFC', padding: '1rem 1.2rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <textarea
                    rows="5"
                    style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'vertical', fontSize: '0.95rem', color: '#0F172A' }}
                    placeholder="Introduce yourself and explain why you're a great fit for this position..."
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="btn btn-secondary pill-btn"
                  style={{ background: '#F8FAFC', color: '#0F172A', borderColor: '#E2E8F0', padding: '0.8rem 1.5rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="btn btn-primary pill-btn"
                  style={{ padding: '0.8rem 2rem' }}
                >
                  {applying ? 'Sending Application...' : 'Confirm & Apply'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobDetails;
