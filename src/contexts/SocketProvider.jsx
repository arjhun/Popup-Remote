import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";
import RemoteConfig from "../config/Config";
import { getUser } from "../hooks/useLocalStorage";
import ConnectError from "../components/ConnectError";
const storedUser = getUser("user", null);

export const socket = io.connect(RemoteConfig.SERVER_URL, {
  extraHeaders: {
    clientType: "remote",
  },
  auth: { token: storedUser?.token },
});

export const SocketContext = React.createContext(null);

export function SocketProvider({ children }) {
  const [error, setError] = useState(false);

  useEffect(() => {
    const serverConnected = () => {
      setError(false);
    };
    const serverConnectErr = (err) => {
      setError(err.message);
    };

    socket.on("connect", serverConnected);
    socket.on("connect_error", serverConnectErr);
    return () => {
      socket.off("connect", serverConnected);
      socket.off("connect_error", serverConnectErr);
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {error && <ConnectError error={error} />}
      {children}
    </SocketContext.Provider>
  );
}