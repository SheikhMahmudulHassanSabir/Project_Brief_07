import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Briefcase, UserCheck, Shield, User, Settings, Moon, Sun } from 'lucide-react';
import logoW from '../../assets/images/logo_W.png';
import logoB from '../../assets/images/logo_B.png';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const [currentTheme, setCurrentTheme] = useState(() => {
    return document.documentElement.getAttribute('data-theme') || localStorage.getItem('app-theme') || 'light';
  });

  const { user, logout } = useAuth();

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('app-theme', newTheme);
    setCurrentTheme(newTheme);
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

  const dropdownItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.6rem 0.75rem',
    fontSize: '0.88rem',
    fontWeight: '500',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    textDecoration: 'none',
    transition: 'background-color var(--transition-fast)',
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
          </nav>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="desktop-nav">
              
              <Link
                to={getDashboardLink()}
                style={navBtnBaseStyle}
              >
                {getDashboardIcon()}
                <span>{getDashboardLabel()}</span>
              </Link>

              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--nav-text)', fontWeight: '600', fontSize: '0.85rem' }}>{user.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {user.role}
                    </div>
                  </div>

                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'var(--palette-accent)',
                      border: currentTheme === 'dark' ? '1px solid #444444' : '1px solid #D4D4D4',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                    }}
                  >
                    {user.name?.charAt(0) || 'U'}
                  </div>
                </button>

                {dropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 15px)',
                      right: 0,
                      width: '240px',
                      background: currentTheme === 'dark' ? '#1f1f1f' : '#ffffff',
                      border: currentTheme === 'dark' ? '1px solid #333' : '1px solid #eaeaea',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                      padding: '0.5rem',
                      zIndex: 1000,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem'
                    }}
                  >
                    <div style={{ 
                      padding: '0.5rem 0.5rem 0.75rem 0.5rem', 
                      borderBottom: currentTheme === 'dark' ? '1px solid #333' : '1px solid #eaeaea',
                      marginBottom: '0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'var(--palette-accent)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '700',
                          fontSize: '1rem',
                        }}
                      >
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div style={{ color: currentTheme === 'dark' ? '#EDEDED' : '#171717', fontWeight: '600', fontSize: '0.9rem' }}>{user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                          {user.role}
                        </div>
                      </div>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      style={{ ...dropdownItemStyle, color: currentTheme === 'dark' ? '#EDEDED' : '#171717' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme === 'dark' ? '#262626' : '#F5F5F5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setDropdownOpen(false)}
                      style={{ ...dropdownItemStyle, color: currentTheme === 'dark' ? '#EDEDED' : '#171717' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme === 'dark' ? '#262626' : '#F5F5F5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={toggleTheme}
                      style={{ ...dropdownItemStyle, color: currentTheme === 'dark' ? '#EDEDED' : '#171717' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme === 'dark' ? '#262626' : '#F5F5F5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {currentTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                      <span>Theme</span>
                    </button>
                    <div style={{ borderTop: currentTheme === 'dark' ? '1px solid #333' : '1px solid #eaeaea', margin: '0.25rem 0' }} />
                    <button
                      onClick={handleLogout}
                      style={{ ...dropdownItemStyle, color: 'var(--palette-accent)' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme === 'dark' ? '#262626' : '#F5F5F5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ ...dropdownItemStyle, color: 'var(--nav-text)', padding: '0.4rem 0' }}
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ ...dropdownItemStyle, color: 'var(--nav-text)', padding: '0.4rem 0' }}
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={toggleTheme}
                    style={{ ...dropdownItemStyle, color: 'var(--nav-text)', padding: '0.4rem 0' }}
                  >
                    {currentTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    <span>Theme</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    style={{ ...dropdownItemStyle, color: 'var(--palette-accent)', padding: '0.4rem 0' }}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
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
              <div style={{ borderTop: '1px solid var(--nav-border)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                 <button
                    onClick={toggleTheme}
                    style={{ ...dropdownItemStyle, color: 'var(--nav-text)', padding: '0.4rem 0' }}
                  >
                    {currentTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    <span>Theme</span>
                  </button>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav { gap: 0.5rem !important; }
          .desktop-nav a { font-size: 0.85rem !important; padding: 0.25rem 0.4rem !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
}

export default Navbar;
