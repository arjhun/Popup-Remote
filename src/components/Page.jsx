import React from "react";
import { useEffect } from "react";
import RemoteConfig from "../config/Config";

export default function Page({ children, title, className = ""}) {
  useEffect(() => {
    document.title = RemoteConfig.APP_NAME + (title ? " - " + title : "");
  });

  const classes = "page page-"+title.toString().toLowerCase().replace(" ", "-");

  return <div className={`${classes}${className && " "+className}`}>{children}</div>;
}
