import React from "react";
import { useState } from "react";
import { Link, Form } from "react-router-dom";
import axios from "axios";
import { useRef } from "react";

export default function ResetRequest() {
  const [requested, setRequested] = useState(false);
  const email = useRef();
  const handleSubmit = async () => {
    axios
      .post("/reset-password", { email: email.current.value })
      .then((res) => {
        setRequested(true);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <>
      {!requested ? (
        <Form>
          <input ref={email} type="email" placeholder="Email" required></input>
          <button type="submit" onClick={handleSubmit}>
            Submit
          </button>
        </Form>
      ) : (
        <div>You'll receive an email shortly!</div>
      )}
      <p>
        <Link to={"/login"}>Back to login form</Link>
      </p>
    </>
  );
}
