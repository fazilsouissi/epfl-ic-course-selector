'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Theme: 'light' | 'dark'
  const [theme, setTheme] = useState('light');
  
  // Layout: 'compact' | 'kanban' | 'list'
  const [layout, setLayout] = useState('compact');
  
  // Initialize from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme');
    const savedLayout = localStorage.getItem('app-layout');
    
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    if (savedLayout) {
      // Migrate old layouts to 'compact'
      if (['default', 'modern', 'ultra-compact'].includes(savedLayout)) {
        setLayout('compact');
      } else {
        setLayout(savedLayout);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('app-layout', layout);
    document.documentElement.setAttribute('data-layout', layout);
  }, [layout]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, layout, setLayout }}>
      {children}
    </ThemeContext.Provider>
  );
};
