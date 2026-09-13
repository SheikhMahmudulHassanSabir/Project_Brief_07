import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Code2,
  Palette,
  TrendingUp,
  Boxes,
  DollarSign,
  Briefcase,
  Users,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Building2,
  Clock,
} from 'lucide-react';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  async function fetchFeaturedJobs() {
    try {
      setLoading(true);
      const allJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
      setFeaturedJobs(allJobs.slice(0, 6));
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (keyword.trim()) queryParams.set('search', keyword.trim());
    if (category) queryParams.set('category', category);
    navigate(`/jobs?${queryParams.toString()}`);
  };

  const categories = [
    { name: 'Engineering', icon: <Code2 size={28} />, count: '1.2k+ jobs' },
    { name: 'Design', icon: <Palette size={28} />, count: '480+ jobs' },
    { name: 'Marketing', icon: <TrendingUp size={28} />, count: '320+ jobs' },
    { name: 'Product', icon: <Boxes size={28} />, count: '210+ jobs' },
    { name: 'Finance', icon: <DollarSign size={28} />, count: '190+ jobs' },
    { name: 'Sales', icon: <Briefcase size={28} />, count: '340+ jobs' },
  ];

  return (
    <div className="page-wrapper home-page-wrapper">
      {/* 1. Hero Section */}
      <section className="home-hero">
        <div className="container" style={{ maxWidth: '900px' }}>
          <h1>
            Find Your Next Breakthrough or <span className="text-gradient">Hire Top Talent</span>
          </h1>

          <p>
            Discover thousands of curated tech, creative, and executive positions. One centralized ecosystem for seamless candidate tracking and recruitment.
          </p>

          {/* Hero Search Box */}
          <form onSubmit={handleHeroSearch} className="ref-search-form">
            <div className="ref-search-input-wrapper">
              <Search size={22} className="ref-search-icon" />
              <input
                type="text"
                placeholder="Job title, Salary, or Companies..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="ref-search-input"
                aria-label="Search jobs"
              />
            </div>
            <button type="submit" className="ref-search-btn">
              Explore Now
            </button>
          </form>

          {/* Popular Search Tags */}
          <div className="ref-popular-categories">
            <span className="ref-popular-label">Popular Categories:</span>
            {['UX Designer', 'Front-end Dev', 'Back-end Dev', 'Product Manager'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setKeyword(tag);
                  navigate(`/jobs?search=${encodeURIComponent(tag)}`);
                }}
                className="ref-category-link"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Metrics Banner */}
      <section className="home-metrics-section">
        <div className="container">
          <div className="home-metrics-grid">
            <div>
              <div className="home-metric-number">10,000+</div>
              <div className="home-metric-label">Active Job Openings</div>
            </div>
            <div>
              <div className="home-metric-number">1,500+</div>
              <div className="home-metric-label">Verified Employers</div>
            </div>
            <div>
              <div className="home-metric-number">98%</div>
              <div className="home-metric-label">Hiring Success Rate</div>
            </div>
            <div>
              <div className="home-metric-number">&lt; 24 hrs</div>
              <div className="home-metric-label">Average Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Explore Categories */}
      <section className="home-categories-section">
        <div className="container">
          <div className="home-section-header">
            <div className="home-section-title">
              <h2>Explore by Industry</h2>
              <p>Find specialized vacancies across rapidly growing sectors</p>
            </div>
            <Link to="/jobs" className="btn btn-secondary" style={{ borderRadius: '9999px', padding: '0.8rem 1.5rem', background: '#ffffff' }}>
              <span>View All Categories</span>
              <ArrowRight size={14} style={{ marginLeft: '6px' }} />
            </Link>
          </div>

          <div className="home-categories-grid">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="home-category-card"
                onClick={() => navigate(`/jobs?category=${cat.name}`)}
              >
                <div className="home-category-icon">{cat.icon}</div>
                <h3>{cat.name}</h3>
                <div className="count">{cat.count}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Job Openings */}
      <section className="home-jobs-section">
        <div className="container">
          <div className="home-section-header">
            <div className="home-section-title">
              <h2>Featured Opportunities</h2>
              <p>Hand-picked openings from verified hiring companies</p>
            </div>
            <Link to="/jobs" className="btn btn-primary" style={{ borderRadius: '9999px', padding: '0.8rem 1.5rem' }}>
              <span>Browse All Jobs</span>
              <ArrowRight size={16} style={{ marginLeft: '6px' }} />
            </Link>
          </div>

          {loading ? (
            <div className="home-jobs-grid">
              {[1, 2, 3].map((n) => (
                <div key={n} className="card" style={{ height: '220px', padding: '1.5rem', borderRadius: '32px' }}>
                  <div className="skeleton" style={{ height: '20px', width: '40%', marginBottom: '1rem' }} />
                  <div className="skeleton" style={{ height: '28px', width: '75%', marginBottom: '1rem' }} />
                  <div className="skeleton" style={{ height: '16px', width: '50%', marginBottom: '1.5rem' }} />
                  <div className="skeleton" style={{ height: '36px', width: '100%' }} />
                </div>
              ))}
            </div>
          ) : featuredJobs.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', borderRadius: '32px' }}>
              <p style={{ marginBottom: '1rem' }}>No job listings published yet.</p>
              <Link to="/employer" className="btn btn-primary" style={{ borderRadius: '9999px' }}>
                Post First Job Listing
              </Link>
            </div>
          ) : (
            <div className="home-jobs-grid">
              {featuredJobs.map((job) => (
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
                      <span>View Details & Apply</span>
                      <ArrowRight size={16} style={{ marginLeft: '6px' }} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Dual Value Proposition */}
      <section className="home-values-section">
        <div className="container">
          <div className="home-section-header" style={{ marginBottom: '3rem', textAlign: 'center', maxWidth: '650px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--home-navy)', marginBottom: '1rem' }}>Built for the Modern Workforce</h2>
            <p style={{ color: 'var(--home-secondary-text)', fontSize: '1.1rem' }}>Everything candidates and employers need for faster, transparent hiring.</p>
          </div>

          <div className="home-values-grid">
            {/* For Candidates */}
            <div className="home-value-card">
              <div className="home-value-icon">
                <Users size={28} />
              </div>
              <h3>For Job Seekers</h3>
              <p>
                Build your professional portfolio, explore remote and on-site openings, and track your submitted applications with real-time status updates.
              </p>
              <ul className="home-value-list">
                <li>
                  <CheckCircle2 size={18} color="var(--success-text)" />
                  <span>Direct application submission without third-party forms</span>
                </li>
                <li>
                  <CheckCircle2 size={18} color="var(--success-text)" />
                  <span>Real-time status notifications (Pending, Shortlisted)</span>
                </li>
                <li>
                  <CheckCircle2 size={18} color="var(--success-text)" />
                  <span>One-click application management & withdrawal</span>
                </li>
              </ul>
              <Link to="/register" className="btn btn-primary" style={{ borderRadius: '9999px', padding: '1rem 1.5rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
                Create Candidate Account
              </Link>
            </div>

            {/* For Employers */}
            <div className="home-value-card">
              <div className="home-value-icon">
                <Building2 size={28} />
              </div>
              <h3>For Employers & Recruiters</h3>
              <p>
                Post vacancies in minutes, review incoming candidate resumes, and manage your talent pipeline with dedicated applicant management workflows.
              </p>
              <ul className="home-value-list">
                <li>
                  <CheckCircle2 size={18} color="var(--home-primary)" />
                  <span>Instant vacancy publication with skill & salary targeting</span>
                </li>
                <li>
                  <CheckCircle2 size={18} color="var(--home-primary)" />
                  <span>Centralized candidate review with one-click status controls</span>
                </li>
                <li>
                  <CheckCircle2 size={18} color="var(--home-primary)" />
                  <span>Company profile branding & recruitment analytics</span>
                </li>
              </ul>
              <Link to="/register" className="btn btn-secondary" style={{ borderRadius: '9999px', padding: '1rem 1.5rem', width: '100%', display: 'flex', justifyContent: 'center', background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>
                Register as Employer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call To Action Banner */}
      <section className="home-cta-footer">
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2>Ready to Take the Next Step?</h2>
          <p>
            Join thousands of professionals and companies already transforming recruitment with JobPortal.
          </p>
          <div className="home-cta-actions">
            <Link to="/register" className="btn btn-primary">
              Get Started Now — It's Free
            </Link>
            <Link to="/jobs" className="btn btn-secondary">
              Explore All Openings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
