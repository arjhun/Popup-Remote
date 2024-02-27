import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";

export default function BigListItem(props) {
  const {
    id,
    index,
    shouldFilter,
    filterOperation,
    selected,
    highlight,
    isDragDisabled = false,
    handleClick = () => {},
    children,
  } = props;

  if (shouldFilter && filterOperation()) return <></>;
  return (
    <Draggable draggableId={id} index={index} isDragDisabled={isDragDisabled}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`biglistItem ${selected ? "selected" : ""}`}
        >
          <div
            className={`content ${highlight ? "highlight " : ""}`}
            onClick={() => {
              handleClick();
            }}
          >
            {children}
          </div>
        </div>
      )}
    </Draggable>
  );
}
