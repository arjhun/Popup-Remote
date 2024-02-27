import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ErrorPage from "./routes/ErrorPage";
import Session, { loader as sessionLoader } from "./routes/Session";
import Sessions, { loader as sessionsLoader } from "./routes/Sessions";
import User, { loader as usersLoader } from "./routes/Users";
import {
  loader as profileLoader,
  action as editProfileAction,
} from "./routes/Profile";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./routes/Login";
import Logout from "./routes/Logout";
import Dashboard from "./routes/Dashboard";
import UserAdd, { action as addUserAction } from "./routes/UserAdd";
import UserEdit, {
  loader as userLoader,
  action as editUserAction,
} from "./routes/UserEdit";
import Home from "./routes/Home";
import Profile from "./routes/Profile";
import TimeAgo from "javascript-time-ago";
import { ToastContainer } from "react-toastify";
import en from "javascript-time-ago/locale/en.json";
import nl from "javascript-time-ago/locale/nl.json";
import ResetRequest from "./routes/ResetRequest";
import LoginForm from "./routes/LoginForm";
import ResetPassword, {
  action as resetPasswordAction,
} from "./routes/ResetPassword";

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
