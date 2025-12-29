// lib/recommendations/index.js
// Centralized exports for recommendation modules

import { section1_scope } from './section1-scope.js';
import { section2_consumer } from './section2-consumer.js';
import { section3_identity } from './section3-identity.js';
import { section4_risk } from './section4-risk.js';
import { section5_channels } from './section5-channels.js';
import { section6_approval } from './section6-approval.js';

// Combine all sections into single recommendations object
const recommendations = {
  ...section1_scope,
  ...section2_consumer,
  ...section3_identity,
  ...section4_risk,
  ...section5_channels,
  ...section6_approval,
};

/**
 * Get recommendation for a specific question based on answer
 * @param {string} questionId - The question ID (e.g., "1.1", "2.3")
 * @param {string|array} answer - The user's answer
 * @param {object} questionData - Question metadata including type
 * @returns {object|null} Recommendation object or null
 */
export function getRecommendation(questionId, answer, questionData = {}) {
  const rec = recommendations[questionId];
  if (!rec) return null;

  // Handle yes/no questions
  if (questionData.type === 'yesno' && answer === 'No') {
    return rec.ifNo || null;
  }

  // Handle dropdown/multiselect questions
  if (rec.ifSelected && answer) {
    // For multiselect, check each selected value
    if (Array.isArray(answer)) {
      for (const selected of answer) {
        if (rec.ifSelected[selected]) {
          return rec.ifSelected[selected];
        }
      }
    } else {
      // For dropdown, check the single value
      if (rec.ifSelected[answer]) {
        return rec.ifSelected[answer];
      }
    }
  }

  return null;
}

/**
 * Get all recommendations for a set of answers
 * @param {object} answers - Object of answers keyed by question ID
 * @param {array} checklistData - The full checklist data array
 * @returns {array} Array of recommendation objects with question context
 */
export function getAllRecommendations(answers, checklistData) {
  const allRecs = [];

  checklistData.forEach(section => {
    section.items.forEach(item => {
      const answer = answers[item.id]?.answer;
      if (!answer) return;

      const rec = getRecommendation(item.id, answer, item);
      if (rec) {
        allRecs.push({
          questionId: item.id,
          question: item.question,
          section: section.title,
          sectionId: section.id,
          fcaRef: item.ref,
          answer: answer,
          recommendation: rec
        });
      }
    });
  });

  // Sort by priority: critical > high > medium > low
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  allRecs.sort((a, b) => {
    return (priorityOrder[a.recommendation.priority] || 3) - (priorityOrder[b.recommendation.priority] || 3);
  });

  return allRecs;
}

/**
 * Get priority badge color and label
 * @param {string} priority - Priority level
 * @returns {object} Object with color and label
 */
export function getPriorityInfo(priority) {
  const priorities = {
    critical: { color: '#DC2626', bg: 'rgba(220, 38, 38, 0.1)', label: 'Critical - Immediate Action Required' },
    high: { color: '#D97706', bg: 'rgba(217, 119, 6, 0.1)', label: 'High Priority' },
    medium: { color: '#2563EB', bg: 'rgba(37, 99, 235, 0.1)', label: 'Medium Priority' },
    low: { color: '#059669', bg: 'rgba(5, 150, 105, 0.1)', label: 'Best Practice' }
  };
  return priorities[priority] || priorities.medium;
}

export default recommendations;
