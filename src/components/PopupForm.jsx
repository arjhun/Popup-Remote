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

  function handleAddPopup() {
    const shouldUpdate = popup !== undefined;
    const popupContent = contentRef.current.value;

    if (!popupContent) return;

    socket.emit(
      shouldUpdate ? "updatePopup" : "addPopup",
      sessionId,
      { ...popup, content: popupContent, title: titleRef.current?.value ?? "" },
      (success) => {
        if (success) {
          if (!shouldUpdate) resetInput();
        }
      }
    );
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
      <button
        className="addButton"
        disabled={isSending}
        onClick={handleAddPopup}
      >
        {popup ? "Edit" : "Add"}
      </button>
      <button className="cancelButton" onClick={handleCancel}>
        Cancel
      </button>
    </div>
  );
}
