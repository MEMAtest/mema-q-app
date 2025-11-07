import React, { useState } from 'react';
import {
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  ChatBubbleBottomCenterTextIcon,
  ArchiveBoxIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const iconMap = {
  '1': ExclamationTriangleIcon,
  '2': ClipboardDocumentCheckIcon,
  '3': SparklesIcon,
  '4': BuildingOfficeIcon,
  '5': ChatBubbleBottomCenterTextIcon,
  '6': ArchiveBoxIcon,
};

const QuestionnaireLeftSidebar = ({
  sections,
  currentSectionId,
  completedSections,
  onStepClick,
  currentSectionIndex
}) => {
  const safeCompletedSections = completedSections || [];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarContent = (
    <>
      <h3 style={{
        fontSize: '1.125rem',
        fontWeight: 'var(--font-bold)',
        color: 'var(--color-text-primary)',
        marginBottom: 'var(--spacing-lg)',
        paddingBottom: 'var(--spacing-md)',
        borderBottom: '2px solid var(--color-border-light)'
      }}>
        Assessment Sections
      </h3>

      <nav aria-label="Section navigation">
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-sm)'
        }}>
          {sections.map((section, index) => {
            const IconComponent = iconMap[section.id.split('.')[0]];
            const isCompleted = safeCompletedSections.includes(section.id);
            const isActive = section.id === currentSectionId;
            const isClickable = isCompleted || index <= currentSectionIndex;

            return (
              <li
                key={section.id}
                onClick={() => {
                  if (isClickable) {
                    onStepClick(index);
                    setMobileMenuOpen(false); // Close mobile menu after selection
                  }
                }}
                style={{
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--color-accent-primary-bg)' : 'transparent',
                  border: isActive ? '2px solid var(--color-accent-primary)' : '2px solid transparent',
                  cursor: isClickable ? 'pointer' : 'not-allowed',
                  opacity: isClickable ? 1 : 0.5,
                  transition: 'all var(--transition-base)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)'
                }}
                onMouseEnter={(e) => {
                  if (isClickable && !isActive) {
                    e.currentTarget.style.background = 'var(--color-bg-light)';
                    e.currentTarget.style.borderColor = 'var(--color-border-light)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive
                    ? 'var(--color-accent-primary)'
                    : isCompleted
                      ? 'var(--color-success)'
                      : 'var(--color-bg-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all var(--transition-base)'
                }}>
                  {isCompleted ? (
                    <CheckCircleIcon style={{
                      width: '24px',
                      height: '24px',
                      color: 'var(--color-bg-white)'
                    }} />
                  ) : IconComponent ? (
                    <IconComponent style={{
                      width: '24px',
                      height: '24px',
                      color: isActive ? 'var(--color-bg-white)' : 'var(--color-accent-primary)'
                    }} />
                  ) : (
                    <span style={{
                      fontWeight: 'var(--font-bold)',
                      color: isActive ? 'var(--color-bg-white)' : 'var(--color-accent-primary)'
                    }}>
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Section Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 'var(--font-medium)',
                    color: 'var(--color-text-muted)',
                    marginBottom: '2px'
                  }}>
                    Section {index + 1}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 'var(--font-semibold)' : 'var(--font-medium)',
                    color: isActive ? 'var(--color-accent-primary)' : 'var(--color-text-primary)',
                    lineHeight: 1.3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {section.title?.replace(/Section \d+: /g, "") || section.sectionTitle?.replace(/Section \d+: /g, "") || 'Untitled'}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Helper Text */}
      <div style={{
        marginTop: 'var(--spacing-xl)',
        padding: 'var(--spacing-md)',
        background: 'var(--color-accent-primary-bg)',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.75rem',
        color: 'var(--color-text-secondary)',
        lineHeight: 1.5
      }}>
        <p style={{ margin: 0 }}>
          💡 <strong>Tip:</strong> Complete sections to unlock navigation to later sections.
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="questionnaire-mobile-menu-toggle"
        style={{
          display: 'none',
          position: 'fixed',
          bottom: 'var(--spacing-lg)',
          right: 'var(--spacing-lg)',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--color-accent-primary)',
          color: 'white',
          border: 'none',
          boxShadow: 'var(--shadow-xl)',
          cursor: 'pointer',
          zIndex: 1000,
          alignItems: 'center',
          justifyContent: 'center'
        }}
        aria-label="Toggle section navigation"
      >
        {mobileMenuOpen ? (
          <XMarkIcon style={{ width: '28px', height: '28px' }} />
        ) : (
          <Bars3Icon style={{ width: '28px', height: '28px' }} />
        )}
      </button>

      {/* Desktop Sidebar */}
      <aside className="questionnaire-sidebar-desktop" style={{
        position: 'sticky',
        top: '80px',
        height: 'calc(100vh - 100px)',
        overflowY: 'auto',
        background: 'var(--color-bg-white)',
        borderRight: '2px solid var(--color-border-light)',
        padding: 'var(--spacing-xl) var(--spacing-lg)',
        width: '280px',
        flexShrink: 0
      }}>
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
              display: 'none'
            }}
            className="questionnaire-mobile-backdrop"
          />

          {/* Mobile Sidebar */}
          <aside
            className="questionnaire-sidebar-mobile"
            style={{
              display: 'none',
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: '85%',
              maxWidth: '320px',
              background: 'var(--color-bg-white)',
              boxShadow: 'var(--shadow-2xl)',
              zIndex: 1001,
              overflowY: 'auto',
              padding: 'var(--spacing-xl) var(--spacing-lg)',
              animation: 'slideInLeft 0.3s ease-out'
            }}
          >
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
};

export default QuestionnaireLeftSidebar;
