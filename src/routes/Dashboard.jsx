import { React } from "react";
import "../App.css";
import { Outlet } from "react-router-dom";
import Menu from "../components/Menu";
import CurrentSession from "../components/CurrentSession";
import { AuthProvider } from "../contexts/AuthProvider";
import { SocketProvider } from "../contexts/SocketProvider";
import { ScheduledSessionProvider } from "../contexts/ScheduledSessionProvider";

export default function Dashboard() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ScheduledSessionProvider>
          <div className="app">
            <Menu />
            <CurrentSession />
            <div className="wrapper">
              <Outlet />
            </div>
          </div>
        </ScheduledSessionProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
