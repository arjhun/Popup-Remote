import React from "react";
import RemoteConfig from "../config/Config";

import "./ConnectError.css";

export default function ConnectError({ error }) {
  return (
    <div className="connectError">
      No Connection @:{RemoteConfig.SERVER_URL} <small>({error})</small>
    </div>
  );
}
