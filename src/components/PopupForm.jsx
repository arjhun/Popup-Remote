import React, { useState, useRef } from "react";
import { socket } from "../contexts/SocketProvider";

export default function PopupForm({ sessionId, popup, onCancel = () => {} }) {
  const [isSending, setIsSending] = useState(false);
  const contentRef = useRef();
  const titleRef = useRef();

  function resetInput() {
    contentRef.current.value = "";
    titleRef.current.value = "";
  }

  function handlePopup() {
    const popupContent = contentRef.current.value;
    if (!popup) {
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
    } else {
      const popupContent = contentRef.current.value;
      if (!popupContent) return;
      socket.emit(
        "updatePopup",
        sessionId,
        { ...popup, content: popupContent, title: titleRef.current.value },
        (succes) => {
          if (succes) {
            resetInput();
          }
        }
      );
    }
  }

  function handleCancel() {
    resetInput();
    onCancel();
  }

  return (
    <div className="popup-form">
      <input placeholder="Title" ref={titleRef} defaultValue={popup?.title} />
      <textarea
        placeholder="content"
        ref={contentRef}
        cols="60"
        rows="10"
        defaultValue={popup?.content}
      />
      <br />
      <button className="addButton" disabled={isSending} onClick={handlePopup}>
        {popup ? "Edit" : "Add"}
      </button>
      <button className="cancelButton" onClick={handleCancel}>
        Cancel
      </button>
    </div>
  );
}
