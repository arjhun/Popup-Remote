import { React } from "react";
import "../App.css";
import { Outlet, useNavigation } from "react-router-dom";
import Menu from "../components/Menu";
import { AuthProvider } from "../contexts/AuthProvider";
import { SocketProvider } from "../contexts/SocketProvider";

export default function Dashboard() {
  return (
    <AuthProvider>
      <SocketProvider>
        <div className="app">
          <Menu />
          <div className="wrapper">
            <Outlet />
          </div>
        </div>
      </SocketProvider>
    </AuthProvider>
  );
}
