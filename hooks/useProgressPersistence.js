// hooks/useProgressPersistence.js
// Handles saving and loading assessment progress

import { useState, useEffect, useCallback } from 'react';

export function useProgressPersistence({
  sessionId,
  questions,
  answers,
  currentSection,
  currentQuestion,
  setAnswers,
  setCurrentSection,
  setCurrentQuestion,
}) {
  const [progressLoaded, setProgressLoaded] = useState(false);

  // Load progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      if (!sessionId || questions.length === 0 || progressLoaded) return;

      try {
        const response = await fetch(`/api/load-progress?sessionId=${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.answers) {
            setAnswers(data.answers);
          }
        }

        // Restore position from localStorage
        if (typeof window !== 'undefined') {
          const savedPosition = window.localStorage.getItem('mema-position');
          if (savedPosition) {
            const pos = JSON.parse(savedPosition);
            if (typeof pos.section === 'number' && pos.section < questions.length) {
              setCurrentSection(pos.section);
            }
            if (typeof pos.question === 'number') {
              const maxQ = questions[pos.section]?.items?.length || 0;
              if (pos.question < maxQ) {
                setCurrentQuestion(pos.question);
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to load progress:', error);
      } finally {
        setProgressLoaded(true);
      }
    };

    loadProgress();
  }, [sessionId, questions, progressLoaded, setAnswers, setCurrentSection, setCurrentQuestion]);

  // Save progress on answers change (debounced)
  useEffect(() => {
    if (!sessionId || !progressLoaded) return;

    const timeout = setTimeout(async () => {
      try {
        await fetch('/api/save-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            currentSection,
            currentQuestion,
            answers,
          }),
        });
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    }, 750);

    return () => clearTimeout(timeout);
  }, [answers, sessionId, currentSection, currentQuestion, progressLoaded]);

  // Save position to localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || !progressLoaded) return;
    window.localStorage.setItem('mema-position', JSON.stringify({
      section: currentSection,
      question: currentQuestion
    }));
  }, [currentSection, currentQuestion, progressLoaded]);

  return { progressLoaded };
}

export default useProgressPersistence;
