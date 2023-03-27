import { Children } from "react";
import { React, useState, useCallback } from "react";
import { Link } from "react-router-dom";

import "./BigList.css";
import BigListItem from "./BigListItem";

export default function BigList(props) {
  const { filterLabel, filterState, noItemMessage = "No items yet!" } = props;

  function handleFilter(e) {
    filterState(e.target.checked);
  }

  return (
    <div className="biglist questionList">
      <div className="options">
        {
          <>
            <span>
              <strong>Filter:</strong>
            </span>
            <label htmlFor="filter">{filterLabel}</label>
            <input
              name="favFilter"
              id="favFilter"
              type="checkbox"
              onChange={handleFilter}
            />
          </>
        }
      </div>
      <ul>
        {props.children.length > 0 ? (
          props.children
        ) : (
          <li key="0">{noItemMessage}</li>
        )}
      </ul>
    </div>
  );
}
