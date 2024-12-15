import React, { useRef } from "react";
import { Form } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function UserForm(props) {
  const {
    data = {},
    button = "Submit",
    passwordRequired = true,
    disabled,
  } = props;

  const { user, updateUser } = useAuth();
  const formRef = useRef();
  const buttonRef = useRef();

  const handleChange = () => {
    buttonRef.current.disabled = "";
  };

  return (
    <div className="userform">
      <Form method="post" ref={formRef} onChange={handleChange}>
        <div className="userform-content">
          <label htmlFor="username">
            Username
            <input
              required
              minLength={4}
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
                name="oldPassword"
                type="password"
                title="Please enter a correct password!"
                onInput={(e) => {
                  e.target.setCustomValidity("");
                }}
              ></input>
            </label>
          )}
          {/* <label htmlFor="newPassword">
            Password
            <input
              required={passwordRequired}
              name="password"
              type="password"
              pattern="^(?=.{8,20}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*"
              title="Minimum 12, maximum 20 characters containing lowercase, uppercase, at least one number and one special character(!£$%^&)"
            ></input>
          </label> */}
        </div>
        <button
          ref={buttonRef}
          type="submit"
          name="action"
          value="user"
          disabled={"disabled"}
        >
          {button}
        </button>
      </Form>
    </div>
  );
}
