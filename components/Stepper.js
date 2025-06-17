// components/Stepper.js
import React from 'react';
import {
  ClipboardDocumentCheckIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  ChatBubbleBottomCenterTextIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';

// Map section IDs to icons for a more visual experience
const iconMap = {
  '1': ClipboardDocumentCheckIcon,
  '2': SparklesIcon,
  '3': BuildingOfficeIcon,
  '4': ExclamationTriangleIcon,
  '5': ChatBubbleBottomCenterTextIcon,
  '6': ArchiveBoxIcon,
};

const Stepper = ({ sections, currentSectionId, completedSections, onStepClick }) => {
  // Defensive check to ensure completedSections is always an array
  const safeCompletedSections = completedSections || [];

  return (
    <nav aria-label="Progress">
      <ol role="list" className="stepper">
        {sections.map((section) => {
          const IconComponent = iconMap[section.id.split('.')[0]];
          const isCompleted = safeCompletedSections.includes(section.id);
          const isActive = section.id === currentSectionId;
          const statusClass = isCompleted ? 'completed' : isActive ? 'active' : '';

          return (
            <li key={section.title} className={`step ${statusClass}`} onClick={() => onStepClick(section.id)}>
              <div className="dot">
                {IconComponent && <IconComponent className="icon" aria-hidden="true" />}
              </div>
              <span className="label">{section.title}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Stepper;
