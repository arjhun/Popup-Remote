import React, { useState, useRef } from "react";
import { socket } from "../contexts/SocketProvider";

export default function CreatePopupForm(props) {
  const {sessionId } = props;
  const [isSending, setIsSending] = useState(false);
  const newPopupRef = useRef();

  function handleAddPopup() {
    const popupContent = newPopupRef.current.value;
    if (!popupContent) return;
      socket.emit(
        "addPopup",
        sessionId,
        { content: popupContent },
        (success) => {
          if (success) {
            resetInput();
          }
        }
      );
    }

  return (
    <div className="CreatePopup">
      <textarea ref={newPopupRef} cols="60" rows="10"></textarea>
      <br />
      <button
        className="addButton"
        disabled={isSending}
        onClick={handleAddPopup}
      >
        Add
      </button>
    </div>
  );
}
