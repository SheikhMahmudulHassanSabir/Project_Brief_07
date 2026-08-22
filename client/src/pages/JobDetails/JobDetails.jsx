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

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchJobDetails();
    if (token && user?.role === 'job-seeker') {
      checkApplicationStatus();
    }
  }, [id]);

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
      <div className="page-wrapper container" style={{ padding: '4rem 1.5rem' }}>
        <div className="skeleton" style={{ height: '40px', width: '30%', marginBottom: '1.5rem' }} />
        <div className="skeleton" style={{ height: '200px', width: '100%', marginBottom: '2rem' }} />
        <div className="skeleton" style={{ height: '300px', width: '100%' }} />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="page-wrapper container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem' }}>
          <AlertCircle size={40} color="var(--palette-accent)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ marginBottom: '0.5rem' }}>Position Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {error || 'This job listing is no longer active or may have been deleted.'}
          </p>
          <Link to="/jobs" className="btn btn-primary">
            Explore Open Vacancies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Top Breadcrumb Header */}
      <section style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)', padding: '1.75rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <Link
            to="/jobs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-secondary)',
              fontWeight: '600',
              fontSize: '0.9rem',
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to All Vacancies</span>
          </Link>

          <button
            onClick={handleShare}
            className="btn btn-sm btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            {copied ? <Check size={14} color="var(--success-text)" /> : <Share2 size={14} />}
            <span>{copied ? 'Link Copied!' : 'Share Position'}</span>
          </button>
        </div>
      </section>

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        {/* Feedback Alert */}
        {alertMsg.text && (
          <div className={`alert ${alertMsg.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '2rem' }}>
            {alertMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{alertMsg.text}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', alignItems: 'flex-start' }} className="responsive-job-grid">
          {/* Main Job Content Column */}
          <div>
            {/* Header Card */}
            <div className="card" style={{ padding: '2.25rem', marginBottom: '2rem', border: '1.5px solid var(--border-default)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <span className="badge badge-primary" style={{ fontSize: '0.85rem' }}>{job.category}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} />
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                {job.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: '600', color: 'var(--palette-accent)', marginBottom: '1.5rem' }}>
                <Building2 size={20} />
                <span>{job.companyName}</span>
              </div>

              {/* Key Meta Badges */}
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', padding: '1.25rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={18} color="var(--palette-accent)" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Location</div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{job.location}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign size={18} color="var(--palette-accent)" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Salary Range</div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{job.salaryRange || 'Competitive'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Briefcase size={18} color="var(--palette-accent)" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Job Type</div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Full-Time</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="card" style={{ padding: '2.25rem', marginBottom: '2rem', border: '1.5px solid var(--border-default)' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Position Overview & Responsibilities
              </h2>
              <div style={{ color: 'var(--text-secondary)', lineHeight: '1.75', fontSize: '1rem', whiteSpace: 'pre-line' }}>
                {job.description}
              </div>

              {/* Skills & Requirements Section */}
              {job.requirements && job.requirements.length > 0 && (
                <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border-default)', paddingTop: '1.75rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                    Key Qualifications & Skills
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {job.requirements.map((req, idx) => (
                      <span
                        key={idx}
                        className="badge badge-primary"
                        style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '90px' }}>
            {/* Quick Action Box */}
            <div className="card" style={{ padding: '1.75rem', border: '1.5px solid var(--border-default)', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Interested in this role?
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Submit your profile directly to {job.companyName}'s hiring team.
              </p>

              {isApplied ? (
                <button
                  disabled
                  className="btn btn-secondary"
                  style={{ width: '100%', color: 'var(--success-text)', background: 'var(--success-bg)', borderColor: 'var(--success-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <CheckCircle2 size={16} />
                  <span>Application Submitted</span>
                </button>
              ) : (
                <button
                  onClick={handleOpenApplyModal}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                >
                  Apply for Position
                </button>
              )}
            </div>

            {/* Employer Info Card */}
            <div className="card" style={{ padding: '1.75rem', border: '1.5px solid var(--border-default)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
                About the Company
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '600' }}>Company</div>
                  <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{job.companyName}</div>
                </div>

                {job.employer?.industry && (
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '600' }}>Industry</div>
                    <div style={{ color: 'var(--text-secondary)' }}>{job.employer.industry}</div>
                  </div>
                )}

                {job.employer?.companySize && (
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '600' }}>Size</div>
                    <div style={{ color: 'var(--text-secondary)' }}>{job.employer.companySize} employees</div>
                  </div>
                )}

                {job.employer?.companyWebsite && (
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '600' }}>Website</div>
                    <a
                      href={job.employer.companyWebsite}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'var(--palette-accent)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>Visit Website</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {applyModalOpen && (
        <div className="app-modal-overlay" onClick={() => setApplyModalOpen(false)}>
          <div className="app-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Submit Application: {job.title}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Applying to <strong>{job.companyName}</strong> as <strong>{user?.name}</strong> ({user?.email})
            </p>

            <form onSubmit={handleSubmitApplication} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Note / Cover Introduction (Optional)</label>
                <textarea
                  rows="4"
                  className="form-textarea"
                  placeholder="Introduce yourself and explain why you're a great fit for this position..."
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="btn btn-primary"
                >
                  {applying ? 'Sending Application...' : 'Confirm & Apply'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .responsive-job-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default JobDetails;
