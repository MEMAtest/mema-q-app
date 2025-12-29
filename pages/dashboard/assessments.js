// pages/dashboard/assessments.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/authContext';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const Icons = {
  filter: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  download: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  eye: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  trash: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
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
    hour: '2-digit',
    minute: '2-digit',
  });
};

const AssessmentsPage = () => {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAssessments();
    }
  }, [isAuthenticated]);

  const fetchAssessments = async () => {
    try {
      const res = await fetch('/api/dashboard/assessments');
      if (res.ok) {
        const data = await res.json();
        setAssessments(data.assessments || []);
      }
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this assessment?')) return;

    try {
      const res = await fetch(`/api/dashboard/assessments?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setAssessments((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete assessment:', error);
    }
  };

  const filteredAssessments = assessments
    .filter((a) => {
      if (filter === 'all') return true;
      return a.riskLevel?.toLowerCase() === filter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.completedAt) - new Date(a.completedAt);
      }
      if (sortBy === 'score') {
        return b.score - a.score;
      }
      return 0;
    });

  if (authLoading || !isAuthenticated) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <DashboardLayout title="Assessment History">
      {/* Filters */}
      <div className="dashboard-filters">
        <div className="filter-group">
          <label>Risk Level:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Most Recent</option>
            <option value="score">Highest Score</option>
          </select>
        </div>
      </div>

      {/* Assessments List */}
      {loading ? (
        <div className="dashboard-loading-inline">
          <div className="dashboard-loading-spinner"></div>
        </div>
      ) : filteredAssessments.length > 0 ? (
        <div className="assessments-table-container">
          <table className="assessments-table">
            <thead>
              <tr>
                <th>Assessment Type</th>
                <th>Date</th>
                <th>Score</th>
                <th>Risk Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssessments.map((assessment) => (
                <tr key={assessment.id}>
                  <td className="assessment-type">
                    {assessment.scenarioLabel || assessment.scenarioId}
                  </td>
                  <td className="assessment-date">
                    {formatDate(assessment.completedAt)}
                  </td>
                  <td className="assessment-score">
                    <div className="score-bar-container">
                      <div
                        className="score-bar"
                        style={{
                          width: `${assessment.score}%`,
                          backgroundColor:
                            assessment.score >= 80
                              ? '#10B981'
                              : assessment.score >= 60
                              ? '#F59E0B'
                              : '#EF4444',
                        }}
                      />
                      <span>{assessment.score}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`risk-badge ${getRiskBadgeClass(assessment.riskLevel)}`}>
                      {assessment.riskLevel}
                    </span>
                  </td>
                  <td className="assessment-actions">
                    <button
                      className="action-btn view"
                      title="View Details"
                      onClick={() => {
                        // Future: open detail modal
                        console.log('View assessment:', assessment.id);
                      }}
                    >
                      <Icons.eye />
                    </button>
                    <button
                      className="action-btn delete"
                      title="Delete"
                      onClick={() => handleDelete(assessment.id)}
                    >
                      <Icons.trash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="dashboard-empty">
          <p>No assessments found. Start your first compliance assessment!</p>
          <button
            className="dashboard-cta-btn"
            onClick={() => router.push('/')}
          >
            Start Assessment
          </button>
        </div>
      )}

      {/* Summary Stats */}
      {filteredAssessments.length > 0 && (
        <div className="assessments-summary">
          <div className="summary-stat">
            <span className="summary-value">{filteredAssessments.length}</span>
            <span className="summary-label">Total Shown</span>
          </div>
          <div className="summary-stat">
            <span className="summary-value">
              {Math.round(
                filteredAssessments.reduce((sum, a) => sum + a.score, 0) /
                  filteredAssessments.length
              )}%
            </span>
            <span className="summary-label">Avg Score</span>
          </div>
          <div className="summary-stat">
            <span className="summary-value">
              {filteredAssessments.filter((a) => a.riskLevel?.toLowerCase() === 'low').length}
            </span>
            <span className="summary-label">Low Risk</span>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AssessmentsPage;
