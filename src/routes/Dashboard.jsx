import { React } from "react";
import "../App.css";
import { Outlet } from "react-router-dom";
import Menu from "./Menu";
import { AuthProvider } from "../contexts/AuthProvider";
import { ToastContainer } from "react-toastify";

export default function Dashboard() {
  return (
    <AuthProvider>
      <div className="app">
        <Menu />
        <div className="wrapper">
          <Outlet />
        </div>
      </div>

      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </AuthProvider>
  );
}
