import React from "react";
import { socket } from "../contexts/SocketProvider";

export default function Remote() {
  function handleHidePopup() {
    socket.emit("hide");
  }

  function handleShowPopup() {
    socket.emit("repeatPopup");
  }

  return (
    <div>
      <h2>Remote Control:</h2>
      <button onClick={handleHidePopup}>
        <i className="fa-solid fa-eye"></i> Hide
      </button>
      <button onClick={handleShowPopup}>
        <i className="fa-solid fa-repeat"></i> Repeat
      </button>
    </div>
  );
}
