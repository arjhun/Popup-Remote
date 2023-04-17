import { useRef, useState, useEffect, useContext } from "react";
import { useLoaderData } from "react-router-dom";
import "./Session.css";
import { socket } from "../contexts/SocketProvider";

import BigList from "../components/BigList";
import BigListItem from "../components/BigListItem";
import BigListActions, {
  BigListActionButton,
} from "../components/BigListActions";
import Page from "../components/Page";
import axios from "axios";

export async function loader({ params }) {
  let session = await new Promise((resolve, reject) => {
    axios
      .request({
        method: "get",
        url: `/sessions/${params.currentSessionId}`,
      })
      .then((response) => {
        sortByOrder(response.data.popups);
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return session;
}

export default function Session() {
  const session = useLoaderData();
  const [filtering, setFiltering] = useState();
  const [playingPopup, setPlayingPopup] = useState();
  const lastPopup = useRef(null);
  const [isSending, setIsSending] = useState(false);
  const [currentPopup, setCurrentPopup] = useState();
  const [popups, setPopups] = useState(session.popups);
  const newPopupRef = useRef();

  useEffect(() => {
    socket.on("deletePopup", (sessionId, popupId) => {
      if (sessionId !== session._id) return;
      removePopup(popupId);
    });

    socket.on("updatePopup", (sessionId, updatedPopup) => {
      if (sessionId !== session._id) return;
      setPopups((oldArray) =>
        oldArray.map((popup) => {
          if (popup._id === updatedPopup._id) {
            return {
              ...popup,
              content: updatedPopup.content,
              fav: updatedPopup.fav,
            };
          }
          return popup;
        })
      );
    });

    socket.on("addPopup", (sessionId, newPopup) => {
      console.log("new popup");
      if (sessionId !== session._id) return;
      setPopups((oldArray) => [...oldArray, newPopup]);
    });

    socket.on("popupStarted", (popup) => {
      setPlayingPopup(popup);
    });

    return () => {
      socket.off("updatePopup");
      socket.off("deletePopup");
      socket.off("addPopup");
      socket.off("popupStarted");
    };
  }, [socket, session._id]);

  function removePopup(id) {
    setPopups((oldArray) => oldArray.filter((q) => q._id !== id));
  }

  function resetInput() {
    newPopupRef.current.value = null;
    setCurrentPopup(undefined);
  }

  function handleAddPopup() {
    const popupContent = newPopupRef.current.value;
    if (!popupContent) return;
    const popup = { content: popupContent };
    setIsSending(true);
    if (currentPopup) {
      socket.emit(
        "updatePopup",
        session._id,
        { ...currentPopup, content: popupContent },
        (succes) => {
          if (succes) {
            resetInput();
            setIsSending(false);
          }
        }
      );
    } else {
      socket.emit("addPopup", session._id, popup, (succes) => {
        if (succes) {
          resetInput();
          setIsSending(false);
        }
      });
    }
  }

  function handleReorderPopup(popup, incr) {
    let newArray = [...popups];

    newArray.forEach((element, i) => {
      element.order = i;
    });
    let currIndex = newArray.indexOf(popup);
    let switchIndex = currIndex + incr;
    if (switchIndex < 0 || switchIndex > newArray.length - 1) return;
    newArray[currIndex].order = switchIndex;
    newArray[switchIndex].order = currIndex;
    let reducedArray = newArray.map((e) => ({ _id: e._id, order: e.order }));
    sortByOrder(newArray);
    socket.emit("sortPopups", session._id, reducedArray, (success) => {
      if (success) setPopups(newArray);
    });
  }

  function handleEditPopup(popup) {
    setCurrentPopup(popup);
    newPopupRef.current.focus();
    newPopupRef.current.value = popup.content;
  }

  function handleDelPopup(popup) {
    if (!window.confirm("Are you sure?")) return;
    socket.emit("deletePopup", session._id, popup._id, (success) => {
      if (success) removePopup(popup._id);
    });
  }

  function handleShowPopup(popup) {
    if (playingPopup && popup._id === playingPopup._id) return;
    lastPopup.current = popup;
    socket.emit("showPopup", popup);
  }

  function handleFavPopup(popup) {
    let transferPopup = { ...popup };
    transferPopup.fav = !popup.fav;
    socket.emit("updatePopup", session._id, transferPopup, (success) => {});
  }

  function handleHidePopup() {
    socket.emit("hide");
  }

  let buttonText = !currentPopup ? "Add" : "Edit";
  if (isSending) buttonText = <i className="fa-solid fa-star"></i>;

  return (
    <Page title={session.title}>
      <div className="session">
        <header className="session-header">
          <h1>{session.title}</h1>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(session.createdAt).toLocaleString()} <br />
            <strong>Updated:</strong>{" "}
            {new Date(session.updatedAt).toLocaleString()} <br />
            <strong>Total Popups:</strong> {popups.length} <br />
          </p>
        </header>
        <div className="remoteInputPanel">
          <section>
            <h2>Remote:</h2>
            <button onClick={() => handleHidePopup()}>Hide Popup</button>
            <button onClick={(e) => handleShowPopup(lastPopup.current)}>
              Repeat Last
            </button>
          </section>
          <section>
            <h2>{currentPopup ? "Edit" : "Create"} a popup:</h2>
            <textarea ref={newPopupRef} cols="60" rows="10"></textarea>
            <br />
            <button
              className="addButton"
              disabled={isSending}
              onClick={handleAddPopup}
            >
              {buttonText}
            </button>
            {currentPopup && (
              <button onClick={() => resetInput()} className="cancelButton">
                cancel
              </button>
            )}
          </section>
        </div>
        <div className="remoteListPanel">
          <BigList
            filterLabel={"Favorites"}
            filterState={setFiltering}
            noItemMessage="No Popups yet!"
          >
            {popups.map((popup) => (
              <BigListItem
                key={popup._id}
                shouldFilter={filtering}
                filterOperation={() => !popup.fav}
                highlight={popup.fav}
                selected={playingPopup ? popup._id === playingPopup._id : false}
                handleClick={() => handleShowPopup(popup)}
                content={popup.content}
                actions={
                  <BigListActions>
                    <BigListActionButton
                      icon="fa-solid fa-star"
                      onClick={() => handleFavPopup(popup)}
                    />
                    <BigListActionButton
                      icon="fa-solid fa-edit"
                      onClick={() => handleEditPopup(popup)}
                    />
                    <BigListActionButton
                      icon="fa-solid fa-trash"
                      onClick={() => handleDelPopup(popup)}
                    />
                    <BigListActionButton
                      icon="fa-solid fa-arrow-up"
                      onClick={() => handleReorderPopup(popup, -1)}
                    />
                    <BigListActionButton
                      icon="fa-solid fa-arrow-down"
                      onClick={() => handleReorderPopup(popup, +1)}
                    />
                  </BigListActions>
                }
              />
            ))}
          </BigList>
        </div>
      </div>
    </Page>
  );
}

function sortByOrder(toSort) {
  toSort.sort((a, b) => {
    if (a.order > b.order) return 1;
    if (a.order < b.order) return -1;
    return 0;
  });
}