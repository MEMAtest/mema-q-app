/**
 * Custom Regulatory-Themed Icon Components
 * Bold, vibrant icons for compliance questionnaire
 */

// ============================================
// YES ANSWER ICONS (Green/Compliance Theme)
// ============================================

export const ComplianceShieldIcon = ({ size = 48, color = '#10b981', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#34d399" />
      </linearGradient>
    </defs>
    {/* Shield body */}
    <path
      d="M24 4L6 12v12c0 11.03 7.58 21.34 18 24 10.42-2.66 18-12.97 18-24V12L24 4z"
      fill="url(#shieldGradient)"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Checkmark */}
    <path
      d="M16 24l6 6 12-12"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const ApprovedStampIcon = ({ size = 48, color = '#10b981', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="stampGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#34d399" />
      </linearGradient>
    </defs>
    {/* Outer circle */}
    <circle cx="24" cy="24" r="20" fill="url(#stampGradient)" />
    {/* Inner circle border */}
    <circle cx="24" cy="24" r="17" fill="none" stroke="white" strokeWidth="2" />
    {/* Checkmark */}
    <path
      d="M14 24l6 6 14-14"
      stroke="white"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const RegulatoryCheckIcon = ({ size = 48, color = '#10b981', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="checkDocGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#34d399" />
      </linearGradient>
    </defs>
    {/* Document */}
    <path
      d="M10 6a2 2 0 012-2h16l8 8v28a2 2 0 01-2 2H12a2 2 0 01-2-2V6z"
      fill="white"
      stroke={color}
      strokeWidth="2.5"
    />
    {/* Folded corner */}
    <path d="M28 4v6a2 2 0 002 2h6" stroke={color} strokeWidth="2.5" fill="none" />
    {/* Seal/Badge */}
    <circle cx="24" cy="28" r="10" fill="url(#checkDocGradient)" />
    {/* Checkmark inside seal */}
    <path
      d="M18 28l4 4 8-8"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

// ============================================
// NO ANSWER ICONS (Warning/Alert Theme)
// ============================================

export const WarningBadgeIcon = ({ size = 48, color = '#f59e0b', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="warningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#fbbf24" />
      </linearGradient>
    </defs>
    {/* Shield/Badge shape */}
    <path
      d="M24 4L6 12v12c0 11.03 7.58 21.34 18 24 10.42-2.66 18-12.97 18-24V12L24 4z"
      fill="url(#warningGradient)"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Exclamation mark */}
    <path
      d="M24 14v12M24 30v2"
      stroke="white"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
  </svg>
);

export const RegulatoryFlagIcon = ({ size = 48, color = '#f59e0b', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="flagGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#fbbf24" />
      </linearGradient>
    </defs>
    {/* Flag pole */}
    <rect x="10" y="6" width="3" height="38" fill={color} rx="1.5" />
    {/* Flag */}
    <path
      d="M13 8h24c1 0 1.5 0.5 1 1.5l-4 8 4 8c0.5 1 0 1.5-1 1.5H13V8z"
      fill="url(#flagGradient)"
      stroke={color}
      strokeWidth="1.5"
    />
    {/* Exclamation on flag */}
    <path
      d="M25 13v8M25 24v1.5"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const DocumentAlertIcon = ({ size = 48, color = '#f59e0b', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="alertDocGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#fbbf24" />
      </linearGradient>
    </defs>
    {/* Document */}
    <path
      d="M10 6a2 2 0 012-2h16l8 8v28a2 2 0 01-2 2H12a2 2 0 01-2-2V6z"
      fill="white"
      stroke={color}
      strokeWidth="2.5"
    />
    {/* Folded corner */}
    <path d="M28 4v6a2 2 0 002 2h6" stroke={color} strokeWidth="2.5" fill="none" />
    {/* Warning triangle */}
    <path
      d="M24 18l-8 16h16l-8-16z"
      fill="url(#alertDocGradient)"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Exclamation */}
    <path
      d="M24 23v6M24 31v1.5"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

// ============================================
// PROGRESS/INFO ICONS
// ============================================

export const FCACrestIcon = ({ size = 32, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="crestGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>
    </defs>
    {/* Shield */}
    <path
      d="M16 2L4 8v8c0 7.35 5.06 14.23 12 16 6.94-1.77 12-8.65 12-16V8L16 2z"
      fill="url(#crestGradient)"
      stroke="#1d4ed8"
      strokeWidth="1.5"
    />
    {/* FCA letters stylized */}
    <text
      x="16"
      y="20"
      fontFamily="Arial, sans-serif"
      fontSize="10"
      fontWeight="900"
      fill="white"
      textAnchor="middle"
    >
      FCA
    </text>
  </svg>
);

export const ComplianceMeterIcon = ({ size = 32, score = 75, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
    </defs>
    {/* Gauge arc background */}
    <path
      d="M6 22 A 10 10 0 0 1 26 22"
      fill="none"
      stroke="#e5e7eb"
      strokeWidth="4"
      strokeLinecap="round"
    />
    {/* Gauge arc filled */}
    <path
      d="M6 22 A 10 10 0 0 1 26 22"
      fill="none"
      stroke="url(#meterGradient)"
      strokeWidth="4"
      strokeLinecap="round"
      strokeDasharray={`${score} ${100 - score}`}
    />
    {/* Center circle */}
    <circle cx="16" cy="22" r="3" fill="#3b82f6" />
    {/* Needle */}
    <line
      x1="16"
      y1="22"
      x2="16"
      y2="12"
      stroke="#1e293b"
      strokeWidth="2"
      strokeLinecap="round"
      transform={`rotate(${score * 1.8 - 90} 16 22)`}
    />
  </svg>
);

export const RegDocumentIcon = ({ size = 32, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="regDocGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#60a5fa" />
      </linearGradient>
    </defs>
    {/* Document */}
    <path
      d="M6 4a2 2 0 012-2h10l6 6v18a2 2 0 01-2 2H8a2 2 0 01-2-2V4z"
      fill="url(#regDocGradient)"
    />
    {/* Folded corner */}
    <path d="M18 2v4a2 2 0 002 2h4" fill="#1d4ed8" />
    {/* Document lines */}
    <line x1="10" y1="14" x2="22" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="10" y1="18" x2="22" y2="18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="10" y1="22" x2="18" y2="22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const RegulatoryLightbulbIcon = ({ size = 32, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))' }}
  >
    <defs>
      <linearGradient id="bulbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    {/* Bulb */}
    <path
      d="M16 4a8 8 0 00-5 14.24V22a2 2 0 002 2h6a2 2 0 002-2v-3.76A8 8 0 0016 4z"
      fill="url(#bulbGradient)"
      stroke="#d97706"
      strokeWidth="1.5"
    />
    {/* Base */}
    <rect x="13" y="24" width="6" height="4" rx="1" fill="#d97706" />
    {/* Rays */}
    <path d="M16 2v2M8 8l1.5 1.5M4 16h2M8 24l1.5-1.5M24 8l-1.5 1.5M28 16h-2M24 24l-1.5-1.5"
      stroke="#fbbf24"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// ============================================
// METRIC CARD ICONS
// ============================================

export const ClipboardBadgeIcon = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CheckBadgeIcon = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChartBadgeIcon = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M9 13h6M9 17h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ClockBadgeIcon = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
    <path d="M12 7v5l3 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ComplianceBadgeIcon = ({ size = 24, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
      stroke="#059669"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
