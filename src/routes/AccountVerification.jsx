import axios from "axios";
import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import Page from "../components/Page.jsx";

export async function loader({ request }) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const tokenId = url.searchParams.get("tokenId");
  if (!token || !tokenId) throw new Error("No token provided" + tokenId);
  let sessions = await new Promise((resolve, reject) => {
    axios
      .request({
        method: "PUT",
        url: `/verify-account`,
        data: { token: 1, tokenId: "a123" },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return true;
}
export const AccountVerification = () => {
  const loaderData = useLoaderData();
  if (!loaderData) return "hi";

  return (
    <Page className="verify-box" title={"Account is succesfully verified!"}>
      <div>
        <p>Welcome on board! Your account is Verified, welcome!!!</p>
        <p>
          You can now <Link to={"/login"}>login</Link>!
        </p>
      </div>
    </Page>
  );
};
