import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function Error({ statusCode, message }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg-light)',
      padding: '2rem'
    }}>
      <div className="card" style={{ textAlign: 'center', maxWidth: '500px', padding: '3rem' }}>
        <ExclamationTriangleIcon style={{ width: '5rem', height: '5rem', color: 'var(--color-danger)', margin: '0 auto 1.5rem' }} />
        <h1 style={{ fontSize: '2rem', fontWeight: 'var(--font-bold)', color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
          {statusCode ? `Error ${statusCode}` : 'An error occurred'}
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
          {message || 'Something went wrong. Please try again.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="start-button"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  const message = err?.message;
  return { statusCode, message };
};

export default Error;
