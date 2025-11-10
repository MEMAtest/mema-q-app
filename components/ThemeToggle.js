import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../lib/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
    >
      {isLight ? (
        <MoonIcon style={{ width: '1.5rem', height: '1.5rem' }} />
      ) : (
        <SunIcon style={{ width: '1.5rem', height: '1.5rem' }} />
      )}
    </button>
  );
}
