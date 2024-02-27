import { React, useRef, useState } from "react";
import BigList from "../components/BigList";
import Page from "../components/Page";
import BigListItem from "../components/BigListItem";
import BigListActions, {
  BigListActionButton,
} from "../components/BigListActions";
import LoadingButton from "../components/LoadingButton";
import "./Sessions.css";
import { Link, useLoaderData } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { DragDropContext } from "react-beautiful-dnd";

export async function loader() {
  let sessions = await new Promise((resolve, reject) => {
    axios
      .request({
        method: "get",
        url: `/sessions`,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return sessions;
}

export default function Sessions() {
  const [sessionList, setSessionList] = useState(useLoaderData());
  const newSessionRef = useRef(null);
  const [currentSession, setCurrentSession] = useState();
  const [filtering, setFiltering] = useState(false);

  function handleDelSession(session) {
    if (
      !window.confirm("Are you shure you want to delete " + session.title + "?")
    )
      return;
    axios
      .delete("/sessions/" + session._id)
      .then(() => {
        setSessionList((oldArray) =>
          oldArray.filter((s) => s._id !== session._id)
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleAddSession() {
    if (!newSessionRef.current.value) return;
    return new Promise((resolve, reject) => {
      let promise = axios
        .post(`/sessions/`, { title: newSessionRef.current.value })
        .then((session) => {
          setSessionList((oldArray) => {
            return [session.data, ...oldArray];
          });
          clearInput();
          resolve();
          return Promise.resolve(session);
        })
        .catch((error) => {
          reject();
          return Promise.reject(error);
        });
      return toast.promise(promise, {
        pending: "Adding Session",
        success: "Session Added 👌",
        error: "Adding Session Failed 🤯",
      });
    });
  }

  function handleEditSession(session) {
    newSessionRef.current.value = session.title;
    newSessionRef.current.focus();
    setCurrentSession(session._id);
  }

  function clearInput() {
    newSessionRef.current.value = "";
    newSessionRef.current.focus();
    setCurrentSession(undefined);
  }

  function onDragEnd() {}

  return (
    <Page title="sessions">
      <div className="sessions">
        <div className="sessionInput">
          <input
            type="text"
            ref={newSessionRef}
            placeholder="Session name"
          ></input>
          <LoadingButton className="addButton" doAction={handleAddSession}>
            {!currentSession ? "Add" : "Edit Session"}
          </LoadingButton>
          {currentSession && (
            <button className="cancelButton" onClick={clearInput}>
              Cancel
            </button>
          )}
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <BigList
            title="Sessions"
            filterLabel="Hide empty"
            filterState={setFiltering}
            noItemMessage="No Questions yet!"
          >
            {sessionList.map((session, index) => (
              <BigListItem
                isDragDisabled={true}
                key={session._id}
                id={session._id}
                index={index}
                shouldFilter={filtering}
                filterOperation={() =>
                  session.popupCount === 0 || session.popupCount === undefined
                }
              >
                <Link to={`session/${session._id}`}>
                  <i className="fa-solid fa-calendar"></i>
                  {` ${session.title} (${session.popupCount || 0})`}
                </Link>
                <BigListActions>
                  <BigListActionButton
                    icon="fa-solid fa-edit"
                    onClick={() => handleEditSession(session)}
                  />
                  <BigListActionButton
                    icon="fa-solid fa-trash"
                    onClick={() => handleDelSession(session)}
                  />
                </BigListActions>
              </BigListItem>
            ))}
          </BigList>
        </DragDropContext>
      </div>
    </Page>
  );
}
