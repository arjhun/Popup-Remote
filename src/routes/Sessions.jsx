import { React, useEffect, useRef, useState } from "react";
import BigList from "../components/BigList";
import Page from "../components/Page";
import BigListItem from "../components/BigListItem";
import BigListActions, {
  BigListActionButton,
} from "../components/BigListActions";
import LoadingButton from "../components/LoadingButton";
import { socket } from "../contexts/SocketProvider";
import "./Sessions.css";
import { Link, useLoaderData } from "react-router-dom";
import axios from "axios";

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

  useEffect(() => {
    socket.on("addSession", (data) => {
      setSessionList((oldArray) => {
        const i = oldArray.findIndex((s) => s._id === data._id);
        if (i > -1) {
          let newData = [...oldArray];
          newData[i] = data;
          return newData;
        } else {
          return [...oldArray, data];
        }
      });
    });

    socket.on("sessionDeleted", (sessionId) => {
      setSessionList((oldList) => {
        return oldList.filter((session) => sessionId !== session._id);
      });
    });

    return () => {
      socket.off("addSession");
      socket.off("sessionDeleted");
    };
  }, []);

  function handleDelSession(session) {
    if (
      !window.confirm("Are you shure you want to delete " + session.title + "?")
    )
      return;
    socket.emit("deleteSession", session._id, (success) => {
      if (success)
        setSessionList((oldArray) =>
          oldArray.filter((s) => s._id !== session._id)
        );
    });
  }

  async function handleAddSession() {
    await new Promise((resolve, reject) => {
      if (!newSessionRef.current.value) {
        reject();
      } else {
        axios({
          method: "post",
          url: `/sessions/`,
          data: {title: newSessionRef.current.value}
        })
          .then((session) => {
            setSessionList((oldArray) => {
              return[session.data,...oldArray];
            });
              clearInput();
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      }
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

  function filterSessions(session) {
    return session.questions.length > 0;
  }
  function createEntryContent(session) {
    return ` ${session.title} (${session.questions.length})`;
  }

  async function longLoad() {
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

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
        <BigList
          filterLabel="Hide empty"
          filterState={setFiltering}
          noItemMessage="No Questions yet!"
        >
          {sessionList.map((session) => (
            <BigListItem
              key={session._id}
              shouldFilter={filtering}
              filterOperation={() => session.questions.length === 0}
              actions={
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
              }
              content={
                <Link to={`session/${session._id}`}>
                  <i className="fa-solid fa-calendar"></i>
                  {` ${session.title} (${session.popupCount})`}
                </Link>
              }
            />
          ))}
        </BigList>
      </div>
    </Page>
  );
}
