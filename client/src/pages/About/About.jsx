import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  Users,
  Building2,
  Award,
  Globe,
} from 'lucide-react';

function About() {
  return (
    <div className="page-wrapper">
      {/* Hero Header */}
      <section
        style={{
          background: 'linear-gradient(180deg, var(--bg-surface-subtle) 0%, var(--bg-app) 100%)',
          padding: '4.5rem 0 3.5rem',
          textAlign: 'center',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          <div
            className="badge badge-primary"
            style={{ marginBottom: '1.25rem', padding: '0.45rem 1.1rem' }}
          >
            About JobPortal
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
              fontWeight: '800',
              lineHeight: '1.2',
              marginBottom: '1.25rem',
              color: 'var(--text-primary)',
            }}
          >
            Empowering Careers & Accelerating Global Recruitment
          </h1>
          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
            }}
          >
            JobPortal is an enterprise-grade recruitment platform designed to eliminate friction in modern hiring. We bridge the gap between world-class companies and talented professionals across engineering, design, and leadership.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="page-section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ padding: '2.5rem', borderLeft: '5px solid var(--palette-accent)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Zap size={24} color="var(--palette-accent)" />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Our Mission</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                To empower job seekers with direct, transparent access to top employers while equipping hiring managers with streamlined candidate review tools and real-time communication pipelines.
              </p>
            </div>

            <div className="card" style={{ padding: '2.5rem', borderLeft: '5px solid var(--palette-neutral)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-surface-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', border: '1px solid var(--border-default)' }}>
                <Globe size={24} color="var(--text-primary)" />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Our Vision</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                To become the most trustworthy, accessible, and high-performance talent ecosystem on the web, where every individual discovers work that fuels their potential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values & Platform Pillars */}
      <section className="page-section" style={{ background: 'var(--bg-surface-subtle)', borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem' }}>
            <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Why Professionals Trust JobPortal</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Built on speed, security, and a relentless focus on usability.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <ShieldCheck size={28} color="var(--palette-accent)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Verified Employers</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Every hiring account is authenticated with company email and profile verification to ensure a safe, legitimate job-hunting environment.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <Users size={28} color="var(--palette-accent)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Direct Applications</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                No endless redirects or third-party survey forms. Apply with your unified portal profile in a single click.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <Award size={28} color="var(--palette-accent)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Real-Time Status</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Know exactly where you stand. Watch applications change from Under Review to Shortlisted in your personal workspace.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <Building2 size={28} color="var(--palette-accent)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Employer Workspaces</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Recruiters get dedicated applicant tracking dashboards with candidate filtration, notes, and one-click status transitions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section style={{ background: 'var(--primary-gradient)', color: '#FFFFFF', padding: '4.5rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ color: '#FFFFFF', fontSize: '2.25rem', fontWeight: '800', marginBottom: '1rem' }}>
            Start Your Journey Today
          </h2>
          <p style={{ color: 'var(--palette-light)', fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
            Join thousands of active job seekers and world-class employers on JobPortal.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-lg" style={{ background: '#FFFFFF', color: '#171717', fontWeight: '700' }}>
              Create Your Free Account
            </Link>
            <Link to="/jobs" className="btn btn-lg btn-outline" style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.5)' }}>
              Browse Vacancies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
