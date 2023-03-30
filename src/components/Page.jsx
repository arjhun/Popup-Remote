import React from "react";
import { useEffect } from "react";
import RemoteConfig from "../config/Config";

export default function Page({ children, title }) {
  useEffect(() => {
    document.title = RemoteConfig.APP_NAME + (title ? " - " + title : "");
  });
  return <>{children}</>;
}
