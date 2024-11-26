import React, { createContext, useState, useContext, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

// Create ScheduledSession Context
const ScheduledSessionContext = createContext();

// Provider Component
export const ScheduledSessionProvider = ({ children }) => {
  const clearSession = () => setSession(null);
  const [storedScheduledSession, setStoredScheduledSession] =
    useLocalStorage("scheduledSession");
  const [scheduledSession, setSession] = useState(storedScheduledSession);

  const updateScheduledSession = (newSession) => {
    setStoredScheduledSession(newSession);
    setSession(newSession);
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
