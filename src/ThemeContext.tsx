import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme } from './types';
import { THEMES } from './constants';

interface ThemeContextType {
  theme: Theme;
  setTheme: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(THEMES[0]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('clarity-theme');
    if (savedTheme) {
      const found = THEMES.find(t => t.id === savedTheme);
      if (found) setThemeState(found);
    }
  }, []);

  const setTheme = (themeId: string) => {
    const found = THEMES.find(t => t.id === themeId);
    if (found) {
      setThemeState(found);
      localStorage.setItem('clarity-theme', themeId);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={theme.bg + " min-h-screen transition-colors duration-500 font-sans " + theme.text}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
