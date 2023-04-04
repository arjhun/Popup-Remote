import { useState } from "react";

export const getUser = (keyName, defaultValue) => {
  try {
    const value = window.localStorage.getItem(keyName);
    if (value) {
      return JSON.parse(value);
    } else {
      window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
      return defaultValue;
    }
  } catch (err) {
    return defaultValue;
  }
};

export default function tokenExpired(token = {}) {
  if (Date.now() >= exp * 1000) {
    return false;
  }
}

export const useLocalStorage = (keyName, defaultValue) => {
  const user = getUser(keyName, defaultValue);
  const [storedValue, setStoredValue] = useState(user);
  const setValue = (newValue) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {}
    setStoredValue(newValue);
  };
  return [storedValue, setValue];
};
