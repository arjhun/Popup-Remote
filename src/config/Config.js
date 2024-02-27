const RemoteConfig = {
  APP_NAME: "Popup Remote",
  SERVER_URL: import.meta.env.VITE_CONN_STR || "http://localhost:3005",
  DEV: import.meta.env.DEV,
  PASSWORD_STR:
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{12,20}$",
  PASSWORD_MESSAGE:
    "Minimum 12, maximum 20 characters containing lowercase, uppercase, at least one number and one special character(@$!%*?&)",
};

export default RemoteConfig;
