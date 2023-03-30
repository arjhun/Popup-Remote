import React, { useRef } from "react";
import { Form } from "react-router-dom";
import Page from "../components/Page";
import "./Login.css";
export default function Login() {
  const username = useRef();
  const password = useRef();

  const handleSubmit = () => {};

  return (
    <Page title={"Login!"}>
      <div className="login-wrapper">
        <Form onSubmit={handleSubmit}>
          <input
            ref={username}
            type="text"
            id="username"
            placeholder="Username"
          ></input>
          <input
            ref={password}
            type="password"
            id="password"
            placeholder="Password"
          ></input>
          <button type="submit">Login</button>
        </Form>
      </div>
    </Page>
  );
}
