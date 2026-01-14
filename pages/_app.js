// pages/_app.js
import { useEffect } from 'react';
import '../styles/globals.css';
import { validateEnv } from '../lib/validateEnv';
import { appWithTranslation } from 'next-i18next';
import { AuthProvider } from '../lib/authContext';
import { Analytics } from '@vercel/analytics/react';

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
    <AuthProvider>
      <Component {...pageProps} />
      <Analytics />
    </AuthProvider>
  );
}

export default appWithTranslation(MyApp);
