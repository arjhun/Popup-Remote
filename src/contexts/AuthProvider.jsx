import axios from "axios";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import RemoteConfig from "../config/Config";
import { useLocalStorage } from "../hooks/useLocalStorage";

axios.defaults.baseURL = RemoteConfig.SERVER_URL;

const refreshAxios = axios.create();

axios.interceptors.request.use((config) => {
  const user = getUser();
  if (user?.token) {
    config.headers["Authorization"] = "Bearer " + user.token;
  }
  config.headers["Content-Type"] = "application/json";
  return config;
});

async function refreshAccessToken() {
  let newTokens = null;
  const user = getUser();
  if (user?.refreshToken) {
    const response = await refreshAxios.post("/refresh", {
      refreshToken: user.refreshToken,
    });
    newTokens = response.data;
  }
  return newTokens;
}

// Axios interceptor to handle expired tokens
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && getUser() !== null) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        return refreshAccessToken()
          .then((newTokens) => {
            setUser(newTokens);
            originalRequest.headers.Authorization = `Bearer ${newTokens.token}`;
            return axios(originalRequest);
          })
          .catch((err) => {
            setUser(null);
            throw err;
          });
      }
    }
    return Promise.reject(error);
  }
);

export const AuthContext = React.createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage("user");
  const navigate = useNavigate();

  function login(data) {
    setUser(data);
    navigate("/dashboard");
  }

  function updateUser(newUserData) {
    setUser({ ...user, ...newUserData });
  }

  function logout() {
    setUser(null);
    navigate("/login");
  }

  const value = useMemo(
    () => ({
      user,
      updateUser,
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const getUser = () => {
  try {
    return JSON.parse(window.localStorage.getItem("user"));
  } catch (error) {
    window.localStorage.setItem("user", null);
    return null;
  }
};

const setUser = (value) => {
  window.localStorage.setItem("user", JSON.stringify(value));
};
