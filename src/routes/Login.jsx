import React, { useRef, useState } from "react";
import { Form } from "react-router-dom";
import Page from "../components/Page";
import RemoteConfig from "../config/Config";
import "./Login.css";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../components/LoadingButton";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const username = useRef();
  const password = useRef();
  const { user, login } = useAuth();
  const socket = useSocket();

  function handleChange() {}

  async function handleSubmit() {
    const promise = new Promise((resolve, reject) => {
      if (username.current.value === "" || password.current.value === "")
        reject();
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        username: username.current.value,
        password: password.current.value,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(RemoteConfig.SERVER_URL + "/authenticate", requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.json();
        })
        .then((result) => {
          socket.auth.token = result.token;
          if (!socket.connected) {
            socket.connect();
          }
          login(result);
          resolve();
        })
        .catch((error) => {
          reject(error.statusText);
        });
    });
    return toast.promise(promise, {
      pending: "Authenticating",
      success: "Login Succesful 👌",
      error: "Login Error 🤯",
    });
  }

  return (
    <Page title={"Login!"}>
      <div className="login-wrapper">
        <div className="login-form-wrapper">
          <h1>Popup Remote!</h1>
          <Form>
            <input
              onChange={handleChange}
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
            <LoadingButton doAction={handleSubmit}>Login</LoadingButton>
          </Form>
        </div>
      </div>
    </Page>
  );
}
