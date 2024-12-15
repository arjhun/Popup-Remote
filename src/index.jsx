import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import nl from "javascript-time-ago/locale/nl.json";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import App from "./App";
import "./index.css";
import {
  AccountVerification,
  loader as verifyLoader,
} from "./routes/AccountVerification.jsx";
import Dashboard from "./routes/Dashboard";
import ErrorPage from "./routes/ErrorPage";
import Home from "./routes/Home";
import Login from "./routes/Login";
import LoginForm from "./routes/LoginForm";
import Logout from "./routes/Logout";
import Profile, {
  action as editProfileAction,
  loader as profileLoader,
} from "./routes/Profile";
import ResetPassword, {
  action as resetPasswordAction,
} from "./routes/ResetPassword";
import ResetRequest from "./routes/ResetRequest";
import Session, { loader as sessionLoader } from "./routes/Session";
import Sessions, { loader as sessionsLoader } from "./routes/Sessions";
import UserAdd, { action as addUserAction } from "./routes/UserAdd";
import UserEdit, {
  action as editUserAction,
  loader as userLoader,
} from "./routes/UserEdit";
import User, { loader as usersLoader } from "./routes/Users";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(nl);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { element: <Home />, index: true },
      {
        path: "/login",
        element: <Login />,
        children: [
          { index: true, element: <LoginForm /> },
          { path: "reset-request", element: <ResetRequest /> },
          {
            path: "verify",
            element: <AccountVerification />,
            loader: verifyLoader,
          },
          {
            path: "password-reset",
            element: <ResetPassword />,
            action: resetPasswordAction,
          },
        ],
      },
      { path: "/logout", element: <Logout /> },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <ErrorPage />,

    // and then put the children under this route:
    children: [
      {
        index: true,
        element: <Sessions />,
        loader: sessionsLoader,
      },
      {
        path: "session/:currentSessionId",
        element: <Session />,
        loader: sessionLoader,
      },
      {
        path: "users",
        children: [
          { index: true, element: <User />, loader: usersLoader },
          {
            path: "add",
            element: <UserAdd />,
            action: addUserAction,
          },
          {
            path: ":id/edit",
            element: <UserEdit />,
            loader: userLoader,
            action: editUserAction,
          },
        ],
      },
      {
        path: "profile/:id",
        element: <Profile />,
        loader: profileLoader,
        action: editProfileAction,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
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
    <RouterProvider router={router} />
  </React.StrictMode>
);
