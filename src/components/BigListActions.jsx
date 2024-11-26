import React from "react";

export default function BigListActions({ children }) {
  return <div className="actions">{children}</div>;
}

export function BigListActionButton({ icon, onClick, title }) {
  return (
    <button
      title={title}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <i className={icon}></i>
    </button>
  );
}
