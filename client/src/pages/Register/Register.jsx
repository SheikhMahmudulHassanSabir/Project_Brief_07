import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Building2, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import axios from 'axios';
import '../Auth.css';

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState('job-seeker');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    headline: '',
    skills: '',
    experienceLevel: 'Entry-Level',
    companyName: '',
    companyWebsite: '',
    industry: 'Technology',
    companySize: '1-10',
    location: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (role === 'employer' && !formData.companyName.trim()) {
      setErrorMsg('Company Name is required for employer registration.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role,
        location: formData.location,
        ...(role === 'job-seeker'
          ? {
              headline: formData.headline,
              skills: formData.skills,
              experienceLevel: formData.experienceLevel,
            }
          : {
              companyName: formData.companyName,
              companyWebsite: formData.companyWebsite,
              industry: formData.industry,
              companySize: formData.companySize,
            }),
      };

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${API_URL}/auth/register`, payload);

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        setSuccessMsg('Account created successfully! Redirecting...');

        setTimeout(() => {
          if (response.data.role === 'employer') {
            navigate('/employer');
          } else {
            navigate('/jobs');
          }
        }, 1200);
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || 'Registration failed. Please check your details and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h1>Create an Account</h1>
          <p>Choose your account type to get started</p>
        </div>

        {/* Role Toggle */}
        <div className="auth-role-tabs" role="tablist">
          <button
            type="button"
            className={`auth-role-tab ${role === 'job-seeker' ? 'active' : ''}`}
            onClick={() => handleRoleChange('job-seeker')}
          >
            <User size={18} />
            <span>Job Seeker</span>
          </button>
          <button
            type="button"
            className={`auth-role-tab ${role === 'employer' ? 'active' : ''}`}
            onClick={() => handleRoleChange('employer')}
          >
            <Building2 size={18} />
            <span>Employer / Company</span>
          </button>
        </div>

        {errorMsg && (
          <div className="auth-alert error">
            <AlertCircle size={20} />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="auth-alert success">
            <CheckCircle2 size={20} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label className="auth-form-label">
              {role === 'employer' ? 'Contact Person / Recruiter Name' : 'Full Name'} *
            </label>
            <div className="auth-input-wrapper">
              <input
                type="text"
                name="name"
                placeholder={role === 'employer' ? 'e.g. Sarah Jenkins' : 'e.g. Alex Morgan'}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-form-label">Work / Personal Email Address *</label>
            <div className="auth-input-wrapper">
              <input
                type="email"
                name="email"
                placeholder={role === 'employer' ? 'recruiter@company.com' : 'alex@example.com'}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="auth-form-grid">
            <div className="auth-form-group">
              <label className="auth-form-label">Password *</label>
              <div className="auth-input-wrapper">
                <input
                  type="password"
                  name="password"
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="auth-form-group">
              <label className="auth-form-label">Confirm Password *</label>
              <div className="auth-input-wrapper">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Conditional Job Seeker fields */}
          {role === 'job-seeker' && (
            <>
              <div className="auth-form-group">
                <label className="auth-form-label">Professional Headline</label>
                <div className="auth-input-wrapper">
                  <input
                    type="text"
                    name="headline"
                    placeholder="e.g. Senior Frontend Engineer | React & TypeScript"
                    value={formData.headline}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="auth-form-grid">
                <div className="auth-form-group">
                  <label className="auth-form-label">Primary Skills (comma separated)</label>
                  <div className="auth-input-wrapper">
                    <input
                      type="text"
                      name="skills"
                      placeholder="React, Node.js, UI/UX"
                      value={formData.skills}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="auth-form-group">
                  <label className="auth-form-label">Experience Level</label>
                  <div className="auth-input-wrapper">
                    <select
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleChange}
                    >
                      <option value="Entry-Level">Entry-Level (0-2 yrs)</option>
                      <option value="Mid-Level">Mid-Level (2-5 yrs)</option>
                      <option value="Senior">Senior (5-8 yrs)</option>
                      <option value="Lead/Director">Lead / Director (8+ yrs)</option>
                    </select>
                    <div className="auth-select-arrow" />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Conditional Employer fields */}
          {role === 'employer' && (
            <>
              <div className="auth-form-group">
                <label className="auth-form-label">Company Name *</label>
                <div className="auth-input-wrapper">
                  <input
                    type="text"
                    name="companyName"
                    placeholder="e.g. Acme Tech Innovations"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="auth-form-grid">
                <div className="auth-form-group">
                  <label className="auth-form-label">Industry</label>
                  <div className="auth-input-wrapper">
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                    >
                      <option value="Technology">Technology & Software</option>
                      <option value="Finance">Finance & Banking</option>
                      <option value="Healthcare">Healthcare & Medicine</option>
                      <option value="Education">Education & E-learning</option>
                      <option value="Design">Design & Creative</option>
                      <option value="Marketing">Marketing & Growth</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="auth-select-arrow" />
                  </div>
                </div>
                <div className="auth-form-group">
                  <label className="auth-form-label">Company Size</label>
                  <div className="auth-input-wrapper">
                    <select
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleChange}
                    >
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="500+">500+ employees</option>
                    </select>
                    <div className="auth-select-arrow" />
                  </div>
                </div>
              </div>

              <div className="auth-form-group">
                <label className="auth-form-label">Company Website</label>
                <div className="auth-input-wrapper">
                  <input
                    type="url"
                    name="companyWebsite"
                    placeholder="https://example.com"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </>
          )}

          <div className="auth-form-group">
            <label className="auth-form-label">Location (City, Country)</label>
            <div className="auth-input-wrapper">
              <input
                type="text"
                name="location"
                placeholder="e.g. San Francisco, USA or Remote"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
            <span>{loading ? 'Creating Account...' : `Register as ${role === 'employer' ? 'Employer' : 'Job Seeker'}`}</span>
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="auth-footer-link">
          Already have an account?
          <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
