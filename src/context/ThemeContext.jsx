'use client';

import React, { createContext, useEffect, useContext, useState, useSyncExternalStore } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Theme preference: 'system' | 'light' | 'dark'
  // Important: do not read localStorage during initial render, otherwise SSR HTML and
  // the first client render can differ and cause hydration errors.
  const [themePreference, setThemePreference] = useState('system');
  
  // Layout: 'compact' | 'kanban' | 'list'
  const [layout, setLayout] = useState('compact');

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('app-theme');
      if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
        setThemePreference(savedTheme);
      }

      const savedLayout = localStorage.getItem('app-layout');
      if (savedLayout) {
        // Migrate old layouts to 'compact'
        if (['default', 'modern', 'ultra-compact'].includes(savedLayout)) {
          setLayout('compact');
        } else {
          setLayout(savedLayout);
        }
      }
    } catch (e) {
      // Ignore storage access errors (private mode, disabled storage, etc.)
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const prefersDark = useSyncExternalStore(
    (callback) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {};
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    },
    () => {
      if (typeof window === 'undefined' || !window.matchMedia) return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    },
    () => false
  );

  // Resolved theme used by CSS/Tailwind. Always 'light' or 'dark'.
  const theme =
    themePreference === 'system' ? (prefersDark ? 'dark' : 'light') : themePreference;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme-preference', themePreference);

    if (!isInitialized) return;
    try {
      localStorage.setItem('app-theme', themePreference);
    } catch (e) {}
  }, [isInitialized, themePreference, theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-layout', layout);

    if (!isInitialized) return;
    try {
      localStorage.setItem('app-layout', layout);
    } catch (e) {}
  }, [isInitialized, layout]);

  const toggleTheme = () => {
    // Cycle: system -> light -> dark -> system
    setThemePreference((prev) => {
      if (prev === 'system') return 'light';
      if (prev === 'light') return 'dark';
      return 'system';
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme, // resolved: 'light' | 'dark'
        themePreference, // 'system' | 'light' | 'dark'
        setThemePreference,
        setTheme: setThemePreference, // backwards-compatible alias
        toggleTheme,
        layout,
        setLayout,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
