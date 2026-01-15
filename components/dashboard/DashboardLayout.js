// components/dashboard/DashboardLayout.js
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/authContext';

const Icons = {
  home: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  history: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  folder: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  chart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  feedback: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <line x1="9" y1="10" x2="15" y2="10" />
    </svg>
  ),
  plus: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  logout: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  menu: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  close: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: 'home' },
  { href: '/dashboard/assessments', label: 'Assessment History', icon: 'history' },
  { href: '/dashboard/promotions', label: 'Saved Promotions', icon: 'folder' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: 'chart' },
];

const DashboardLayout = ({ children, title = 'Dashboard' }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState('idle'); // idle, sending, sent, error

  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim()) return;
    setFeedbackStatus('sending');
    try {
      // For now, just log feedback - could be connected to an API later
      console.log('Feedback submitted:', feedbackText);
      // Simulate sending
      await new Promise(resolve => setTimeout(resolve, 500));
      setFeedbackStatus('sent');
      setTimeout(() => {
        setShowFeedback(false);
        setFeedbackText('');
        setFeedbackStatus('idle');
      }, 2000);
    } catch (err) {
      setFeedbackStatus('error');
    }
  };

  const getInitials = (name, email) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email ? email[0].toUpperCase() : 'U';
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleNewAssessment = () => {
    router.push('/');
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile Header */}
      <div className="dashboard-mobile-header">
        <button
          className="dashboard-menu-btn"
          onClick={() => setSidebarOpen(true)}
        >
          <Icons.menu />
        </button>
        <h1 className="dashboard-mobile-title">{title}</h1>
        <div className="dashboard-mobile-avatar">
          {getInitials(user?.name, user?.email)}
        </div>
      </div>

      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="dashboard-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="dashboard-sidebar-header">
          <Link href="/" className="dashboard-logo">
            <span className="logo-icon">M</span>
            <span className="logo-text">MEMA Compliance</span>
          </Link>
          <button
            className="dashboard-close-btn"
            onClick={() => setSidebarOpen(false)}
          >
            <Icons.close />
          </button>
        </div>

        {/* User Info */}
        <div className="dashboard-user-section">
          <div className="dashboard-user-avatar">
            {getInitials(user?.name, user?.email)}
          </div>
          <div className="dashboard-user-info">
            <span className="dashboard-user-name">{user?.name || 'User'}</span>
            <span className="dashboard-user-email">{user?.email}</span>
          </div>
        </div>

        {/* New Assessment Button */}
        <button className="dashboard-new-btn" onClick={handleNewAssessment}>
          <Icons.plus />
          <span>New Assessment</span>
        </button>

        {/* Navigation */}
        <nav className="dashboard-nav">
          {navItems.map((item) => {
            const Icon = Icons[item.icon];
            const isActive = router.pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`dashboard-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Feedback & Logout */}
        <div className="dashboard-sidebar-footer">
          <button className="dashboard-feedback-btn" onClick={() => setShowFeedback(true)}>
            <Icons.feedback />
            <span>Send Feedback</span>
          </button>
          <button className="dashboard-logout-btn" onClick={handleLogout}>
            <Icons.logout />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="feedback-modal-overlay" onClick={() => setShowFeedback(false)}>
          <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
            <button className="feedback-modal-close" onClick={() => setShowFeedback(false)}>
              <Icons.close />
            </button>
            <h3>Send Feedback</h3>
            <p>Help us improve MEMA Compliance. Share your thoughts, suggestions, or report issues.</p>

            {feedbackStatus === 'sent' ? (
              <div className="feedback-success">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <p>Thank you for your feedback!</p>
              </div>
            ) : (
              <>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="What would you like to share with us?"
                  rows={4}
                />
                <button
                  className="feedback-submit-btn"
                  onClick={handleFeedbackSubmit}
                  disabled={feedbackStatus === 'sending' || !feedbackText.trim()}
                >
                  {feedbackStatus === 'sending' ? 'Sending...' : 'Submit Feedback'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="dashboard-title">{title}</h1>
        </header>
        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
