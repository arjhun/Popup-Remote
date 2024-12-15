import { useEffect } from "react";
import { socket } from "../contexts/SocketProvider";
import { useAuth } from "../hooks/useAuth";

export default function Logout() {
  const { logout } = useAuth();
  useEffect(() => {
    socket.close();
    logout();
  });

  return <div>Logged out!</div>;
}
