import { io } from "socket.io-client";
import React from "react";
import RemoteConfig from "../config/Config";

export const socket = io.connect(RemoteConfig.SERVER_URL, {
  extraHeaders: {
    clientType: "remote",
  },
});

export const SocketContext = React.createContext();