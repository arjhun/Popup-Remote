import { io } from "socket.io-client";
import React, { useRef } from "react";
import RemoteConfig from "../config/Config";
import { getUser } from "../hooks/useLocalStorage";
import { useEffect } from "react";

const storedUser = getUser("user", null);

export const socket = io.connect(RemoteConfig.SERVER_URL, {
  extraHeaders: {
    clientType: "remote",
  },
  auth: { token: storedUser?.token },
});

export const SocketContext = React.createContext(null);

export function SocketProvider({ children }) {
  const socketRef = useRef(socket);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
}