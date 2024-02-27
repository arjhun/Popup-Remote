import { React, useContext, useState, useEffect } from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import RemoteConfig from "../config/Config";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../hooks/useAuth";
import Admin from "./Admin";
export default function Menu() {
  const socket = useSocket();
  const [endPointConnected, setEndPointConnected] = useState(false);

  const { user, logout } = useAuth();

  useEffect(() => {
    function serverDisconnect() {
      setEndPointConnected(false);
    }
    socket.on("disconnect", serverDisconnect);
    document.title = RemoteConfig.APP_NAME;
    socket.on("endpointConnected", (status) => {
      setEndPointConnected(status);
    });

    return () => {
      socket.off("endpointConnected");
      socket.off("disconnect", serverDisconnect);
    };
  }, []);

  function prompt(e) {
    e.preventDefault();
    if (confirm("Are you sure you want to logout?")) {
      logout();
    }
  }

  return (
    <div className="menu-wrapper">
      <div className="menu">
        <ul>
          <li className="logo">
            <strong>
              {RemoteConfig.APP_NAME}
              {RemoteConfig.DEV && " (DEV)"}
            </strong>
          </li>
        </ul>
        <ul className="routes">
          <li>
            <Link to={`/dashboard`}>
              <i className="fa-solid fa-calendar"></i> Sessions
            </Link>
          </li>
          <Admin>
            <li>
              <Link to={`users`}>
                <i className="fa-solid fa-users"></i> Users
              </Link>
            </li>
          </Admin>
        </ul>
        <ul className="extra">
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <i className="fa-solid fa-user"></i>{" "}
              {user.firstName || user.username}
            </a>
            <ul>
              <li>
                <Link to={`profile/${user.id}`}>
                  <i className="fa-solid fa-user"></i> Profile
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
                <Link onClick={(e) => prompt(e)} to={`/logout`}>
                  <i className="fa-solid fa-sign-out"></i> logout
                </Link>
              </li>
            </ul>
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
