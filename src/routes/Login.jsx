import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Page from "../components/Page";
import "./Login.css";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { user } = useAuth();
  return (
    <>
      {user !== null ? (
        <Navigate to={"/dashboard"} replace="true" />
      ) : (
        <Page title={"Login"}>
          <div className="login-wrapper">
            <div className="login-form-wrapper">
              <h1>Popup Remote!</h1>
              <Outlet />
            </div>
          </div>
        </Page>
      )}
    </>
  );
}
