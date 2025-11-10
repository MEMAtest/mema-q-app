import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window === 'undefined') return;
    const savedTheme = window.localStorage.getItem('mema-theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('mema-dark-theme', savedTheme === 'dark');
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;
    document.documentElement.classList.toggle('mema-dark-theme', theme === 'dark');
    window.localStorage.setItem('mema-theme', theme);
  }, [isMounted, theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
