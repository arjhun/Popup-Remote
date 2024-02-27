import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";
import RemoteConfig from "../config/Config";
import ConnectError from "../components/ConnectError";
import { useAuth } from "../hooks/useAuth";

export const socket = io(RemoteConfig.SERVER_URL, {
  autoConnect: false,
  extraHeaders: {
    clientType: "remote",
  },
  auth: { token: "" },
});

export const SocketContext = React.createContext(null);

export function SocketProvider({ children }) {
  const [error, setError] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const connect = () => {
      socket.auth.token = user.token;
      if (!socket.connected) {
        socket.connect();
      } else {
        socket.disconnect().connect();
      }
    };

    connect();

    const serverConnected = () => {
      setError(false);
    };
    const serverConnectErr = (err) => {
      setError(`${err.message}, please condider refreshing the page`);
    };
    const serverDisconnected = (reason) => {
      setError(
        `Socket disconnected. Reason:${reason}, please condider refreshing the page`
      );
    };
    socket.on("disconnect", serverDisconnected);
    socket.on("connect", serverConnected);
    socket.on("connect_error", serverConnectErr);
    return () => {
      socket.off("disconnect", serverDisconnected);
      socket.off("connect", serverConnected);
      socket.off("connect_error", serverConnectErr);
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {error && <ConnectError error={error} />}
      {children}
    </SocketContext.Provider>
  );
}