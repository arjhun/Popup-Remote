import React from "react";
import RemoteConfig from "../config/Config";

import "./ConnectError.css";

export default function ConnectError() {
  return (
    <div className="connectError">
      No Connection @:{RemoteConfig.SERVER_URL},{" "}
      <span className="blink">Reconnecting...</span>
    </div>
  );
}
