import React, { useEffect, useRef } from "react";
import { Form } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function UserForm(props) {
  const {
    data = {},
    button = "Submit",
    passwordRequired = true,
    disabled,
  } = props;

  const { user } = useAuth();
  const form = useRef();
  const username = useRef();
  const firstName = useRef();
  const lastName = useRef();
  const email = useRef();
  const submit = useRef();
  const password = useRef();
  const newPassword = useRef();

  useEffect(() => {
    form.current.reset();
  }, [data.username]);

  return (
    <div className="userform">
      <Form method="post" ref={form}>
        <div className="userform-content">
          <label htmlFor="username">
            Username
            <input
              required
              minLength={4}
              ref={username}
              type="text"
              name="username"
              defaultValue={data?.username}
            ></input>
          </label>
          <div className="nameWrapper">
            <div className="nameWrapperSingle">
              <label htmlFor="firstName">
                First Name <small>(Optional)</small>
                <input
                  ref={firstName}
                  name="firstName"
                  type="text"
                  defaultValue={data.firstName}
                ></input>
              </label>
            </div>
            <div className="nameWrapperSingle">
              <label htmlFor="lastName">
                Last Name <small>(Optional)</small>
                <input
                  ref={lastName}
                  name="lastName"
                  type="text"
                  defaultValue={data.lastName}
                ></input>
              </label>
            </div>
          </div>
          <label htmlFor="email">
            Email
            <input
              ref={email}
              name="email"
              type="email"
              title="Please enter a valid email adress!"
              defaultValue={data.email}
              required
            ></input>
          </label>
          {user.role !== "admin" && (
            <label htmlFor="oldPassword">
              Old password
              <input
                ref={password}
                name="oldPassword"
                type="password"
                title="Please enter a correct password!"
                onInput={(e) => {
                  e.target.setCustomValidity("");
                }}
              ></input>
            </label>
          )}
          <label htmlFor="newPassword">
            Password
            <input
              required={passwordRequired}
              ref={newPassword}
              name="password"
              type="password"
              pattern="^(?=.{8,20}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*"
              title="Minimum 12, maximum 20 characters containing lowercase, uppercase, at least one number and one special character(!£$%^&)"
            ></input>
          </label>
        </div>
        <button
          type="submit"
          name="action"
          value="user"
          ref={submit}
          disabled={disabled}
        >
          {button}
        </button>
      </Form>
    </div>
  );
}
