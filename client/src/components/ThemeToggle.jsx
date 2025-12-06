import React from 'react';
import { useTheme } from '../hooks/useTheme';
import './ThemeToggle.css';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle-container">
      <span className={`toggle-text ${theme === 'light' ? 'active' : ''}`}>Light</span>
      <label className="switch">
        <input 
          type="checkbox" 
          checked={theme === 'dark'} 
          onChange={toggleTheme}
        />
        <span className="slider">
          <div className="star star-1"></div>
          <div className="star star-2"></div>
          <div className="star star-3"></div>
          <div className="moon-crater"></div>
        </span>
      </label>
      <span className={`toggle-text ${theme === 'dark' ? 'active' : ''}`}>Dark</span>
    </div>
  );
};
