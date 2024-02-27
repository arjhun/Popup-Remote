import React from "react";
import "./BigList.css";
import { StrictModeDroppable } from "./StrictModeDroppable";

export default function BigList(props) {
  const { title, filterLabel, filterState } = props;

  function handleFilter(e) {
    filterState(e.target.checked);
  }

  return (
    <div className="biglist">
      {filterLabel && (
        <div className="biglist-header">
          {title && <div className="title">{title}</div>}
          <div className="options">
            <span>
              <strong>Filter:</strong>
            </span>
            <label htmlFor="filter">{filterLabel}</label>
            <input
              name="filter"
              id="filter"
              type="checkbox"
              onChange={handleFilter}
            />
          </div>
        </div>
      )}
      <StrictModeDroppable droppableId="sessionList">
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {props.children}
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </div>
  );
}
