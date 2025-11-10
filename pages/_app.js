// pages/_app.js
import { useEffect } from 'react';
import '../styles/globals.css';
import '../styles/mema-dark-theme.css';
import { ThemeProvider } from '../lib/ThemeContext';
import { validateEnv } from '../lib/validateEnv';
import { appWithTranslation } from 'next-i18next';

if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
  validateEnv();
}

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const handleError = (event) => {
      console.error('Unhandled error:', event.error || event.message);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default appWithTranslation(MyApp);
