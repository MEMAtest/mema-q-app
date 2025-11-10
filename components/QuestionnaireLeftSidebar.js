import React, { useState, memo } from 'react';
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

const QuestionnaireLeftSidebar = memo(({
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
        color: 'var(--text-primary)',
        marginBottom: 'var(--spacing-lg)',
        paddingBottom: 'var(--spacing-md)',
        borderBottom: '2px solid var(--accent-teal)'
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
                  background: isActive ? 'rgba(20, 184, 166, 0.15)' : 'transparent',
                  border: isActive ? '2px solid var(--accent-teal)' : '2px solid transparent',
                  cursor: isClickable ? 'pointer' : 'not-allowed',
                  opacity: isClickable ? 1 : 0.5,
                  transition: 'all var(--transition-base)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)'
                }}
                onMouseEnter={(e) => {
                  if (isClickable && !isActive) {
                    e.currentTarget.style.background = 'rgba(20, 184, 166, 0.08)';
                    e.currentTarget.style.borderColor = 'var(--border-medium)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                {/* Icon - Dark Theme */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive
                    ? 'var(--gradient-teal-green)'
                    : isCompleted
                      ? 'var(--gradient-green-teal)'
                      : 'var(--bg-card-medium)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all var(--transition-base)',
                  boxShadow: isActive ? 'var(--shadow-teal-glow)' : isCompleted ? 'var(--shadow-green-glow)' : 'none'
                }}>
                  {isCompleted ? (
                    <CheckCircleIcon style={{
                      width: '24px',
                      height: '24px',
                      color: 'white'
                    }} />
                  ) : IconComponent ? (
                    <IconComponent style={{
                      width: '24px',
                      height: '24px',
                      color: isActive ? 'white' : 'var(--accent-teal)'
                    }} />
                  ) : (
                    <span style={{
                      fontWeight: 'var(--font-bold)',
                      color: isActive ? 'white' : 'var(--accent-teal)'
                    }}>
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Section Info - Dark Theme */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 'var(--font-medium)',
                    color: 'var(--text-muted)',
                    marginBottom: '2px'
                  }}>
                    Section {index + 1}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 'var(--font-semibold)' : 'var(--font-medium)',
                    color: isActive ? 'var(--accent-teal-light)' : 'var(--text-primary)',
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

      {/* Helper Text - Dark Theme */}
      <div style={{
        marginTop: 'var(--spacing-xl)',
        padding: 'var(--spacing-md)',
        background: 'rgba(20, 184, 166, 0.1)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.75rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.5
      }}>
        <p style={{ margin: 0 }}>
          💡 <strong style={{ color: 'var(--accent-teal-light)' }}>Tip:</strong> Complete sections to unlock navigation to later sections.
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
          background: 'var(--gradient-teal-green)',
          color: 'white',
          border: '2px solid var(--accent-teal)',
          boxShadow: 'var(--shadow-teal-glow-strong)',
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

      {/* Desktop Sidebar - Dark Glass */}
      <aside className="questionnaire-sidebar-desktop" style={{
        position: 'sticky',
        top: '80px',
        height: 'calc(100vh - 100px)',
        overflowY: 'auto',
        background: 'var(--bg-card-dark)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        borderRight: '2px solid var(--border-medium)',
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

          {/* Mobile Sidebar - Dark Glass */}
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
              background: 'var(--bg-card-darker)',
              backdropFilter: 'var(--glass-blur)',
              WebkitBackdropFilter: 'var(--glass-blur)',
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
});

QuestionnaireLeftSidebar.displayName = 'QuestionnaireLeftSidebar';

export default QuestionnaireLeftSidebar;
