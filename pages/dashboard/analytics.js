// pages/dashboard/analytics.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/authContext';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const AnalyticsPage = () => {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics();
    }
  }, [isAuthenticated]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/dashboard/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
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
    <DashboardLayout title="Analytics">
      {loading ? (
        <div className="dashboard-loading-inline">
          <div className="dashboard-loading-spinner"></div>
        </div>
      ) : (
        <div className="analytics-container">
          {/* Score Trend */}
          <div className="analytics-card wide">
            <h3>Compliance Score Trend</h3>
            <div className="analytics-chart-placeholder">
              {analytics?.scoreTrend && analytics.scoreTrend.length > 0 ? (
                <div className="simple-chart">
                  <div className="chart-bars">
                    {analytics.scoreTrend.slice(-10).map((item, index) => (
                      <div key={index} className="chart-bar-container">
                        <div
                          className="chart-bar"
                          style={{
                            height: `${item.score}%`,
                            backgroundColor:
                              item.score >= 80
                                ? '#10B981'
                                : item.score >= 60
                                ? '#F59E0B'
                                : '#EF4444',
                          }}
                        />
                        <span className="chart-label">{item.month}</span>
                      </div>
                    ))}
                  </div>
                  <div className="chart-y-axis">
                    <span>100%</span>
                    <span>50%</span>
                    <span>0%</span>
                  </div>
                </div>
              ) : (
                <div className="no-data">
                  <p>Not enough data to show trends yet.</p>
                  <p>Complete more assessments to see your progress over time.</p>
                </div>
              )}
            </div>
          </div>

          {/* Assessments by Type */}
          <div className="analytics-card">
            <h3>Assessments by Type</h3>
            <div className="analytics-breakdown">
              {analytics?.byScenario && Object.keys(analytics.byScenario).length > 0 ? (
                Object.entries(analytics.byScenario).map(([scenario, count]) => (
                  <div key={scenario} className="breakdown-item">
                    <span className="breakdown-label">{scenario}</span>
                    <div className="breakdown-bar-container">
                      <div
                        className="breakdown-bar"
                        style={{
                          width: `${(count / analytics.totalAssessments) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="breakdown-count">{count}</span>
                  </div>
                ))
              ) : (
                <div className="no-data-small">
                  <p>No assessment data yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="analytics-card">
            <h3>Risk Distribution</h3>
            <div className="risk-distribution">
              {analytics?.riskDistribution ? (
                <>
                  <div className="risk-pie">
                    <div
                      className="risk-segment low"
                      style={{
                        '--percentage': `${
                          (analytics.riskDistribution.low / analytics.totalAssessments) * 100 || 0
                        }%`,
                      }}
                    />
                  </div>
                  <div className="risk-legend">
                    <div className="legend-item">
                      <span className="legend-dot low"></span>
                      <span>Low Risk: {analytics.riskDistribution.low || 0}</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot medium"></span>
                      <span>Medium Risk: {analytics.riskDistribution.medium || 0}</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot high"></span>
                      <span>High Risk: {analytics.riskDistribution.high || 0}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="no-data-small">
                  <p>No risk data yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="analytics-card">
            <h3>Key Metrics</h3>
            <div className="key-metrics">
              <div className="metric-item">
                <span className="metric-value">{analytics?.totalAssessments || 0}</span>
                <span className="metric-label">Total Assessments</span>
              </div>
              <div className="metric-item">
                <span className="metric-value">{analytics?.averageScore || 0}%</span>
                <span className="metric-label">Average Score</span>
              </div>
              <div className="metric-item">
                <span className="metric-value">{analytics?.improvementRate || 0}%</span>
                <span className="metric-label">Improvement Rate</span>
              </div>
              <div className="metric-item">
                <span className="metric-value">{analytics?.thisMonth || 0}</span>
                <span className="metric-label">This Month</span>
              </div>
            </div>
          </div>

          {/* Improvement Tips */}
          <div className="analytics-card wide">
            <h3>Improvement Recommendations</h3>
            <div className="improvement-tips">
              {analytics?.tips && analytics.tips.length > 0 ? (
                <ul className="tips-list">
                  {analytics.tips.map((tip, index) => (
                    <li key={index} className="tip-item">
                      <span className="tip-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                          <path d="M9 18h6" />
                          <path d="M10 22h4" />
                        </svg>
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="no-data-small">
                  <p>Complete more assessments to receive personalized improvement recommendations.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AnalyticsPage;
