import { React } from "react";
import "../App.css";
import { Outlet } from "react-router-dom";
import Menu from "./Menu";
import { AuthProvider } from "../contexts/AuthProvider";
import { SocketProvider } from "../contexts/SocketProvider";
import { ProtectedRoute } from "./ProtectedRoute";

export default function Dashboard() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ProtectedRoute>
          <div className="app">
            <Menu />
            <div className="wrapper">
              <Outlet />
            </div>
          </div>
        </ProtectedRoute>
      </SocketProvider>
    </AuthProvider>
  );
}
