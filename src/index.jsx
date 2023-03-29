import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./routes/App";
import ErrorPage from "./routes/ErrorPage";
import Sessions from "./routes/Sessions";
import Session, { loader } from "./routes/Session";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SocketContext, socket } from "./contexts/SocketContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Sessions /> },
          {
            path: "session/:currentSessionId",
            element: <Session />,
            loader: loader,
          },
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <SocketContext.Provider value={socket}>
      <RouterProvider router={router} />
    </SocketContext.Provider>
  </React.StrictMode>
);
