import React from "react";
import { useLoaderData, redirect } from "react-router-dom";
import "./Profile.css";
import axios from "axios";
import { toast } from "react-toastify";
import RemoteConfig from "../config/Config";
import Page from "../components/Page.jsx";
import UserForm from "../components/UserForm";

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
  let requestUrl;
  switch (formData.get("action")) {
    case "user":
      requestUrl = RemoteConfig.SERVER_URL + `/users/${params.id}`;
      break;
    case "password":
      requestUrl = RemoteConfig.SERVER_URL + `/users/${params.id}/password`;
      break;
  }

  return toast
    .promise(
      axios
        .put(requestUrl, formData)
        .then(() => {
          return Promise.resolve();
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
      return redirect("../");
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

  return (
    <Page title="Edit User">
      <h1>Edit User</h1>
      <UserForm data={user} button="Update" passwordRequired={false}></UserForm>
    </Page>
  );
}
