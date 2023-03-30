import { useRouteError } from "react-router-dom";
import Page from "../components/Page";
import "./ErrorPage.css";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <Page title={"Error!"}>
      <div id="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </Page>
  );
}
