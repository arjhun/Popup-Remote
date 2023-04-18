import React from "react";
import { AuthProvider } from "./contexts/AuthProvider";
import { SocketProvider } from "./contexts/SocketProvider";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <AuthProvider>
      <Outlet />
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
