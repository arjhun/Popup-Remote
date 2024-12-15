import axios from "axios";
import React, { useRef, useState } from "react";
import { Form, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import RemoteConfig from "../config/Config";
import { useAuth } from "../hooks/useAuth.js";
import "./Login.css";

export default function LoginForm() {
  const username = useRef();
  const password = useRef();
  const { login } = useAuth();
  const [currentPopup, setCurrentPopup] = useState();
  const [error, setError] = useState();

  async function handleSubmit() {
    axios
      .post(RemoteConfig.SERVER_URL + "/authenticate", {
        username: username.current.value,
        password: password.current.value,
      })
      .then(({ data }) => {
        login(data);
        return Promise.resolve(data);
      })
      .catch((err) => {
        switch (err.response.status) {
          case 401:
            setError("Login failed!");
            break;
          case 429:
            setError("Please try again later!");
            break;
          default:
            setError("Server error!");
            break;
        }
      });
  }
  return (
    <div>
      <h3>Welcome! Please login</h3>
      <Form onSubmit={handleSubmit}>
        <input
          ref={username}
          type="text"
          id="username"
          placeholder="Username"
          autoComplete="username"
          required
        ></input>
        <input
          ref={password}
          type="password"
          id="password"
          autoComplete="current-password"
          placeholder="Password"
          title={RemoteConfig.PASSWORD_MESSAGE}
          required
        ></input>
        <button type="submit">Submit</button>
        {error && <div className="error">{error}</div>}
      </Form>
      <p>
        <Link to={"reset-request"}>Forgot your password?</Link>
      </p>
    </div>
  );
}
