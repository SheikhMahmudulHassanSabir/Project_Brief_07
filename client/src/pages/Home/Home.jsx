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
  Sparkles,
  MapPin,
  Building2,
  Clock,
} from 'lucide-react';
import axios from 'axios';

function Home() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/jobs`);
      setFeaturedJobs(res.data.slice(0, 6));
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
    { name: 'Engineering', icon: <Code2 size={28} color="var(--palette-accent)" />, count: '1.2k+ jobs' },
    { name: 'Design', icon: <Palette size={28} color="var(--palette-accent)" />, count: '480+ jobs' },
    { name: 'Marketing', icon: <TrendingUp size={28} color="var(--palette-accent)" />, count: '320+ jobs' },
    { name: 'Product', icon: <Boxes size={28} color="var(--palette-accent)" />, count: '210+ jobs' },
    { name: 'Finance', icon: <DollarSign size={28} color="var(--palette-accent)" />, count: '190+ jobs' },
    { name: 'Sales', icon: <Briefcase size={28} color="var(--palette-accent)" />, count: '340+ jobs' },
  ];

  return (
    <div className="page-wrapper">
      {/* 1. Hero Section */}
      <section
        style={{
          background: 'linear-gradient(180deg, var(--bg-surface-subtle) 0%, var(--bg-app) 100%)',
          padding: '4.5rem 0 3.5rem',
          textAlign: 'center',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container" style={{ maxWidth: '900px' }}>
          <div
            className="badge badge-primary"
            style={{
              marginBottom: '1.25rem',
              padding: '0.45rem 1.1rem',
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={14} color="var(--palette-accent)" />
            <span>Fast & Reliable Recruitment Platform</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.75rem)',
              fontWeight: '800',
              lineHeight: '1.15',
              marginBottom: '1.25rem',
              letterSpacing: '-0.03em',
            }}
          >
            Find Your Next Breakthrough or <span className="text-gradient">Hire Top Talent</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'var(--text-secondary)',
              maxWidth: '680px',
              margin: '0 auto 2.5rem',
              lineHeight: '1.6',
            }}
          >
            Discover thousands of curated tech, creative, and executive positions. One centralized ecosystem for seamless candidate tracking and recruitment.
          </p>

          {/* Hero Search Box */}
          <form
            onSubmit={handleHeroSearch}
            className="card"
            style={{
              display: 'flex',
              gap: '0.75rem',
              padding: '0.75rem',
              flexWrap: 'wrap',
              boxShadow: 'var(--shadow-xl)',
              borderRadius: 'var(--radius-xl)',
              border: '2px solid var(--border-default)',
            }}
          >
            <div style={{ flex: '2', minWidth: '220px', display: 'flex', alignItems: 'center', gap: '0.65rem', paddingLeft: '0.75rem' }}>
              <Search size={18} color="var(--palette-accent)" />
              <input
                type="text"
                placeholder="Job title, skills, or company..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  width: '100%',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                }}
              />
            </div>

            <div style={{ flex: '1.2', minWidth: '160px', borderLeft: '1px solid var(--border-default)', paddingLeft: '0.75rem' }}>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  width: '100%',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  padding: '0.5rem 0',
                }}
              >
                <option value="">All Categories</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Product">Product</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-lg)' }}>
              <Search size={18} />
              <span>Search Vacancies</span>
            </button>
          </form>

          {/* Popular Search Tags */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Popular:</span>
            {['React', 'Node.js', 'UI/UX Design', 'Product Manager', 'Remote'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setKeyword(tag);
                  navigate(`/jobs?search=${encodeURIComponent(tag)}`);
                }}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '4px 12px',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Metrics Banner */}
      <section style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
        <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--palette-accent)' }}>10,000+</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Active Job Openings</div>
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--palette-accent)' }}>1,500+</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Verified Employers</div>
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--palette-accent)' }}>98%</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Hiring Success Rate</div>
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--palette-accent)' }}>&lt; 24 hrs</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Average Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Explore Categories */}
      <section className="page-section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ marginBottom: '0.35rem' }}>Explore by Industry</h2>
              <p>Find specialized vacancies across rapidly growing sectors</p>
            </div>
            <Link to="/jobs" className="btn btn-sm btn-outline">
              <span>View All Categories</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="card card-interactive"
                onClick={() => navigate(`/jobs?category=${cat.name}`)}
                style={{ padding: '1.5rem', cursor: 'pointer', textAlign: 'center' }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>{cat.icon}</div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.25rem' }}>{cat.name}</h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--palette-accent)', fontWeight: '600' }}>{cat.count}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Job Openings */}
      <section className="page-section" style={{ background: 'var(--bg-surface-subtle)', borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ marginBottom: '0.35rem' }}>Featured Opportunities</h2>
              <p>Hand-picked openings from verified hiring companies</p>
            </div>
            <Link to="/jobs" className="btn btn-primary">
              <span>Browse All Jobs</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {[1, 2, 3].map((n) => (
                <div key={n} className="card" style={{ height: '220px', padding: '1.5rem' }}>
                  <div className="skeleton" style={{ height: '20px', width: '40%', marginBottom: '1rem' }} />
                  <div className="skeleton" style={{ height: '28px', width: '75%', marginBottom: '1rem' }} />
                  <div className="skeleton" style={{ height: '16px', width: '50%', marginBottom: '1.5rem' }} />
                  <div className="skeleton" style={{ height: '36px', width: '100%' }} />
                </div>
              ))}
            </div>
          ) : featuredJobs.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ marginBottom: '1rem' }}>No job listings published yet.</p>
              <Link to="/employer" className="btn btn-primary">
                Post First Job Listing
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {featuredJobs.map((job) => (
                <div key={job._id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span className="badge badge-primary">{job.category}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.35rem' }}>{job.title}</h3>
                    <div style={{ color: 'var(--palette-accent)', fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Building2 size={15} />
                      <span>{job.companyName}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
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
                        fontSize: '0.88rem',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.5',
                        marginBottom: '1.5rem',
                        flex: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {job.description}
                    </p>

                    <Link to={`/jobs/${job._id}`} className="btn btn-outline" style={{ width: '100%', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <span>View Details & Apply</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Dual Value Proposition */}
      <section className="page-section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>Built for the Modern Workforce</h2>
            <p>Everything candidates and employers need for faster, transparent hiring.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* For Candidates */}
            <div className="card" style={{ padding: '2.5rem', borderLeft: '5px solid var(--palette-accent)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-50)', color: 'var(--palette-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Users size={24} color="var(--palette-accent)" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.75rem' }}>For Job Seekers</h3>
              <p style={{ marginBottom: '1.5rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                Build your professional portfolio, explore remote and on-site openings, and track your submitted applications with real-time status updates.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--success-text)" />
                  <span>Direct application submission without third-party forms</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--success-text)" />
                  <span>Real-time status notifications (Pending, Shortlisted)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--success-text)" />
                  <span>One-click application management & withdrawal</span>
                </li>
              </ul>
              <Link to="/register" className="btn btn-primary">
                Create Candidate Account
              </Link>
            </div>

            {/* For Employers */}
            <div className="card" style={{ padding: '2.5rem', borderLeft: '5px solid var(--palette-neutral)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-surface-subtle)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', border: '1px solid var(--border-default)' }}>
                <Building2 size={24} color="var(--text-primary)" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.75rem' }}>For Employers & Recruiters</h3>
              <p style={{ marginBottom: '1.5rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                Post vacancies in minutes, review incoming candidate resumes, and manage your talent pipeline with dedicated applicant management workflows.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--palette-accent)" />
                  <span>Instant vacancy publication with skill & salary targeting</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--palette-accent)" />
                  <span>Centralized candidate review with one-click status controls</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="var(--palette-accent)" />
                  <span>Company profile branding & recruitment analytics</span>
                </li>
              </ul>
              <Link to="/register" className="btn btn-secondary">
                Register as Employer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call To Action Banner */}
      <section
        style={{
          background: 'var(--primary-gradient)',
          color: '#FFFFFF',
          padding: '4.5rem 0',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ color: '#FFFFFF', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: '800', marginBottom: '1rem' }}>
            Ready to Take the Next Step?
          </h2>
          <p style={{ color: 'var(--palette-light)', fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
            Join thousands of professionals and companies already transforming recruitment with JobPortal.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/register"
              className="btn btn-lg"
              style={{ background: '#FFFFFF', color: '#171717', fontWeight: '700' }}
            >
              Get Started Now — It's Free
            </Link>
            <Link
              to="/jobs"
              className="btn btn-lg"
              style={{ background: 'transparent', color: '#FFFFFF', border: '2px solid rgba(255,255,255,0.6)' }}
            >
              Explore All Openings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
