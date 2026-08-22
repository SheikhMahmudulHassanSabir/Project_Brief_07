import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Briefcase, UserCheck, Shield } from 'lucide-react';
import logoW from '../assets/images/logo_W.png';
import logoB from '../assets/images/logo_B.png';
import ThemeToggle from '../components/common/ThemeToggle';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(() => {
    return document.documentElement.getAttribute('data-theme') || localStorage.getItem('app-theme') || 'light';
  });

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute('data-theme') || 'light';
      setCurrentTheme(theme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'employer') return '/employer';
    return '/jobseeker';
  };

  const getDashboardLabel = () => {
    if (!user) return 'Dashboard';
    if (user.role === 'admin') return 'Admin Panel';
    if (user.role === 'employer') return 'Employer Portal';
    return 'Candidate Portal';
  };

  const getDashboardIcon = () => {
    if (user?.role === 'admin') return <Shield size={14} color="var(--palette-accent)" />;
    if (user?.role === 'employer') return <Briefcase size={14} color="var(--palette-accent)" />;
    return <UserCheck size={14} color="var(--palette-accent)" />;
  };

  const isActive = (path) => location.pathname === path;

  // In dark mode: black navbar with logo_B.png; in light mode: white navbar with logo_W.png
  const activeLogo = currentTheme === 'dark' ? logoB : logoW;

  // Uniform pill button styles matching the ThemeToggle (dark mode button)
  const navBtnBaseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    background: currentTheme === 'dark' ? '#262626' : '#F0F0F0',
    color: currentTheme === 'dark' ? '#EDEDED' : '#171717',
    border: currentTheme === 'dark' ? '1px solid #444444' : '1px solid #D4D4D4',
    borderRadius: '999px',
    padding: '0.4rem 0.85rem',
    fontSize: '0.82rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    userSelect: 'none',
    textDecoration: 'none',
    lineHeight: 1,
  };

  const navBtnAccentStyle = {
    ...navBtnBaseStyle,
    background: 'var(--palette-accent)',
    color: '#FFFFFF',
    border: '1px solid var(--palette-accent)',
    boxShadow: 'var(--primary-shadow)',
  };

  return (
    <header
      style={{
        backgroundColor: 'var(--nav-bg)',
        borderBottom: '1px solid var(--nav-border)',
        position: 'sticky',
        top: 0,
        zIndex: 999,
        width: '100%',
        transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '68px',
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        {/* Brand Logo & Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: 0,
              margin: 0,
              textDecoration: 'none',
            }}
          >
            <img
              src={activeLogo}
              alt="Job Connect Portal"
              style={{
                height: '46px',
                width: 'auto',
                maxWidth: '180px',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </Link>

          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
            }}
            className="desktop-nav"
          >
            <Link
              to="/"
              style={{
                fontSize: '0.92rem',
                fontWeight: isActive('/') ? '700' : '500',
                color: isActive('/') ? 'var(--nav-text-active)' : 'var(--nav-text)',
                padding: '0.35rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                transition: 'color var(--transition-fast)',
              }}
            >
              Home
            </Link>

            <Link
              to="/jobs"
              style={{
                fontSize: '0.92rem',
                fontWeight: isActive('/jobs') ? '700' : '500',
                color: isActive('/jobs') ? 'var(--nav-text-active)' : 'var(--nav-text)',
                padding: '0.35rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                transition: 'color var(--transition-fast)',
              }}
            >
              Find Jobs
            </Link>

            <Link
              to="/about"
              style={{
                fontSize: '0.92rem',
                fontWeight: isActive('/about') ? '700' : '500',
                color: isActive('/about') ? 'var(--nav-text-active)' : 'var(--nav-text)',
                padding: '0.35rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                transition: 'color var(--transition-fast)',
              }}
            >
              About
            </Link>

            <Link
              to="/contact"
              style={{
                fontSize: '0.92rem',
                fontWeight: isActive('/contact') ? '700' : '500',
                color: isActive('/contact') ? 'var(--nav-text-active)' : 'var(--nav-text)',
                padding: '0.35rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                transition: 'color var(--transition-fast)',
              }}
            >
              Contact
            </Link>

            {user && (
              <Link
                to={getDashboardLink()}
                style={navBtnBaseStyle}
              >
                {getDashboardIcon()}
                <span>{getDashboardLabel()}</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Right Actions & Theme Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ThemeToggle />

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="desktop-nav">
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--nav-text)', fontWeight: '600', fontSize: '0.85rem' }}>{user.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  {user.role}
                </div>
              </div>

              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--palette-accent)',
                  border: currentTheme === 'dark' ? '1px solid #444444' : '1px solid #D4D4D4',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                }}
              >
                {user.name?.charAt(0) || 'U'}
              </div>

              <button
                onClick={handleLogout}
                style={{
                  ...navBtnBaseStyle,
                  color: 'var(--palette-accent)',
                }}
                title="Sign out"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }} className="desktop-nav">
              <Link
                to="/login"
                style={navBtnBaseStyle}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                style={navBtnAccentStyle}
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            aria-label="Toggle navigation menu"
            style={{
              ...navBtnBaseStyle,
              padding: '0.4rem 0.65rem',
              display: 'none',
            }}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--nav-bg)',
            borderTop: '1px solid var(--nav-border)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--nav-text)', fontSize: '0.95rem', fontWeight: '500' }}
          >
            Home
          </Link>
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--nav-text)', fontSize: '0.95rem', fontWeight: '500' }}
          >
            Find Jobs
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--nav-text)', fontSize: '0.95rem', fontWeight: '500' }}
          >
            About Us
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'var(--nav-text)', fontSize: '0.95rem', fontWeight: '500' }}
          >
            Contact
          </Link>

          {user ? (
            <>
              <Link
                to={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                style={{ ...navBtnBaseStyle, width: '100%', justifyContent: 'flex-start' }}
              >
                {getDashboardIcon()}
                <span>{getDashboardLabel()}</span>
              </Link>
              <div style={{ borderTop: '1px solid var(--nav-border)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                  Signed in as <strong>{user.name}</strong> ({user.role})
                </div>
                <button
                  onClick={handleLogout}
                  style={{ ...navBtnBaseStyle, width: '100%', color: 'var(--palette-accent)' }}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                style={{ ...navBtnBaseStyle, flex: 1 }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                style={{ ...navBtnAccentStyle, flex: 1 }}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
}

export default Navbar;
