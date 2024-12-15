import { Navigate, useNavigate, useRouteError } from "react-router-dom";
import Page from "../components/Page";
import "./ErrorPage.css";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  console.log(error);
  if (error.status === 401) return <Navigate to="/login" />;
  return (
    <Page title={"Error!"}>
      <div id="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>
            {error.statusText}
            {error.message}
          </i>
        </p>
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
      </div>
    </Page>
  );
}
