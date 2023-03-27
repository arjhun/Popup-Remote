import React from "react";

export default function BigListActions(props) {
  return (
    <div className="actions">
      {props.children}
      {/* {handleFavField && (
        <button
          className={`favButton ${fav && "fav "}`}
          onClick={() => {
            handleFavField();
          }}
        >
          <i className="fa-solid fa-star" aria-hidden="true"></i>
        </button>
      )}
      {handleEditField && (
        <button
          className="editButton"
          onClick={() => {
            handleEditField();
          }}
        >
          <i className="fa-solid fa-pencil" aria-hidden="true"></i>
        </button>
      )}
      {handleDelField && (
        <button
          className="deleteButton"
          onClick={() => {
            handleDelField();
          }}
        >
          <i className="fa-solid fa-trash" aria-hidden="true"></i>
        </button>
      )}
      {handleReorderField && (
        <button className="sortUp" onClick={() => handleReorderField(-1)}>
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      )}
      {handleReorderField && (
        <button className="sortDown" onClick={() => handleReorderField(1)}>
          <i className="fa-solid fa-arrow-down"></i>
        </button>
      )} */}
    </div>
  );
}

export function BigListActionButton({ icon, highlight, onClick }) {
  return (
    <button onClick={() => onClick()}>
      <i className={icon}></i>
    </button>
  );
}
