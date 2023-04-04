import React from "react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const AuthContext = React.createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  async function login(data) {
    await setUser(data);
    navigate("/dashboard");
  }

  function logout() {
    setUser(null);
    navigate("/login");
  }

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
