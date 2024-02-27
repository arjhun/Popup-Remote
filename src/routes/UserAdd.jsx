import { React, useEffect } from "react";
import Page from "../components/Page";
import UserForm from "../components/UserForm";
import { toast } from "react-toastify";
import axios from "axios";
import { useActionData, useNavigate } from "react-router";
import { useState } from "react";

export const action = async ({ request }) => {
  let formData = await request.formData();
  let errors = {};

  return toast
    .promise(
      axios
        .post(`/users`, formData)
        .then(() => {
          return Promise.resolve();
        })
        .catch((error) => {
          return Promise.reject(error);
        }),
      {
        pending: "Adding User",
        success: "User added 👌",
        error: "Adding User failed 🤯",
      }
    )
    .then(() => {
      return { success: true };
    })
    .catch((error) => {
      if (error.response.status === 409) {
        errors.conflict = "User already exists!";
      }
      return errors;
    });
};

export default function UserAdd() {
  const navigate = useNavigate();
  const result = useActionData();
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (result?.success) navigate("/dashboard/users");
  }, [result]);

  return (
    <Page title="Add user">
      <h1>Add user</h1>
      <UserForm button="Add" disabled={disabled} />
      {result?.conflict && <div className="error">{result?.conflict}</div>}
    </Page>
  );
}
