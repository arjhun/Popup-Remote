import axios from "axios";
import { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useLoaderData } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import { toast } from "react-toastify";
import BigList from "../components/BigList";
import BigListActions, {
  BigListActionButton,
} from "../components/BigListActions";
import BigListItem from "../components/BigListItem";
import Page from "../components/Page";
import {
  default as CreatePopupForm,
  default as PopupForm,
} from "../components/PopupForm";
import Remote from "../components/Remote";
import { useScheduledSession } from "../contexts/ScheduledSessionProvider";
import { socket } from "../contexts/SocketProvider";
import "./Session.css";

export async function loader({ params }) {
  const session = await new Promise((resolve, reject) => {
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
  const session = useLoaderData() ?? {};
  const [filtering, setFiltering] = useState();
  const [playingPopup, setPlayingPopup] = useState();
  const [popups, setPopups] = useState(session.popups);
  const [currentPopup, setCurrentPopup] = useState();
  const { scheduledSession } = useScheduledSession();

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
              ...updatedPopup,
            };
          }
          return popup;
        })
      );
    });

    socket.on("addPopup", (sessionId, newPopup) => {
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
  }, [socket]);

  function removePopup(id) {
    setPopups((oldArray) => oldArray.filter((q) => q._id !== id));
  }

  function handleDelPopup(popup) {
    if (!window.confirm("Are you sure?")) return;
    socket.emit("deletePopup", session._id, popup._id, (success) => {
      if (success) removePopup(popup._id);
    });
  }

  function handleEditPopup(popup) {
    setCurrentPopup(popup);
  }
  function handleCancel() {
    setCurrentPopup(null);
  }

  function handleShowPopup(popup) {
    if (!playingPopup || playingPopup._id !== popup._id)
      socket.emit("showPopup", popup);
    else socket.emit("hide");
  }

  function handleFavPopup(popup) {
    let transferPopup = { ...popup };
    transferPopup.fav = !popup.fav;
    socket.emit("updatePopup", session._id, transferPopup, (success) => {});
  }

  function handleExportPopup(popup) {
    const newPopup = Object.assign({}, popup);
    delete newPopup._id;
    if (!scheduledSession) return;
    socket.emit("addPopup", scheduledSession._id, newPopup, (success) => {
      if (success) toast("Popup exported to scheduled session!");
    });
  }

  function onDragEnd(result) {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    )
      return;

    let oldPopup = popups[source.index];
    let newArray = [...popups];
    newArray.splice(source.index, 1);
    newArray.splice(destination.index, 0, oldPopup);

    let reducedArray = newArray.map((e, index) => ({
      _id: e._id,
      order: index,
    }));

    socket.emit("sortPopups", session._id, reducedArray, (success) => {
      if (success) {
        setPopups(newArray);
      }
    });
  }

  return (
    <Page title={session.title}>
      <div className="session">
        <header className="session-header">
          <h1>{session.title}</h1>
          <p>
            <strong>Created: </strong>
            <ReactTimeAgo
              date={new Date(session.createdAt)}
              locale="en-US"
              timeStyle="round-minute"
            />
            <br />

            <strong>Updated: </strong>
            <ReactTimeAgo
              date={new Date(session.updatedAt)}
              locale="en-US"
              timeStyle="round-minute"
            />
            <br />
            <strong>Total Popups: </strong>
            {popups.length}
          </p>
        </header>
        <div className="remoteInputPanel">
          <section>
            <Remote />
          </section>
          <section>
            <CreatePopupForm sessionId={session._id} />
          </section>
        </div>
        <div className="remoteListPanel">
          <DragDropContext onDragEnd={onDragEnd}>
            <BigList
              title="Popups"
              filterLabel={"Favorites"}
              filterState={setFiltering}
              noItemMessage="No Popups yet!"
            >
              {popups.map((popup, index) => (
                <BigListItem
                  key={popup._id}
                  id={popup._id}
                  index={index}
                  shouldFilter={filtering}
                  filterOperation={() => !popup.fav}
                  highlight={popup.fav}
                  disabled={currentPopup == popup}
                  selected={
                    playingPopup ? popup._id === playingPopup._id : false
                  }
                  handleClick={() => handleShowPopup(popup)}
                >
                  {currentPopup == popup ? (
                    <PopupForm
                      popup={currentPopup}
                      onCancel={handleCancel}
                      sessionId={session._id}
                    />
                  ) : (
                    <>
                      {popup.title && (
                        <>
                          <i className="fa-solid fa-user"></i>
                          <strong>{` ${popup.title}: `}</strong>
                        </>
                      )}

                      {popup.content}
                      {popup.note && (
                        <div className="note">
                          <b>
                            <i className="fa-solid fa-note-sticky"></i>
                          </b>
                          <span className="note-content">{popup.note}</span>
                        </div>
                      )}

                      <BigListActions>
                        <BigListActionButton
                          title="Add to favorites"
                          icon="fa-solid fa-star"
                          onClick={() => handleFavPopup(popup)}
                        />
                        <BigListActionButton
                          title="Edit popup"
                          icon="fa-solid fa-edit"
                          onClick={() => handleEditPopup(popup)}
                        />
                        {scheduledSession?._id &&
                          scheduledSession._id != session._id && (
                            <BigListActionButton
                              title={`Export to session "${scheduledSession.title}"`}
                              icon="fa-solid fa-file-export"
                              onClick={() => handleExportPopup(popup)}
                            />
                          )}
                        <BigListActionButton
                          title="Delete popup"
                          icon="fa-solid fa-trash"
                          onClick={() => handleDelPopup(popup)}
                        />
                      </BigListActions>
                    </>
                  )}
                </BigListItem>
              ))}
            </BigList>
          </DragDropContext>
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
