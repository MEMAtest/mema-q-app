import React from 'react';

// The Stepper component receives three props:
// 1. 'sections' - An array of objects, where each object has a 'title'.
// 2. 'currentSectionIndex' - A number indicating the user's current position.
// 3. 'onStepClick' - A function to call when a user clicks on a step.
const Stepper = ({ sections, currentSectionIndex, onStepClick }) => {
  return (
    // The <ol> element acts as the container for our stepper.
    <ol className="stepper">
      {sections.map((section, index) => {
        // Determine the CSS class for the current step.
        const isCompleted = index < currentSectionIndex;
        const isActive = index === currentSectionIndex;

        let stepClass = 'step';
        if (isActive) {
          stepClass += ' active';
        } else if (isCompleted) {
          stepClass += ' completed';
        }

        return (
          <li
            key={section.id || index}
            className={stepClass}
            // The onClick handler allows users to navigate by clicking the stepper.
            onClick={() => onStepClick(index)}
          >
            <div className="dot" />
            <div className="label">{section.title}</div>
          </li>
        );
      })}
    </ol>
  );
};

export default Stepper;