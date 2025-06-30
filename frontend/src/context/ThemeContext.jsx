import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Default to light mode, check localStorage, then system preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) {
        return saved === 'dark';
      }
      // Default to light mode instead of system preference
      return false;
    }
    return false;
  });

  const [forceUpdate, setForceUpdate] = useState(0);

  // Clear any existing theme and set to light mode on first load
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Save to localStorage
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      
      // Apply theme using CSS custom properties for Tailwind v4
      const root = document.documentElement;
      const body = document.body;
      
      if (isDark) {
        root.style.setProperty('--color-scheme', 'dark');
        root.classList.add('dark');
        body.style.backgroundColor = '#000000';
        body.style.color = '#ffffff';
      } else {
        root.style.setProperty('--color-scheme', 'light');
        root.classList.remove('dark');
        body.style.backgroundColor = '#ffffff';
        body.style.color = '#000000';
      }

      // Force a re-render to ensure styles are applied
      setForceUpdate(prev => prev + 1);
      
      console.log('Theme applied:', isDark ? 'dark' : 'light');
      console.log('Root classes:', root.className);
      console.log('Body background:', body.style.backgroundColor);
    }
  }, [isDark]);

  const toggleTheme = () => {
    console.log('Toggling theme from:', isDark ? 'dark' : 'light', 'to:', isDark ? 'light' : 'dark');
    setIsDark(prev => !prev);
  };

  const setTheme = (theme) => {
    setIsDark(theme === 'dark');
  };

  const resetToLight = () => {
    localStorage.removeItem('theme');
    setIsDark(false);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, setTheme, forceUpdate, resetToLight }}>
      {children}
    </ThemeContext.Provider>
  );
}; 