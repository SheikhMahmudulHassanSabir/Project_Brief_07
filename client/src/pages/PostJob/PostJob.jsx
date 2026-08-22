import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import axios from 'axios';

function PostJob() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const [formData, setFormData] = useState({
    title: '',
    category: 'Engineering',
    location: user.location || '',
    salaryRange: '$80,000 - $120,000 / yr',
    requirements: '',
    description: '',
    companyName: user.companyName || user.name || '',
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      setMsg({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/jobs`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg({ type: 'success', text: 'Job vacancy published successfully! Redirecting to dashboard...' });
      setTimeout(() => {
        navigate('/employer');
      }, 1200);
    } catch (err) {
      setMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to publish job vacancy. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <section style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)', padding: '2rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Link
              to="/employer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--text-secondary)',
                fontWeight: '600',
                fontSize: '0.88rem',
                marginBottom: '0.5rem',
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Employer Dashboard</span>
            </Link>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
              Publish a New Vacancy
            </h1>
          </div>
        </div>
      </section>

      {/* Main Form Container */}
      <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '820px' }}>
        {msg.text && (
          <div className={`alert ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '2rem' }}>
            {msg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{msg.text}</span>
          </div>
        )}

        <div className="card" style={{ padding: '2.5rem', border: '1.5px solid var(--border-default)', boxShadow: 'var(--shadow-lg)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Position Title */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Position Title *</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. Lead Full-Stack Software Engineer"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Company & Category */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Hiring Organization / Company *</label>
                <input
                  type="text"
                  name="companyName"
                  className="form-input"
                  placeholder="e.g. Acme Innovations Corp"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Industry Category *</label>
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Engineering">Engineering & Software</option>
                  <option value="Design">UI/UX & Product Design</option>
                  <option value="Marketing">Marketing & Growth</option>
                  <option value="Product">Product Management</option>
                  <option value="Sales">Sales & Business Dev</option>
                  <option value="Finance">Finance & Accounting</option>
                </select>
              </div>
            </div>

            {/* Location & Salary Range */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Work Location *</label>
                <input
                  type="text"
                  name="location"
                  className="form-input"
                  placeholder="e.g. Remote / San Francisco, CA"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Compensation / Salary Range</label>
                <input
                  type="text"
                  name="salaryRange"
                  className="form-input"
                  placeholder="e.g. $110,000 - $145,000 / yr"
                  value={formData.salaryRange}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Requirements */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Required Skills & Technologies (comma separated)</label>
              <input
                type="text"
                name="requirements"
                className="form-input"
                placeholder="React, TypeScript, GraphQL, Docker, 4+ yrs experience"
                value={formData.requirements}
                onChange={handleChange}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                These will be displayed as badge tags to attract matching candidates.
              </span>
            </div>

            {/* Detailed Description */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Comprehensive Job Description *</label>
              <textarea
                name="description"
                rows="7"
                className="form-textarea"
                placeholder="Describe role responsibilities, team structure, qualification criteria, and employee benefits..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <Link to="/employer" className="btn btn-secondary">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                <Briefcase size={18} />
                <span>{loading ? 'Publishing Vacancy...' : 'Publish Job Vacancy'}</span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default PostJob;
