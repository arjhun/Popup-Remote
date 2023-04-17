import { useState } from "react";

export const getUser = () => {
  try {
    const value = window.localStorage.getItem("user");
    if (value) {
      return JSON.parse(value);
    } else {
      window.localStorage.setItem(keyName, JSON.stringify(null));
      return null;
    }
  } catch (err) {
    return null;
  }
};

export const useLocalStorage = () => {
  const user = getUser();
  const [storedValue, setStoredValue] = useState(user);
  const setValue = (newValue) => {
    try {
      window.localStorage.setItem("user", JSON.stringify(newValue));
    } catch (err) {}
    setStoredValue(newValue);
  };
  return [storedValue, setValue];
};
