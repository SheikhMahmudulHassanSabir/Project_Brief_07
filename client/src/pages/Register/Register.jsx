import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Building2, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import './Register.css';

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
    <div className="container" style={{ padding: '3.5rem 1rem', display: 'flex', justifyContent: 'center' }}>
      <div className="register-card" style={{ width: '100%', maxWidth: '580px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>Create an Account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Choose your account type to get started
          </p>
        </div>

        {/* Role Toggle */}
        <div className="role-tab-group" role="tablist">
          <button
            type="button"
            className={`role-tab ${role === 'job-seeker' ? 'active' : ''}`}
            onClick={() => handleRoleChange('job-seeker')}
          >
            <User size={16} />
            <span>Job Seeker</span>
          </button>
          <button
            type="button"
            className={`role-tab ${role === 'employer' ? 'active' : ''}`}
            onClick={() => handleRoleChange('employer')}
          >
            <Building2 size={16} />
            <span>Employer / Company</span>
          </button>
        </div>

        {errorMsg && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              {role === 'employer' ? 'Contact Person / Recruiter Name' : 'Full Name'} *
            </label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder={role === 'employer' ? 'e.g. Sarah Jenkins' : 'e.g. Alex Morgan'}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Work / Personal Email Address *</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder={role === 'employer' ? 'recruiter@company.com' : 'alex@example.com'}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Password *</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Conditional Job Seeker fields */}
          {role === 'job-seeker' && (
            <>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Professional Headline</label>
                <input
                  type="text"
                  name="headline"
                  className="form-input"
                  placeholder="e.g. Senior Frontend Engineer | React & TypeScript"
                  value={formData.headline}
                  onChange={handleChange}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Primary Skills (comma separated)</label>
                  <input
                    type="text"
                    name="skills"
                    className="form-input"
                    placeholder="React, Node.js, UI/UX"
                    value={formData.skills}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Experience Level</label>
                  <select
                    name="experienceLevel"
                    className="form-select"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                  >
                    <option value="Entry-Level">Entry-Level (0-2 yrs)</option>
                    <option value="Mid-Level">Mid-Level (2-5 yrs)</option>
                    <option value="Senior">Senior (5-8 yrs)</option>
                    <option value="Lead/Director">Lead / Director (8+ yrs)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Conditional Employer fields */}
          {role === 'employer' && (
            <>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  className="form-input"
                  placeholder="e.g. Acme Tech Innovations"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Industry</label>
                  <select
                    name="industry"
                    className="form-select"
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
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Company Size</label>
                  <select
                    name="companySize"
                    className="form-select"
                    value={formData.companySize}
                    onChange={handleChange}
                  >
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Company Website</label>
                <input
                  type="url"
                  name="companyWebsite"
                  className="form-input"
                  placeholder="https://example.com"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Location (City, Country)</label>
            <input
              type="text"
              name="location"
              className="form-input"
              placeholder="e.g. San Francisco, USA or Remote"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '0.75rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : `Register as ${role === 'employer' ? 'Employer' : 'Job Seeker'}`}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--palette-accent)', fontWeight: '600' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
