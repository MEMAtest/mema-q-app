import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function AdminDashboard() {
  const { t } = useTranslation('common');
  const [authKey, setAuthKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async (token) => {
    if (!token) return;
    setLoading(true);
    try {
      const [analyticsRes, leadsRes] = await Promise.all([
        fetch('/api/admin/analytics', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/admin/leads?page=1&limit=10', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!analyticsRes.ok || !leadsRes.ok) {
        throw new Error('Request failed');
      }

      const analyticsData = await analyticsRes.json();
      const leadsData = await leadsRes.json();
      setAnalytics(analyticsData);
      setLeads(leadsData.leads || []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
      setError('Failed to fetch data. Please confirm your API key.');
      setAuthenticated(false);
      localStorage.removeItem('admin-token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedKey = localStorage.getItem('admin-token');
    if (storedKey) {
      setAuthKey(storedKey);
      setAuthenticated(true);
      fetchData(storedKey);
    }
  }, []);

  const handleLogin = () => {
    if (!authKey) {
      setError('Please enter the admin API key.');
      return;
    }
    localStorage.setItem('admin-token', authKey);
    setAuthenticated(true);
    fetchData(authKey);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    setAuthenticated(false);
    setAnalytics(null);
    setLeads([]);
  };

  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-light)' }}>
        <div className="card" style={{ maxWidth: '420px', width: '100%', padding: '2rem' }}>
          <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{t('admin.loginTitle')}</h1>
          <input
            type="password"
            placeholder={t('admin.enterKey')}
            value={authKey}
            onChange={(e) => setAuthKey(e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              border: '2px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--spacing-md)',
              fontSize: '1rem'
            }}
          />
          {error && (
            <p style={{ color: 'var(--color-danger)', marginBottom: 'var(--spacing-md)', fontSize: '0.9rem' }}>{error}</p>
          )}
          <button className="start-button" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogin}>
            {t('buttons.signIn')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`MEMA ${t('admin.dashboardTitle')}`}</title>
      </Head>
      <div style={{ minHeight: '100vh', background: 'var(--color-bg-light)', padding: '2rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem' }}>{t('admin.dashboardTitle')}</h1>
            <button className="btn-ghost" onClick={handleLogout}>
              {t('buttons.logout')}
            </button>
          </div>

          {loading && (
            <div className="card" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              Loading latest data...
            </div>
          )}

          {error && (
            <div className="card" style={{ marginBottom: '1.5rem', border: '1px solid var(--color-danger)' }}>
              <p style={{ color: 'var(--color-danger)' }}>{error}</p>
            </div>
          )}

          {analytics && (
            <div className="metrics-grid" style={{ marginBottom: '2rem' }}>
              <div className="metric-card">
                <Image src="/icons/ui/user-group.svg" alt="" width={48} height={48} style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem' }} />
                <div className="metric-value">{analytics.totalLeads}</div>
                <div className="metric-label">Total Leads</div>
              </div>
              <div className="metric-card">
                <Image src="/icons/actions/chart-bar.svg" alt="" width={48} height={48} style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem' }} />
                <div className="metric-value">{analytics.leadsThisWeek}</div>
                <div className="metric-label">Leads (7 days)</div>
              </div>
              <div className="metric-card">
                <Image src="/icons/sections/clipboard-check.svg" alt="" width={48} height={48} style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem' }} />
                <div className="metric-value">{analytics.averageCompletionRate}%</div>
                <div className="metric-label">Avg. Completion</div>
              </div>
            </div>
          )}

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem' }}>{t('admin.recentLeads')}</h2>
              <button className="btn-ghost" onClick={() => fetchData(authKey)}>
                {t('buttons.refresh')}
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid var(--color-border-light)' }}>Name</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid var(--color-border-light)' }}>Email</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid var(--color-border-light)' }}>Phone</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid var(--color-border-light)' }}>Firm</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid var(--color-border-light)' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id}>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--color-border-light)' }}>{lead.name || 'N/A'}</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--color-border-light)' }}>{lead.email}</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--color-border-light)' }}>{lead.phone}</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--color-border-light)' }}>{lead.firm || 'N/A'}</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--color-border-light)' }}>
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        {t('admin.noLeads')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
}
