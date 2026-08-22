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
} from 'lucide-react';
import axios from 'axios';

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

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
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
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (location.trim()) params.location = location.trim();

      const res = await axios.get(`${API_URL}/jobs`, { params });
      setJobs(res.data);
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
      <section style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)', padding: '2.5rem 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
            Explore Open Vacancies
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
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
          className="card"
          style={{
            padding: '1.25rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) auto auto',
            gap: '1rem',
            alignItems: 'center',
            marginBottom: '2.5rem',
            border: '1.5px solid var(--border-default)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'var(--bg-app)', padding: '0 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <Search size={16} color="var(--palette-accent)" />
            <input
              type="text"
              placeholder="Search title, skills, keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', width: '100%', padding: '0.75rem 0', outline: 'none', color: 'var(--text-primary)', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'var(--bg-app)', padding: '0 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <MapPin size={16} color="var(--palette-accent)" />
            <input
              type="text"
              placeholder="Location (e.g. Remote, NY)..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ border: 'none', background: 'transparent', width: '100%', padding: '0.75rem 0', outline: 'none', color: 'var(--text-primary)', fontSize: '0.9rem' }}
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-select"
            style={{ margin: 0 }}
          >
            <option value="All">All Categories</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Product">Product</option>
            <option value="Sales">Sales</option>
            <option value="Finance">Finance</option>
          </select>

          <button type="submit" className="btn btn-primary">
            <Filter size={16} />
            <span>Filter</span>
          </button>

          {(search || category !== 'All' || location) && (
            <button type="button" onClick={handleClearFilters} className="btn btn-secondary">
              <RotateCcw size={15} />
              <span>Clear</span>
            </button>
          )}
        </form>

        {/* Job Listings Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
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
              <Search size={26} color="var(--palette-accent)" />
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {jobs.map((job) => {
              const isApplied = appliedJobIds.has(job._id);

              return (
                <div key={job._id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span className="badge badge-primary">{job.category}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <Link to={`/jobs/${job._id}`} style={{ textDecoration: 'none' }}>
                      <h2 style={{ fontSize: '1.3rem', fontWeight: '700', margin: '0 0 0.35rem 0', color: 'var(--text-primary)', transition: 'color var(--transition-fast)' }}>
                        {job.title}
                      </h2>
                    </Link>
                    <div style={{ color: 'var(--palette-accent)', fontWeight: '600', fontSize: '0.95rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Building2 size={16} />
                      <span>{job.companyName}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} color="var(--palette-accent)" />
                        {job.location}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <DollarSign size={14} color="var(--palette-accent)" />
                        {job.salaryRange || 'Competitive'}
                      </span>
                    </div>

                    <p
                      style={{
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        marginBottom: '1.25rem',
                        flex: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {job.description}
                    </p>

                    {job.requirements && job.requirements.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '1.5rem' }}>
                        {job.requirements.slice(0, 4).map((req, idx) => (
                          <span key={idx} className="badge badge-neutral">
                            {req}
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem' }}>
                      <Link
                        to={`/jobs/${job._id}`}
                        className="btn btn-secondary"
                        style={{ flex: 1 }}
                      >
                        Details
                      </Link>

                      {isApplied ? (
                        <button
                          disabled
                          className="btn btn-secondary"
                          style={{ flex: 1.5, color: 'var(--success-text)', background: 'var(--success-bg)', borderColor: 'var(--success-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                          <CheckCircle2 size={16} />
                          <span>Applied</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApply(job._id)}
                          disabled={applyingId === job._id}
                          className="btn btn-primary"
                          style={{ flex: 1.5 }}
                        >
                          {applyingId === job._id ? 'Applying...' : 'Apply Now'}
                        </button>
                      )}
                    </div>
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
