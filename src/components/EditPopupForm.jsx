import React, { useState, useRef } from "react";
import { socket } from "../contexts/SocketProvider";

export default function EditPopupForm(props) {
  const {sessionId, popup, onCancelClick } = props;
  const [isSending, setIsSending] = useState(false);
  const popupRef = useRef();

  function handleEditPopup() {
    const popupContent = popupRef.current.value;
    if (!popupContent) return;
      socket.emit(
        "updatePopup",
        sessionId,
        { ...popup, content: popupContent },
        (succes) => {
          if (succes) {
            resetInput();
          }
        }
      );
    }

    function handleChange(){}

  return (
    <div className="CreatePopup">
      <textarea ref={popupRef} cols="60" rows="10" defaultValue={popup.content} onChange={handleChange}/>
      <br />
      <button style={{marginRight: "10px"}}
        className="edditButton"
        disabled={isSending}
        onClick={handleEditPopup}
      >
        Edit
      </button>
      
      <button
        className="cancelButton"
        disabled={isSending}
        onClick={onCancelClick}
      >
        Cancel
      </button>
    </div>
  );
}
