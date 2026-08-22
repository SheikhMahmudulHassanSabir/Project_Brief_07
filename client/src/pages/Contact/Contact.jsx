import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 800);
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <section
        style={{
          background: 'linear-gradient(180deg, var(--bg-surface-subtle) 0%, var(--bg-app) 100%)',
          padding: '4rem 0 3rem',
          textAlign: 'center',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container" style={{ maxWidth: '700px' }}>
          <div className="badge badge-primary" style={{ marginBottom: '1rem', padding: '0.45rem 1.1rem' }}>
            Get In Touch
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            We'd Love to Hear From You
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Have questions about employer solutions, candidate accounts, or enterprise features? Our dedicated team is ready to assist.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '3rem', alignItems: 'flex-start' }} className="responsive-contact-grid">
          {/* Contact Details Card */}
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Contact Information
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
              Reach out to our customer success and platform operations team directly through any of the channels below.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1.5px solid var(--border-default)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={20} color="var(--palette-accent)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Email Us</div>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>support@jobportal.com</div>
                </div>
              </div>

              <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1.5px solid var(--border-default)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={20} color="var(--palette-accent)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Call Us</div>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>+1 (800) 555-JOBS</div>
                </div>
              </div>

              <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1.5px solid var(--border-default)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={20} color="var(--palette-accent)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Global Headquarters</div>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>100 Tech Plaza, San Francisco, CA</div>
                </div>
              </div>
            </div>
          </div>

          {/* Message Form Card */}
          <div className="card" style={{ padding: '2.5rem', border: '1.5px solid var(--border-default)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
              <MessageSquare size={22} color="var(--palette-accent)" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                Send Us a Message
              </h2>
            </div>

            {submitted && (
              <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
                <CheckCircle2 size={18} />
                <span>Thank you! Your message has been received. Our team will get back to you shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Your Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Michael Vance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="michael@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Question regarding enterprise employer posting"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Message *</label>
                <textarea
                  rows="4"
                  className="form-textarea"
                  placeholder="How can we assist you today? Provide details here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '0.5rem' }} disabled={loading}>
                <Send size={16} />
                <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .responsive-contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Contact;
