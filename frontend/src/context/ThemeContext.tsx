import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const applyThemeToDOM = (next: Theme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (next === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
    root.setAttribute('data-theme', 'dark');
    root.style.colorScheme = 'dark';
    document.body?.classList.add('dark');
    document.body?.classList.remove('light');
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';
    document.body?.classList.remove('dark');
    document.body?.classList.add('light');
  }
  try {
    localStorage.setItem('queueless_theme_v6', next);
  } catch {}
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('queueless_theme_v6') as Theme | null;
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'light'; // Default to light mode as requested by user
  });

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    const isSafari =
      typeof navigator !== 'undefined' &&
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !isSafari
    ) {
      (document as any).startViewTransition(() => {
        applyThemeToDOM(next);
        setThemeState(next);
      });
    } else {
      applyThemeToDOM(next);
      setThemeState(next);
    }
  };

  const setTheme = (next: Theme) => {
    if (next === theme) return;
    const isSafari =
      typeof navigator !== 'undefined' &&
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !isSafari
    ) {
      (document as any).startViewTransition(() => {
        applyThemeToDOM(next);
        setThemeState(next);
      });
    } else {
      applyThemeToDOM(next);
      setThemeState(next);
    }
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
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return context;
};
