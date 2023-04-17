import React from "react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage, getUser } from "../hooks/useLocalStorage";
import axios from "axios";
import RemoteConfig from "../config/Config";

axios.defaults.baseURL = RemoteConfig.SERVER_URL;

axios.interceptors.request.use((config) => {
  let token = getUser("user", null).token;

  if (token) {
    config.headers["Authorization"] = "Bearer " + token;
  }
  config.headers["Content-Type"] = "application/json";
  return config;
});

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

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
