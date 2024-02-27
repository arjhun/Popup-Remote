import React, { useEffect } from "react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import axios from "axios";
import RemoteConfig from "../config/Config";

axios.defaults.baseURL = RemoteConfig.SERVER_URL;

const apiAxios = axios.create();

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
  try {
    const user = getUser();
    if (user?.refreshToken) {
      const response = await apiAxios.post("/refresh", {
        refreshToken: user.refreshToken,
      });
      newTokens = response.data;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
  return newTokens;
}

// Axios interceptor to handle expired tokens
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && getUser() !== null) {
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

const getUser = () => {
  return JSON.parse(window.localStorage.getItem("user"));
};

const setUser = (value) => {
  window.localStorage.setItem("user", JSON.stringify(value));
};
