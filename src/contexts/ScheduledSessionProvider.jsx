import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

// Create ScheduledSession Context
const ScheduledSessionContext = createContext(null);

// Provider Component
export const ScheduledSessionProvider = ({ children }) => {
  const [storedScheduledSession, setStoredScheduledSession] =
    useLocalStorage("scheduledSession");
  const [scheduledSession, setSession] = useState(storedScheduledSession);

  const updateScheduledSession = (newSession) => {
    setStoredScheduledSession(newSession);
    setSession(newSession);
  };

  const clearSession = () => {
    updateScheduledSession(null);
  };

  useEffect(() => {
    setSession(storedScheduledSession);
  }, [storedScheduledSession]);

  return (
    <ScheduledSessionContext.Provider
      value={{ scheduledSession, updateScheduledSession, clearSession }}
    >
      {children}
    </ScheduledSessionContext.Provider>
  );
};

// Hook for consuming context
export const useScheduledSession = () => useContext(ScheduledSessionContext);
