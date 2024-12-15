import React from "react";
import { Link } from "react-router-dom";

export default function PageHeader({
  children,
  title,
  buttonTo = null,
  buttonText = null,
}) {
  return (
    <header>
      <h1>{title}</h1>
      {children}
      {buttonTo && (
        <Link to={buttonTo} className="btn addUser">
          <i className="fa-solid fa-plus"></i> {buttonText}
        </Link>
      )}
    </header>
  );
}
