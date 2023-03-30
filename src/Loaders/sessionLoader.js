import { socket } from "../contexts/SocketProvider";

export async function loader({ params }) {
  let session = await new Promise((resolve) => {
    socket.emit("getSession", params.currentSessionId, (data) => {
      resolve(data);
    });
  });
  if (session == null)
    throw new Response("Not Found", {
      status: 404,
      statusText: "Session not found!",
    });
  return session;
}
