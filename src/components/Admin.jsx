import { useAuth } from "../hooks/useAuth";

export default function Admin({ children }) {
  const { user } = useAuth();
  if (user.role === "admin") return children;
}
