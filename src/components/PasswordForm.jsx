import React, { useRef, useEffect } from "react";
import { Form } from "react-router-dom";
import RemoteConfig from "../config/Config";

export default function PasswordForm({ errors }) {
  const password = useRef();
  const newPassword = useRef();
  const form = useRef();

  useEffect(() => {
    if (!errors?.password) {
      password.current.value = "";
      newPassword.current.value = "";
    } else {
      password.current.setCustomValidity(password.current.title);
      password.current.reportValidity();
    }
  }, [errors]);

  return (
    <div className="userform">
      <Form method="post" ref={form}>
        <h2>Change Password</h2>
        <label htmlFor="oldPassword">
          Old password
          <input
            ref={password}
            name="password"
            type="password"
            title="Please enter a correct password!"
            onInput={(e) => {
              e.target.setCustomValidity("");
            }}
            required
          ></input>
        </label>

        <label htmlFor="newPassword">
          New password
          <input
            ref={newPassword}
            name="newPassword"
            type="password"
            pattern={RemoteConfig.PASSWORD_STR}
            title={RemoteConfig.PASSWORD_MESSAGE}
          ></input>
        </label>
        <button type="submit" name="action" value="password">
          Update
        </button>
      </Form>
    </div>
  );
}
