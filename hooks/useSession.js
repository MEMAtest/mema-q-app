// hooks/useSession.js
// Manages session ID for progress persistence

import { useState, useEffect } from 'react';

export function useSession() {
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let storedSession = window.localStorage.getItem('mema-session-id');
    if (!storedSession) {
      if (window.crypto?.randomUUID) {
        storedSession = window.crypto.randomUUID();
      } else {
        storedSession = `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      }
      window.localStorage.setItem('mema-session-id', storedSession);
    }
    setSessionId(storedSession);
  }, []);

  return sessionId;
}

export default useSession;
