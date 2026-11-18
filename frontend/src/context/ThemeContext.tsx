import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const applyThemeToDOM = (_next?: Theme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  // Always enforce dark luxury midnight medical theme
  root.classList.add('dark');
  root.classList.remove('light');
  root.setAttribute('data-theme', 'dark');
  root.style.colorScheme = 'dark';
  try {
    localStorage.setItem('queueless_theme', 'dark');
    localStorage.setItem('queueless_theme_v4', 'dark');
  } catch {}
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme] = useState<Theme>('dark');

  useEffect(() => {
    applyThemeToDOM('dark');
  }, []);

  const toggleTheme = () => {
    applyThemeToDOM('dark');
  };

  const setTheme = (_next: Theme) => {
    applyThemeToDOM('dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'dark',
      toggleTheme: () => applyThemeToDOM('dark'),
      setTheme: () => applyThemeToDOM('dark'),
    };
  }
  return context;
};
