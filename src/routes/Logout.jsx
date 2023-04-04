import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { socket } from "../contexts/SocketProvider";

export default function Logout() {
  const { logout } = useAuth();
  useEffect(() => {
    //socket.close();
    logout();
  });

  return <div>Logged out!</div>;
}
