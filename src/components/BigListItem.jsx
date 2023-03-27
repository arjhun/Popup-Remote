import React, { useState } from "react";

export default function BigListItem(props) {
  const {
    shouldFilter,
    filterOperation,
    selected,
    highlight,
    handleClick = () => {},
    actions,
    content,
  } = props;
  if (shouldFilter && filterOperation()) return <></>;
  return (
    <li className={selected ? "selected" : ""}>
      {actions}
      <div
        className={`content ${highlight ? "highlight " : ""}`}
        onClick={() => {
          handleClick();
        }}
      >
        {content}
      </div>
    </li>
  );
}
