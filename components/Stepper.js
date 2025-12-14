// components/Stepper.js
import React from 'react';
import Image from 'next/image';

// Map section IDs to custom icon paths
const iconMap = {
  '1': '/icons/sections/clipboard-check.svg',
  '2': '/icons/sections/sparkles.svg',
  '3': '/icons/sections/building.svg',
  '4': '/icons/sections/warning-triangle.svg',
  '5': '/icons/sections/chat-bubble.svg',
  '6': '/icons/sections/archive-box.svg',
};

const Stepper = ({ sections, currentSectionId, completedSections, onStepClick }) => {
  // Defensive check to ensure completedSections is always an array
  const safeCompletedSections = completedSections || [];

  return (
    <nav aria-label="Progress">
      <ol role="list" className="stepper">
        {sections.map((section) => {
          const iconPath = iconMap[section.id.split('.')[0]];
          const isCompleted = safeCompletedSections.includes(section.id);
          const isActive = section.id === currentSectionId;
          const statusClass = isCompleted ? 'completed' : isActive ? 'active' : '';

          return (
            <li key={section.title} className={`step ${statusClass}`} onClick={() => onStepClick(section.id)}>
              <div className="dot">
                {iconPath && <Image src={iconPath} alt="" width={20} height={20} className="icon" aria-hidden="true" />}
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
