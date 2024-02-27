import React from "react";

export default function BigListActions(props) {
  return <div className="actions">{props.children}</div>;
}

export function BigListActionButton({ icon, onClick }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <i className={icon}></i>
    </button>
  );
}
