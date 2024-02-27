import React from "react";
import { Navigate, redirect, useActionData, useParams } from "react-router";
import { Link, Form, useSearchParams } from "react-router-dom";
import RemoteConfig from "../config/Config";
import axios from "axios";

export const action = async ({ request }) => {
  let formData = await request.formData();
  let errors = {};

  if (formData.get("password") !== formData.get("confirmPassword")) {
    errors.password = "Passwords do not match!";
    return errors;
  } else {
    return await axios
      .put("/reset-password", {
        token: formData.get("token"),
        tokenId: formData.get("tokenId"),
        password: formData.get("password"),
      })
      .then((res) => {
        return { success: "Your password is updated!" };
      })
      .catch((err) => {
        if (err.response.status === 404) {
          errors.password = "Your token does not exist or is expired!";
        } else {
          errors.password = "Something went wrong";
        }
        return errors;
      });
  }
};

export default function ResetPassword() {
  const [searchParams, setSearchParams] = useSearchParams();
  const errors = useActionData();

  if (!searchParams.get("token") && !searchParams.get("tokenId"))
    return <Navigate to={"../"} />;
  if (errors?.success)
    return (
      <div>
        <p>{errors.success}</p>
        <p>
          <Link to={"/login"}>Back to login form</Link>
        </p>
      </div>
    );
  return (
    <div>
      <p>Reset your password</p>
      <Form method="post">
        <label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            pattern={RemoteConfig.PASSWORD_STR}
            title={RemoteConfig.PASSWORD_MESSAGE}
          ></input>
        </label>
        <label>
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
          ></input>
        </label>
        <input name="token" value={searchParams.get("token")} type="hidden" />
        <input
          name="tokenId"
          value={searchParams.get("tokenId")}
          type="hidden"
        />
        <button type="submit">Submit</button>
        {errors?.password && <div className="error">{errors?.password}</div>}
      </Form>
      <p>
        <Link to={"/login"}>Back to login form</Link>
      </p>
    </div>
  );
}
