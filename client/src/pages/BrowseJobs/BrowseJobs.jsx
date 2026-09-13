import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  Building2,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Filter,
  RotateCcw,
  Clock,
  X,
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './BrowseJobs.css';

function BrowseJobs() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [applyingId, setApplyingId] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [alertMsg, setAlertMsg] = useState({ type: '', text: '' });

  const { user, token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchJobs();
    if (token && user?.role === 'job-seeker') {
      fetchMyApplications();
    }
  }, [category]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const allJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
      
      let filteredJobs = allJobs;
      if (search.trim()) {
        const lowerSearch = search.toLowerCase();
        filteredJobs = filteredJobs.filter(j => 
          j.title?.toLowerCase().includes(lowerSearch) || 
          j.companyName?.toLowerCase().includes(lowerSearch) || 
          j.description?.toLowerCase().includes(lowerSearch)
        );
      }
      if (category !== 'All') {
        filteredJobs = filteredJobs.filter(j => j.category === category);
      }
      if (location.trim()) {
        filteredJobs = filteredJobs.filter(j => j.location?.toLowerCase().includes(location.toLowerCase()));
      }
      setJobs(filteredJobs);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const res = await axios.get(`${API_URL}/applications/my-applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ids = new Set(res.data.map((app) => app.job?._id || app.job));
      setAppliedJobIds(ids);
    } catch (err) {
      console.error('Error fetching application status:', err);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (category !== 'All') params.category = category;
    if (location.trim()) params.location = location.trim();
    setSearchParams(params);
    fetchJobs();
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('All');
    setLocation('');
    setSearchParams({});
    fetchJobs();
  };

  const handleApply = async (jobId) => {
    if (!token || !user) {
      navigate('/login');
      return;
    }

    if (user.role === 'employer') {
      setAlertMsg({
        type: 'error',
        text: 'Employer accounts cannot apply for jobs. Please log in with a candidate account.',
      });
      return;
    }

    setApplyingId(jobId);
    setAlertMsg({ type: '', text: '' });

    try {
      await axios.post(
        `${API_URL}/applications`,
        { jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppliedJobIds((prev) => new Set([...prev, jobId]));
      setAlertMsg({
        type: 'success',
        text: 'Application submitted successfully! Track your status in the Candidate Portal.',
      });
    } catch (err) {
      setAlertMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit application.',
      });
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Header Banner */}
      <section className="page-header browse-jobs-header" style={{ background: 'transparent', padding: '4rem 1.5rem 2.5rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1>
            Explore Open <span className="text-gradient">Vacancies</span>
          </h1>
          <p>
            Showing <strong>{jobs.length}</strong> available position{jobs.length === 1 ? '' : 's'} across verified employers
          </p>
        </div>
      </section>

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        {/* Alert Feedback */}
        {alertMsg.text && (
          <div className={`alert ${alertMsg.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {alertMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{alertMsg.text}</span>
          </div>
        )}

        {/* Filters Toolbar */}
        <form
          onSubmit={handleFilterSubmit}
          className="search-filter-container"
        >
          <div className="search-input-wrapper">
            <Search size={18} color="#64748b" />
            <input
              type="text"
              placeholder="Search title, skills, keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="search-input-wrapper">
            <MapPin size={18} color="#64748b" />
            <input
              type="text"
              placeholder="Location (e.g. Remote, NY)..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="search-input-wrapper select-wrapper">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Product">Product</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          <div className="jobs-filter-actions">
            <button type="submit" className="btn btn-primary">
              <Filter size={18} color="#ffffff" />
              <span>Filter</span>
            </button>

            {(search || category !== 'All' || location) && (
              <button type="button" onClick={handleClearFilters} className="btn btn-secondary jobs-filter-clear" aria-label="Clear filters" title="Clear filters">
                <X size={18} color="var(--color-primary)" />
              </button>
            )}
          </div>
        </form>

        {/* Job Listings Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))', gap: '1.5rem' }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="card" style={{ padding: '1.75rem', height: '240px' }}>
                <div className="skeleton" style={{ height: '20px', width: '35%', marginBottom: '1rem' }} />
                <div className="skeleton" style={{ height: '28px', width: '80%', marginBottom: '0.5rem' }} />
                <div className="skeleton" style={{ height: '18px', width: '50%', marginBottom: '1.5rem' }} />
                <div className="skeleton" style={{ height: '40px', width: '100%' }} />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="card empty-state">
            <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'var(--bg-surface-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '1px solid var(--border-default)' }}>
              <Search size={26} color="var(--text-primary)" />
            </div>
            <h3 className="empty-state-title">No Jobs Found</h3>
            <p className="empty-state-desc">
              We couldn't find any vacancies matching your search filters. Try adjusting keywords or clearing category filters.
            </p>
            <button onClick={handleClearFilters} className="btn btn-primary">
              <RotateCcw size={16} />
              <span>Reset Filters</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))', gap: '1.5rem' }}>
            {jobs.map((job) => {
              const isApplied = appliedJobIds.has(job._id);

              return (
                <div key={job._id} className="premium-job-card">
                  <div className="job-card-header">
                    <span className="badge badge-primary">{job.category}</span>
                    <span className="job-posting-date">
                      <Clock size={14} />
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <Link to={`/jobs/${job._id}`} style={{ textDecoration: 'none' }}>
                    <h2 className="job-title">
                      {job.title}
                    </h2>
                  </Link>
                  
                  <div className="job-company">
                    <Building2 size={18} />
                    <span>{job.companyName}</span>
                  </div>

                  <div className="job-meta">
                    <span className="job-meta-item">
                      <MapPin size={16} />
                      {job.location}
                    </span>
                    <span className="job-meta-item">
                      <DollarSign size={16} />
                      {job.salaryRange || 'Competitive'}
                    </span>
                  </div>

                  <p className="job-desc">
                    {job.description}
                  </p>

                  {job.requirements && job.requirements.length > 0 && (
                    <div className="job-skills">
                      {job.requirements.slice(0, 4).map((req, idx) => (
                        <span key={idx} className="badge badge-neutral">
                          {req}
                        </span>
                      ))}
                    </div>
                  )}

                  <hr className="job-divider" />

                  <div className="job-actions">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="btn btn-secondary"
                    >
                      <span>Details</span>
                    </Link>

                    {isApplied ? (
                      <button
                        disabled
                        className="btn btn-secondary btn-applied"
                      >
                        <CheckCircle2 size={18} />
                        <span>Applied</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApply(job._id)}
                        disabled={applyingId === job._id}
                        className="btn btn-primary"
                      >
                        {applyingId === job._id ? 'Applying...' : 'Apply Now'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default BrowseJobs;
