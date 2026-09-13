import React, { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Building2,
  FileText,
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './PostJob.css';

function PostJob() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Engineering',
    location: user?.location || '',
    salaryRange: '$80,000 - $120,000 / yr',
    requirements: '',
    description: '',
    companyName: user?.companyName || user?.name || '',
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  React.useEffect(() => {
    if (isEditMode) {
      const allJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
      const jobToEdit = allJobs.find(j => j._id === id);
      if (jobToEdit) {
        setFormData({
          title: jobToEdit.title || '',
          category: jobToEdit.category || 'Engineering',
          location: jobToEdit.location || '',
          salaryRange: jobToEdit.salaryRange || '',
          requirements: jobToEdit.requirements ? jobToEdit.requirements.join(', ') : '',
          description: jobToEdit.description || '',
          companyName: jobToEdit.companyName || user?.companyName || user?.name || '',
        });
      }
    }
  }, [id, isEditMode, user]);

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
      const allJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
      
      if (isEditMode) {
        const updatedJobs = allJobs.map(j => {
          if (j._id === id) {
            return {
              ...j,
              ...formData,
              requirements: formData.requirements ? formData.requirements.split(',').map(r => r.trim()).filter(Boolean) : [],
              companyName: formData.companyName || user?.companyName || user?.name,
            };
          }
          return j;
        });
        localStorage.setItem('jobs', JSON.stringify(updatedJobs));
        setMsg({ type: 'success', text: 'Job vacancy updated successfully! Redirecting to dashboard...' });
      } else {
        const newJob = {
          _id: 'job_' + Date.now(),
          ...formData,
          requirements: formData.requirements ? formData.requirements.split(',').map(r => r.trim()).filter(Boolean) : [],
          companyName: formData.companyName || user?.companyName || user?.name,
          employerId: user?.id,
          createdAt: new Date().toISOString(),
          applicantCount: 0,
          shortlistedCount: 0
        };
        
        allJobs.push(newJob);
        localStorage.setItem('jobs', JSON.stringify(allJobs));
        setMsg({ type: 'success', text: 'Job vacancy published successfully! Redirecting to dashboard...' });
      }

      setTimeout(() => {
        navigate('/employer');
      }, 1200);
    } catch (err) {
      setMsg({
        type: 'error',
        text: err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'publish'} job vacancy. Please try again.`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-page">
      {/* Header */}
      <section className="post-job-header">
        <div className="container flex justify-between items-center flex-wrap gap-4">
          <div>
            <Link
              to="/employer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#64748B',
                fontWeight: '600',
                fontSize: '0.9rem',
                marginBottom: '0.75rem',
                textDecoration: 'none'
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Employer Dashboard</span>
            </Link>
            <h1 className="post-job-title">
              {isEditMode ? 'Edit Job Vacancy' : 'Publish a New Vacancy'}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Form Container */}
      <div className="container py-12 px-6" style={{ maxWidth: '900px' }}>
        {msg.text && (
          <div className={`auth-alert ${msg.type === 'success' ? 'success' : 'error'}`} style={{ marginBottom: '2rem' }}>
            {msg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span>{msg.text}</span>
          </div>
        )}

        <div className="post-job-card">
          <form onSubmit={handleSubmit} className="post-job-form">
            
            {/* Section 1: Basic Information */}
            <div>
              <h2 className="post-job-section-title">
                <Briefcase size={22} /> Basic Information
              </h2>
              
              <div className="post-job-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="post-job-form-group">
                  <label className="post-job-label">Position Title *</label>
                  <div className="post-job-input-wrapper">
                    <input
                      type="text"
                      name="title"
                      placeholder="e.g. Lead Full-Stack Software Engineer"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="post-job-form-group">
                  <label className="post-job-label">Industry Category *</label>
                  <div className="post-job-input-wrapper">
                    <select
                      name="category"
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
                    <div className="post-job-select-arrow" />
                  </div>
                </div>
              </div>

              <div className="post-job-grid">
                <div className="post-job-form-group">
                  <label className="post-job-label">Work Location *</label>
                  <div className="post-job-input-wrapper">
                    <input
                      type="text"
                      name="location"
                      placeholder="e.g. Remote / San Francisco, CA"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="post-job-form-group">
                  <label className="post-job-label">Compensation / Salary Range</label>
                  <div className="post-job-input-wrapper">
                    <input
                      type="text"
                      name="salaryRange"
                      placeholder="e.g. $110,000 - $145,000 / yr"
                      value={formData.salaryRange}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Details & Requirements */}
            <div>
              <h2 className="post-job-section-title" style={{ marginTop: '1rem' }}>
                <FileText size={22} /> Details & Requirements
              </h2>
              
              <div className="post-job-form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="post-job-label">Required Skills & Technologies (comma separated)</label>
                <div className="post-job-input-wrapper">
                  <input
                    type="text"
                    name="requirements"
                    placeholder="React, TypeScript, GraphQL, Docker, 4+ yrs experience"
                    value={formData.requirements}
                    onChange={handleChange}
                  />
                </div>
                <span style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px' }}>
                  These will be displayed as badge tags to attract matching candidates.
                </span>
              </div>

              <div className="post-job-form-group">
                <label className="post-job-label">Comprehensive Job Description *</label>
                <div className="post-job-textarea-wrapper">
                  <textarea
                    name="description"
                    placeholder="Describe role responsibilities, team structure, qualification criteria, and employee benefits..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Company Settings */}
            <div>
              <h2 className="post-job-section-title" style={{ marginTop: '1rem' }}>
                <Building2 size={22} /> Hiring Organization
              </h2>
              
              <div className="post-job-form-group">
                <label className="post-job-label">Hiring Organization / Company Name *</label>
                <div className="post-job-input-wrapper">
                  <input
                    type="text"
                    name="companyName"
                    placeholder="e.g. Acme Innovations Corp"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="post-job-actions">
              <Link to="/employer" className="btn btn-secondary pill-btn" style={{ padding: '1rem 2rem', background: '#F8FAFC', borderColor: '#E2E8F0', color: '#0F172A' }}>
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary pill-btn" style={{ padding: '1rem 2.5rem' }} disabled={loading}>
                <Briefcase size={18} style={{ marginRight: '8px' }} />
                <span>{loading ? (isEditMode ? 'Updating...' : 'Publishing Vacancy...') : (isEditMode ? 'Update Job Vacancy' : 'Publish Job Vacancy')}</span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default PostJob;
