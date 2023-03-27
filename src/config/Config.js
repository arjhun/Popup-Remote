const RemoteConfig = {
  APP_NAME: "Popup Remote",
  SERVER_URL: import.meta.env.VITE_CONN_STR || "http://localhost:3005",
  DEV: import.meta.env.DEV,
};

export default RemoteConfig;
