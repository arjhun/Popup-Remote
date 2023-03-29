import React, { useEffect, useRef, useState } from "react";
import "./LoadingButton.css";

const Status = {
  idle: "idle",
  done: "done",
  loading: "loading",
  canceled: "canceled",
};

export default function LoadingButton(props) {
  const { doAction } = props;
  const [status, setStatus] = useState(Status.idle);
  let timeOut = useRef();

  useEffect(() => {
    if (status === Status.done) {
      timeOut.current = setTimeout(() => {
        setStatus(Status.idle);
      }, 2000);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [status]);

  async function handleClick() {
    if (status !== Status.loading && timeOut.current !== null) {
      setStatus(Status.loading);
      doAction().then(
        () => {
          setStatus(Status.done);
        },
        () => {
          setStatus(Status.canceled);
        }
      );
    }
  }

  return (
    <button className={` btn ${status}`} onClick={handleClick}>
      {status === Status.loading && (
        <i className="fa-solid fa-circle-notch fa-spin"></i>
      )}
      {status === Status.done && <i className="fa-solid fa-check"></i>}
      {props.children}
    </button>
  );
}