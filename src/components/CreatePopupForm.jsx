import React, { useState, useRef } from "react";
import { socket } from "../contexts/SocketProvider";
import { useEffect } from "react";

export default function CreatePopupForm(props) {
  const { popup, sessionId } = props;
  const [isSending, setIsSending] = useState(false);
  const [currentPopup, setCurrentPopup] = useState(popup);
  const newPopupRef = useRef();

  useEffect(() => {
    setCurrentPopup(popup);
    newPopupRef.current.value = popup?.content ? popup.content : "";
  }, [popup]);

  function resetInput() {
    setCurrentPopup(null);
    newPopupRef.current.value = "";
  }

  function handleAddPopup() {
    const popupContent = newPopupRef.current.value;
    if (!popupContent) return;
    if (currentPopup) {
      socket.emit(
        "updatePopup",
        sessionId,
        { ...currentPopup, content: popupContent },
        (succes) => {
          if (succes) {
            resetInput();
          }
        }
      );
    } else {
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
  }

  let buttonText = !currentPopup ? "Add" : "Edit";

  return (
    <div className="CreatePopup">
      <h2>{currentPopup ? "Edit" : "Create"} a popup:</h2>
      <textarea ref={newPopupRef} cols="60" rows="10"></textarea>
      <br />
      <button
        className="addButton"
        disabled={isSending}
        onClick={handleAddPopup}
      >
        {buttonText}
      </button>
      {currentPopup && (
        <button onClick={() => resetInput()} className="cancelButton">
          cancel
        </button>
      )}
    </div>
  );
}
