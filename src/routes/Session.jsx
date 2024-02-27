import { useState, useEffect } from "react";
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
import ReactTimeAgo from "react-time-ago";
import Remote from "../components/Remote";
import { DragDropContext } from "react-beautiful-dnd";
import CreatePopupForm from "../components/CreatePopupForm";

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
  const [popups, setPopups] = useState(session.popups);
  const [currentPopup, setCurrentPopup] = useState();

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

  function handleDelPopup(popup) {
    if (!window.confirm("Are you sure?")) return;
    socket.emit("deletePopup", session._id, popup._id, (success) => {
      if (success) removePopup(popup._id);
    });
  }

  function handleEditPopup(popup) {
    setCurrentPopup(popup);
  }

  function handleShowPopup(popup) {
    socket.emit("showPopup", popup);
  }

  function handleFavPopup(popup) {
    let transferPopup = { ...popup };
    transferPopup.fav = !popup.fav;
    socket.emit("updatePopup", session._id, transferPopup, (success) => {});
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
            <CreatePopupForm popup={currentPopup} sessionId={session._id} />
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
                  selected={
                    playingPopup ? popup._id === playingPopup._id : false
                  }
                  handleClick={() => handleShowPopup(popup)}
                >
                  {popup.content}
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
                  </BigListActions>
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
