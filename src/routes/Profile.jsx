import React, { useRef, useEffect } from "react";
import { Form, useLoaderData, useActionData, redirect } from "react-router-dom";
import "./Profile.css";
import axios from "axios";
import { getUser } from "../hooks/useLocalStorage";
import { toast } from "react-toastify";
import RemoteConfig from "../config/Config";
import Page from "../components/Page.jsx";

export async function loader({ params }) {
  const user = getUser();
  let profile = await new Promise((resolve, reject) => {
    axios
      .request({
        method: "get",
        url: `/users/${params.id || user.id}`,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return profile;
}

export const action = async ({ params, request }) => {
  const user = getUser();
  let formData = await request.formData();
  let errors = {};
  return toast
    .promise(
      axios({
        method: "put",
        url: RemoteConfig.SERVER_URL + `/users/${params.id || user.id}`,
        data: formData,
      })
        .then((result) => {
          return Promise.resolve(result);
        })
        .catch((error) => {
          return Promise.reject(error);
        }),
      {
        pending: "Updating User",
        success: "User updated 👌",
        error: "Update failed 🤯",
      }
    )
    .then(() => {
      return redirect(`/dashboard/users/`);
    })
    .catch((error) => {
      if (error.response.status === 401) {
        errors.password = "Wrong Password!";
      }
      return errors;
    });
};

export default function Profile() {
  const user = useLoaderData();
  const errors = useActionData();
  const form = useRef();
  const oldPassword = useRef();
  const newPassword = useRef();

  useEffect(() => {
    if (!errors?.password) {
      oldPassword.current.value = "";
      newPassword.current.value = "";
    } else {
      oldPassword.current.setCustomValidity(oldPassword.current.title);
      oldPassword.current.reportValidity();
    }
  }, [errors]);

  useEffect(() => {
    form.current.reset();
  }, [user.username]);

  const handlePwInput = (e) => {
    e.target.setCustomValidity("");
    newPassword.current.disabled = !e.target.value;
  };

  return (
    <Page title="Profile">
      <div className="userform">
        <h1>{`${user.username} (${user.firstName} ${user.lastName})`}</h1>
        <Form method="post" ref={form}>
          <div className="userform-content">
            <label htmlFor="username">
              Username
              <input
                type="text"
                name="username"
                defaultValue={user?.username}
              ></input>
            </label>
            <div className="nameWrapper">
              <div className="nameWrapperSingle">
                <label htmlFor="firstName">
                  First Name
                  <input
                    name="firstName"
                    type="text"
                    defaultValue={user.firstName}
                  ></input>
                </label>
              </div>
              <div className="nameWrapperSingle">
                <label htmlFor="lastName">
                  Last Name
                  <input
                    name="lastName"
                    type="text"
                    defaultValue={user.lastName}
                  ></input>
                </label>
              </div>
            </div>
            <label htmlFor="email">
              Email
              <input name="email" type="text" defaultValue={user.email}></input>
            </label>
            <h2>Change Password</h2>
            <label htmlFor="oldPassword">
              Old password
              <input
                ref={oldPassword}
                name="password"
                type="password"
                title="Please enter a correct password!"
                onInput={(e) => handlePwInput(e)}
              ></input>
            </label>
            <label htmlFor="newPassword">
              New password
              <input
                disabled
                ref={newPassword}
                name="newPassword"
                type="password"
                pattern="^(?=.{8,20}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*"
                title="Minimum 12 characters containing lowercase, uppercase, at least one number and one special character(!£$%^&)"
              ></input>
            </label>
          </div>
          <button type="submit">Update</button>
        </Form>
      </div>
    </Page>
  );
}
