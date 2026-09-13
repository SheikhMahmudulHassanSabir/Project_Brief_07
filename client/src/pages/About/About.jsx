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
import './About.css';

function About() {
  return (
    <div className="page-wrapper about-page-wrapper">
      {/* Hero Header */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-badge">
            About JobPortal
          </div>
          <h1>
            Empowering Careers & Accelerating <span className="text-gradient">Global Recruitment</span>
          </h1>
          <p>
            JobPortal is an enterprise-grade recruitment platform designed to eliminate friction in modern hiring. We bridge the gap between world-class companies and talented professionals across engineering, design, and leadership.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="about-mission-vision-section">
        <div className="container">
          <div className="about-mission-grid">
            <div className="about-mission-card">
              <div className="about-icon-large">
                <Zap size={28} color="var(--about-primary)" />
              </div>
              <h2>Our Mission</h2>
              <p>
                To empower job seekers with direct, transparent access to top employers while equipping hiring managers with streamlined candidate review tools and real-time communication pipelines.
              </p>
            </div>

            <div className="about-mission-card">
              <div className="about-icon-large">
                <Globe size={28} color="var(--about-primary)" />
              </div>
              <h2>Our Vision</h2>
              <p>
                To become the most trustworthy, accessible, and high-performance talent ecosystem on the web, where every individual discovers work that fuels their potential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values & Platform Pillars */}
      <section className="about-values-section">
        <div className="container">
          <div className="about-section-header">
            <h2>Why Professionals Trust JobPortal</h2>
            <p>Built on speed, security, and a relentless focus on usability.</p>
          </div>

          <div className="about-values-grid">
            <div className="about-value-card">
              <ShieldCheck size={32} color="var(--about-primary)" style={{ marginBottom: '1rem' }} />
              <h3>Verified Employers</h3>
              <p>
                Every hiring account is authenticated with company email and profile verification to ensure a safe, legitimate job-hunting environment.
              </p>
            </div>

            <div className="about-value-card">
              <Users size={32} color="var(--about-primary)" style={{ marginBottom: '1rem' }} />
              <h3>Direct Applications</h3>
              <p>
                No endless redirects or third-party survey forms. Apply with your unified portal profile in a single click.
              </p>
            </div>

            <div className="about-value-card">
              <Award size={32} color="var(--about-primary)" style={{ marginBottom: '1rem' }} />
              <h3>Real-Time Status</h3>
              <p>
                Know exactly where you stand. Watch applications change from Under Review to Shortlisted in your personal workspace.
              </p>
            </div>

            <div className="about-value-card">
              <Building2 size={32} color="var(--about-primary)" style={{ marginBottom: '1rem' }} />
              <h3>Employer Workspaces</h3>
              <p>
                Recruiters get dedicated applicant tracking dashboards with candidate filtration, notes, and one-click status transitions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="about-cta-footer">
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2>Start Your Journey Today</h2>
          <p>
            Join thousands of active job seekers and world-class employers on JobPortal.
          </p>
          <div className="about-cta-actions">
            <Link to="/register" className="btn btn-primary">
              Create Your Free Account
            </Link>
            <Link to="/jobs" className="btn btn-secondary">
              Browse Vacancies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
