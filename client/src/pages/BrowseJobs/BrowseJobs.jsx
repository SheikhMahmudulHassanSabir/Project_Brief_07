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
  Bookmark,
  Calendar,
  ArrowRight
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
    <div className="page-wrapper browse-jobs-wrapper">
      {/* Decorative Hero Area */}
      <section className="page-header browse-jobs-header">
        <div className="hero-decoration right-circle"></div>
        <div className="hero-decoration left-circle"></div>
        <div className="container hero-container">
          <div className="hero-badge">
            Find Your Next Opportunity
          </div>
          <h1>
            Explore <span className="text-primary">Open Vacancies</span>
          </h1>
          <p className="hero-subtitle">
            Showing <strong>{jobs.length}</strong> available position{jobs.length === 1 ? '' : 's'} across verified employers
          </p>
        </div>
      </section>

      <div className="container main-content-container">
        {/* Alert Feedback */}
        {alertMsg.text && (
          <div className={`alert ${alertMsg.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {alertMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{alertMsg.text}</span>
          </div>
        )}

        {/* Filters Toolbar */}
        <div className="search-filter-wrapper">
          <form
            onSubmit={handleFilterSubmit}
            className="search-filter-container"
          >
            <div className="search-input-wrapper search-main">
              <Search size={20} className="icon-muted" />
              <input
                type="text"
                placeholder="Search title, skills, keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="search-input-wrapper search-location">
              <MapPin size={20} className="icon-muted" />
              <input
                type="text"
                placeholder="Location (e.g. Remote, New York)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="search-input-wrapper select-wrapper search-category">
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
              <button type="submit" className="btn-filter">
                Filter
              </button>

              {(search || category !== 'All' || location) && (
                <button type="button" onClick={handleClearFilters} className="btn-clear-filter" aria-label="Clear filters" title="Clear filters">
                  <X size={18} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Job Listings Grid */}
        {loading ? (
          <div className="jobs-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="job-card-premium skeleton-card">
                <div className="skeleton" style={{ height: '24px', width: '30%', marginBottom: '1.5rem', borderRadius: '12px' }} />
                <div className="skeleton" style={{ height: '20px', width: '40%', marginBottom: '0.75rem' }} />
                <div className="skeleton" style={{ height: '32px', width: '80%', marginBottom: '1.5rem' }} />
                <div className="skeleton" style={{ height: '30px', width: '60%', marginBottom: '2rem' }} />
                <div className="skeleton" style={{ height: '40px', width: '100%', borderRadius: '20px' }} />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-state-icon">
              <Search size={26} color="var(--color-primary)" />
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
          <div className="jobs-grid">
            {jobs.map((job, index) => {
              const isApplied = appliedJobIds.has(job._id);
              
              // Determine pastel theme based on index
              const colorClasses = ['theme-peach', 'theme-mint', 'theme-lavender', 'theme-blue', 'theme-pink', 'theme-gray'];
              const cardTheme = colorClasses[index % colorClasses.length];

              // Determine posting date string
              const dateObj = new Date(job.createdAt);
              const dateString = isNaN(dateObj.getTime()) 
                ? 'Recent' 
                : dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

              return (
                <div key={job._id} className={`job-card-premium ${cardTheme}`}>
                  {/* Top Row: Date & Bookmark */}
                  <div className="job-card-top">
                    <div className="job-date-badge">
                      <Calendar size={14} className="icon-blue" />
                      <span>{dateString}</span>
                    </div>
                    <button className="job-bookmark-btn" aria-label="Bookmark job">
                      <Bookmark size={18} />
                    </button>
                  </div>

                  {/* Title & Employer area */}
                  <div className="job-card-body">
                    <div className="job-company-info">
                      <span className="job-company-name">{job.companyName}</span>
                    </div>
                    
                    <div className="job-title-row">
                      <Link to={`/jobs/${job._id}`} className="job-title-link">
                        <h2 className="job-title">{job.title}</h2>
                      </Link>
                      
                      {/* Employer Logo Fallback */}
                      <div className="job-company-logo">
                        <Building2 size={24} className="icon-blue" />
                      </div>
                    </div>

                    {/* Job Tags */}
                    <div className="job-tags">
                      <span className="job-tag">{job.category}</span>
                      {job.requirements && job.requirements.slice(0, 2).map((req, idx) => (
                        <span key={idx} className="job-tag">{req}</span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Area */}
                  <div className="job-card-footer">
                    <div className="job-footer-left">
                      <div className="job-salary">
                        {job.salaryRange || 'Competitive'}
                      </div>
                      <div className="job-location">
                        <MapPin size={14} />
                        <span>{job.location}</span>
                      </div>
                    </div>
                    
                    <div className="job-footer-right">
                      {isApplied ? (
                        <button disabled className="btn-applied-pill">
                          Applied <CheckCircle2 size={16} />
                        </button>
                      ) : (
                        <>
                          <Link to={`/jobs/${job._id}`} className="btn-details-pill">
                            Details <ArrowRight size={16} />
                          </Link>
                          {/* We keep Apply functionality available directly on card, but more compact */}
                          {applyingId === job._id ? (
                            <button disabled className="btn-apply-pill applying">...</button>
                          ) : (
                            <button onClick={() => handleApply(job._id)} className="btn-apply-pill">Apply</button>
                          )}
                        </>
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
