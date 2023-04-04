import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ErrorPage from "./routes/ErrorPage";
import Sessions from "./routes/Sessions";
import Session from "./routes/Session";
import Admin from "./routes/Admin";
import { loader as sessionLoader } from "./routes/Session";
import { loader as sessionsLoader } from "./routes/Sessions";
import { loader as usersLoader } from "./routes/Admin";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./routes/Login";
import Logout from "./routes/Logout";
import Dashboard from "./routes/Dashboard";
import Home from "./routes/Home";

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
        path: "admin",
        element: <Admin />,
        loader: usersLoader,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
