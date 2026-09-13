import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('app-theme');
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      onClick={toggleTheme}
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'var(--bg-surface-elevated)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-default)',
        borderRadius: '999px',
        padding: '0.4rem 0.8rem',
        fontSize: '0.82rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
        userSelect: 'none',
      }}
    >
      {theme === 'dark' ? (
        <Sun size={15} color="currentColor" />
      ) : (
        <Moon size={15} color="currentColor" />
      )}
      <span>
        {theme === 'dark' ? 'Dark' : 'Light'}
      </span>
    </button>
  );
}

export default ThemeToggle;
