import { React, useContext, useState, useEffect } from "react";
import "./Root.css";
import ConnectError from "../components/ConnectError";
import { Outlet, Link } from "react-router-dom";
import { SocketContext } from "../contexts/SocketContext";
import RemoteConfig from "../config/Config";

export default function Root() {
  const socket = useContext(SocketContext);
  const [connected, setConnected] = useState(socket.connected);
  const [endPointConnected, setEndPointConnected] = useState(false);

  useEffect(() => {
    document.title = RemoteConfig.APP_NAME;
    socket.on("endpointConnected", (status) => {
      setEndPointConnected(status);
    });

    socket.on("playing");

    socket.on("connect", () => {
      setConnected(true);
    });
    socket.on("disconnect", () => {
      setConnected(false);
      setEndPointConnected(false);
    });

    socket.emit("init");

    return () => {
      socket.off("endpointConnected");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket]);

  return (
    <div className="app">
      {!connected && <ConnectError />}
      <div className="menu">
        <ul className="routes">
          <li className="logo">
            <strong>
              {RemoteConfig.APP_NAME}
              {RemoteConfig.DEV && " (DEV)"}
            </strong>
          </li>
          <li>
            <Link to={`/`}>
              <i className="fa-solid fa-calendar"></i> Sessions
            </Link>
          </li>
        </ul>
        <ul className="extra">
          <li>
            <a
              title="The URL for obs"
              target={"_blank"}
              rel="noreferrer"
              href={RemoteConfig.SERVER_URL}
            >
              <i className="fa-solid fa-copy"></i> OBS endpoint
            </a>
          </li>
          <li>
            <span
              className={`label ${endPointConnected ? "green" : "red blink"}`}
            >
              {endPointConnected ? "On The Air" : "Not Running!"}
            </span>
          </li>
        </ul>
      </div>
      <div className="wrapper">
        <Outlet />
      </div>
    </div>
  );
}
