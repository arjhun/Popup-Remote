import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ErrorPage from "./routes/ErrorPage";
import Admin from "./routes/Admin";
import Session, { loader as sessionLoader } from "./routes/Session";
import Sessions, { loader as sessionsLoader } from "./routes/Sessions";
import { loader as usersLoader } from "./routes/Admin";
import {
  loader as profileLoader,
  action as editProfileAction,
} from "./routes/Profile";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./routes/Login";
import Logout from "./routes/Logout";
import Dashboard from "./routes/Dashboard";
import AddUser from "./routes/AddUser";
import Home from "./routes/Home";
import Profile from "./routes/Profile";
import { SocketProvider } from "./contexts/SocketProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { element: <Home />, index: true },
      { path: "/login", element: <Login /> },
      { path: "/logout", element: <Logout /> },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <ErrorPage />,
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
          { index: true, element: <Admin />, loader: usersLoader },
          {
            path: "add",
            element: <AddUser />,
          },
          {
            path: ":id/edit",
            element: <Profile />,
            loader: profileLoader,
            action: editProfileAction,
          },
        ],
      },
      {
        path: "profile",
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
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
  </React.StrictMode>
);
