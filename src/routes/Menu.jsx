import { React, useContext, useState, useEffect } from "react";
import "../App.css";
import ConnectError from "../components/ConnectError";
import { Link, useNavigate } from "react-router-dom";
import RemoteConfig from "../config/Config";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../hooks/useAuth";

export default function Menu() {
  const socket = useSocket();
  const [endPointConnected, setEndPointConnected] = useState(false);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = RemoteConfig.APP_NAME;
    socket.on("endpointConnected", (status) => {
      console.log("endpointconnected", status);
      setEndPointConnected(status);
    });

    socket.on("connect_error", (err) => {
      setError(err.message);
      if (err.message.includes("TokenExpiredError")) logout();
    });

    socket.emit("init");

    return () => {
      socket.off("endpointConnected");
      socket.off("connect_error");
    };
  }, []);

  function prompt(e) {
    e.preventDefault();
    if (confirm()) {
      navigate("/logout");
    }
  }

  return (
    <div className="menu-wrapper">
      {error && <ConnectError error={error} />}
      <div className="menu">
        <ul className="routes">
          <li className="logo">
            <strong>
              {RemoteConfig.APP_NAME}
              {RemoteConfig.DEV && " (DEV)"}
            </strong>
          </li>
          <li>
            <Link to={`/dashboard`}>
              <i className="fa-solid fa-calendar"></i> Sessions
            </Link>
          </li>
        </ul>
        <ul className="extra">
          <li>Hi, {user.name}!</li>
          <li>
            <Link to={`admin`}>
              <i className="fa-solid fa-user"></i> Users
            </Link>
          </li>
          <li>
            <Link onClick={(e) => prompt(e)} to={`/logout`}>
              <i className="fa-solid fa-sign-out"></i> logout
            </Link>
          </li>
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
    </div>
  );
}
