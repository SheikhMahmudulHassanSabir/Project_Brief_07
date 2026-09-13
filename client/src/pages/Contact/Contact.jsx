import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import './Contact.css';

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
    <div className="page-wrapper contact-page-wrapper">
      {/* Header */}
      <section className="contact-hero">
        <div className="container">
          <div className="contact-hero-badge">
            Get In Touch
          </div>
          <h1>
            We'd Love to <span className="text-gradient">Hear From You</span>
          </h1>
          <p>
            Have questions about employer solutions, candidate accounts, or enterprise features? Our dedicated team is ready to assist.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="container" style={{ padding: '3.5rem 1.5rem', maxWidth: '1100px' }}>
        <div className="contact-grid">
          {/* Contact Details Column */}
          <div>
            <h2 className="contact-section-title">
              Contact Information
            </h2>
            <p className="contact-section-desc">
              Reach out to our customer success and platform operations team directly through any of the channels below.
            </p>

            <div>
              <div className="contact-item">
                <div className="contact-icon-container">
                  <Mail size={22} color="var(--contact-primary)" />
                </div>
                <div>
                  <div className="contact-item-label">Email Us</div>
                  <div className="contact-item-value interactive">support@jobportal.com</div>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon-container">
                  <Phone size={22} color="var(--contact-primary)" />
                </div>
                <div>
                  <div className="contact-item-label">Call Us</div>
                  <div className="contact-item-value interactive">+1 (800) 555-JOBS</div>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon-container">
                  <MapPin size={22} color="var(--contact-primary)" />
                </div>
                <div>
                  <div className="contact-item-label">Global Headquarters</div>
                  <div className="contact-item-value">100 Tech Plaza, San Francisco, CA</div>
                </div>
              </div>
            </div>
          </div>

          {/* Message Form Column */}
          <div className="contact-form-card">
            <div className="contact-form-header">
              <div className="contact-form-icon">
                <MessageSquare size={22} color="var(--contact-primary)" />
              </div>
              <h2>Send Us a Message</h2>
            </div>

            {submitted && (
              <div className="alert alert-success" style={{ marginBottom: '1.5rem', borderRadius: '12px' }}>
                <CheckCircle2 size={18} />
                <span>Thank you! Your message has been received. Our team will get back to you shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="contact-form-group">
                <label className="contact-form-label">Your Name *</label>
                <input
                  type="text"
                  className="contact-form-input"
                  placeholder="e.g. Michael Vance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="contact-form-group">
                <label className="contact-form-label">Email Address *</label>
                <input
                  type="email"
                  className="contact-form-input"
                  placeholder="michael@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="contact-form-group">
                <label className="contact-form-label">Subject</label>
                <input
                  type="text"
                  className="contact-form-input"
                  placeholder="e.g. Question regarding enterprise employer posting"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="contact-form-group">
                <label className="contact-form-label">Message *</label>
                <textarea
                  className="contact-form-textarea"
                  placeholder="How can we assist you today? Provide details here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send size={18} color="#ffffff" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
