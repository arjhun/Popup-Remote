import axios from "axios";
import React, { useEffect } from "react";
import { useActionData, useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import Page from "../components/Page.jsx";
import UserForm from "../components/UserForm";
import RemoteConfig from "../config/Config";
import { useAuth } from "../hooks/useAuth.js";
import "./Profile.css";

export async function loader({ params }) {
  let profile = await new Promise((resolve, reject) => {
    axios
      .request({
        method: "get",
        url: `/users/${params.id}`,
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
  let formData = await request.formData();
  let errors = {};
  let apiRequest;

  switch (formData.get("action")) {
    case "user":
      apiRequest = axios
        .put(RemoteConfig.SERVER_URL + `/users/${params.id}`, formData)
        .then((result) => {
          return Promise.resolve({ user: result.data });
        })
        .catch((error) => {
          return Promise.reject(error);
        });
      break;
    case "password":
      apiRequest = axios
        .put(RemoteConfig.SERVER_URL + `/users/${user.id}/password`, formData)
        .then(() => {
          return Promise.resolve();
        })
        .catch((error) => {
          return Promise.reject(error);
        });
      break;
  }

  return toast
    .promise(apiRequest, {
      pending: "Updating User",
      success: "User updated 👌",
      error: "Update failed 🤯",
    })
    .then((user) => {
      return user;
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
  const result = useActionData();
  const { updateUser } = useAuth();
  useEffect(() => {
    if (result?.user) updateUser(result.user);
  });
  return (
    <Page title="Profile">
      <h1>Profile</h1>
      <UserForm data={user} button="Update" passwordRequired={false}></UserForm>
    </Page>
  );
}
