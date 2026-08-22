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
        background: theme === 'dark' ? '#262626' : '#F0F0F0',
        color: theme === 'dark' ? '#EDEDED' : '#171717',
        border: theme === 'dark' ? '1px solid #444444' : '1px solid #D4D4D4',
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
        <Sun size={15} color="#DA0037" />
      ) : (
        <Moon size={15} color="#171717" />
      )}
      <span style={{ color: theme === 'dark' ? '#EDEDED' : '#171717' }}>
        {theme === 'dark' ? 'Dark' : 'Light'}
      </span>
    </button>
  );
}

export default ThemeToggle;
