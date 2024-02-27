import React, { useRef, useState } from "react";
import { Form, Link } from "react-router-dom";
import RemoteConfig from "../config/Config";
import "./Login.css";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

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
            setError("Wrong username or password!");
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
          required
        ></input>
        <input
          ref={password}
          type="password"
          id="password"
          placeholder="Password"
          title={RemoteConfig.PASSWORD_MESSAGE}
          required
        ></input>
        {/* <LoadingButton doAction={handleSubmit}>Login</LoadingButton> */}
        <button type="submit">Submit</button>
        {error && <div className="error">{error}</div>}
      </Form>
      <p>
        <Link to={"reset-request"}>Forgot your password?</Link>
      </p>
    </div>
  );
}
