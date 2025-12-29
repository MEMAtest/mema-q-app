// pages/dashboard/index.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/authContext';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const Icons = {
  assessment: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  score: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  promotion: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  trend: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  arrow: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
};

const getRiskBadgeClass = (risk) => {
  switch (risk?.toLowerCase()) {
    case 'high': return 'risk-high';
    case 'medium': return 'risk-medium';
    case 'low': return 'risk-low';
    default: return 'risk-medium';
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const DashboardPage = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, assessmentsRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/assessments?limit=5'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (assessmentsRes.ok) {
        const assessmentsData = await assessmentsRes.json();
        setRecentAssessments(assessmentsData.assessments || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <h2>Welcome back, {user?.name || user?.email?.split('@')[0]}!</h2>
        <p>Here's an overview of your compliance assessment activity.</p>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats-grid">
        <div className="dashboard-stat-card">
          <div className="stat-icon blue">
            <Icons.assessment />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats?.totalAssessments || 0}</span>
            <span className="stat-label">Total Assessments</span>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon green">
            <Icons.score />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats?.averageScore || 0}%</span>
            <span className="stat-label">Average Score</span>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon purple">
            <Icons.promotion />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats?.savedPromotions || 0}</span>
            <span className="stat-label">Saved Promotions</span>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon amber">
            <Icons.trend />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats?.thisMonth || 0}</span>
            <span className="stat-label">This Month</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h3>Recent Assessments</h3>
          <button
            className="dashboard-view-all"
            onClick={() => router.push('/dashboard/assessments')}
          >
            View All <Icons.arrow />
          </button>
        </div>

        {loading ? (
          <div className="dashboard-loading-inline">
            <div className="dashboard-loading-spinner small"></div>
          </div>
        ) : recentAssessments.length > 0 ? (
          <div className="dashboard-recent-list">
            {recentAssessments.map((assessment) => (
              <div key={assessment.id} className="dashboard-recent-item">
                <div className="recent-item-info">
                  <span className="recent-item-type">
                    {assessment.scenarioLabel || assessment.scenarioId}
                  </span>
                  <span className="recent-item-date">
                    {formatDate(assessment.completedAt)}
                  </span>
                </div>
                <div className="recent-item-stats">
                  <span className="recent-item-score">{assessment.score}%</span>
                  <span className={`recent-item-risk ${getRiskBadgeClass(assessment.riskLevel)}`}>
                    {assessment.riskLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dashboard-empty">
            <p>No assessments yet. Start your first compliance assessment!</p>
            <button
              className="dashboard-cta-btn"
              onClick={() => router.push('/')}
            >
              Start Assessment
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h3>Quick Actions</h3>
        <div className="dashboard-actions-grid">
          <button
            className="dashboard-action-card"
            onClick={() => router.push('/')}
          >
            <div className="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <span>New Assessment</span>
          </button>

          <button
            className="dashboard-action-card"
            onClick={() => router.push('/dashboard/promotions')}
          >
            <div className="action-icon">
              <Icons.promotion />
            </div>
            <span>View Promotions</span>
          </button>

          <button
            className="dashboard-action-card"
            onClick={() => router.push('/dashboard/analytics')}
          >
            <div className="action-icon">
              <Icons.trend />
            </div>
            <span>View Analytics</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
