// pages/_app.js
import '../styles/globals.css';
import '../styles/mema-dark-theme.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
