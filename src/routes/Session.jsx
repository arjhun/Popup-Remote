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

export async function loader({ params }) {
  let session = await new Promise((resolve) => {
    socket.emit("getSession", params.currentSessionId, (data) => {
      resolve(data);
    });
  });
  if (session == null)
    throw new Response("Not Found", {
      status: 404,
      statusText: "Session not found!",
    });
  return session;
}

export default function Session() {
  const session = useLoaderData();
  const [filtering, setFiltering] = useState();
  const [playingQuestion, setPlayingquestion] = useState();
  const [lastQuestion, setLastQuestion] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(undefined);
  const [questions, setQuestions] = useState([]);
  const newQuestionRef = useRef();

  useEffect(() => {
    socket.emit("getQuestions", session._id, (data) => {
      sortByOrder(data);
      setQuestions(data);
    });

    socket.on("removeQuestion", (sessionId, id) => {
      if (sessionId !== session._id) return;
      removeQuestion(id);
    });

    socket.on("updateQuestion", (sessionId, question) => {
      if (sessionId !== session._id) return;
      setQuestions((oldArray) =>
        oldArray.map((q) => {
          if (q._id === question._id) {
            return { ...q, content: question.content, fav: question.fav };
          }
          return q;
        })
      );
    });

    socket.on("addQuestion", (sessionId, question) => {
      if (sessionId !== session._id) return;
      setQuestions((oldArray) => [...oldArray, question]);
    });

    socket.on("questionStarted", (question) => {
      setPlayingquestion(question);
    });

    return () => {
      socket.off("updateQuestion");
      socket.off("removeQuestion");
      socket.off("addQuestion");
      socket.off("questionStarted");
    };
  }, [socket, session._id]);

  function removeQuestion(id) {
    setQuestions((oldArray) => oldArray.filter((q) => q._id !== id));
  }

  function sortByOrder(toSort) {
    toSort.sort((a, b) => {
      if (a.order > b.order) return 1;
      if (a.order < b.order) return -1;
      return 0;
    });
  }

  function resetInput() {
    newQuestionRef.current.value = null;
    setCurrentQuestion(undefined);
  }

  function handleAddQuestion(e) {
    const questionContent = newQuestionRef.current.value;
    if (!questionContent) return;
    let newQuestion = !currentQuestion
      ? { _id: undefined, content: questionContent }
      : { ...currentQuestion, content: questionContent };
    setIsSending(true);
    socket.emit("updateQuestion", session._id, newQuestion, (succes) => {
      if (succes) {
        resetInput();
        setIsSending(false);
      }
    });
  }

  function handleReorderQuestion(question, incr) {
    let newArray = [...questions];

    newArray.forEach((element, i) => {
      element.order = i;
    });
    let currIndex = newArray.indexOf(question);
    let switchIndex = currIndex + incr;
    if (switchIndex < 0 || switchIndex > newArray.length - 1) return;
    newArray[currIndex].order = switchIndex;
    newArray[switchIndex].order = currIndex;
    let reducedArray = newArray.map((e) => ({ _id: e._id, order: e.order }));
    sortByOrder(newArray);
    socket.emit("sortQuestions", session._id, reducedArray, (success) => {
      if (success) setQuestions(newArray);
    });
  }

  function handleEditQuestion(question) {
    setCurrentQuestion(question);
    newQuestionRef.current.focus();
    newQuestionRef.current.value = question.content;
  }

  function handleDelQuestion(question) {
    if (!window.confirm("Are you sure?")) return;
    socket.emit("deleteQuestion", session._id, question._id, (success) => {
      if (success) removeQuestion(question._id);
    });
  }

  function handleShowQuestion(question) {
    if (playingQuestion && question._id === playingQuestion._id) return;
    setLastQuestion(question);
    socket.emit("showQuestion", question);
  }

  function handleFavQuestion(question) {
    let transferQuestion = { ...question };
    transferQuestion.fav = !question.fav;
    socket.emit(
      "updateQuestion",
      session._id,
      transferQuestion,
      (success) => {}
    );
  }

  function handleHideQuestion() {
    socket.emit("hide");
  }

  let buttonText = !currentQuestion ? "Add" : "Edit";
  if (isSending) buttonText = <i className="fa-solid fa-star"></i>;

  return (
    <Page title={session.title}>
      <div className="session">
        <header className="session-header">
          <h1>{session.title}</h1>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(session.createdAt).toLocaleString()} <br />
            <strong>Total Questions:</strong> {questions.length} <br />
          </p>
        </header>
        <div className="remoteInputPanel">
          <section>
            <h2>Remote:</h2>
            <button onClick={() => handleHideQuestion()}>Hide Popup</button>
            <button onClick={(e) => handleShowQuestion(lastQuestion)}>
              Repeat Last
            </button>
          </section>
          <section>
            <h2>{currentQuestion ? "Edit" : "Create"} a popup:</h2>
            <textarea ref={newQuestionRef} cols="60" rows="10"></textarea>
            <br />
            <button
              className="addButton"
              disabled={isSending}
              onClick={handleAddQuestion}
            >
              {buttonText}
            </button>
            {currentQuestion && (
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
            noItemMessage="No Questions yet!"
          >
            {questions.map((question) => (
              <BigListItem
                key={question._id}
                shouldFilter={filtering}
                filterOperation={() => !question.fav}
                highlight={question.fav}
                selected={
                  playingQuestion ? question._id === playingQuestion._id : false
                }
                handleClick={() => handleShowQuestion(question)}
                content={question.content}
                actions={
                  <BigListActions>
                    <BigListActionButton
                      icon="fa-solid fa-star"
                      onClick={() => handleFavQuestion(question)}
                    />
                    <BigListActionButton
                      icon="fa-solid fa-edit"
                      onClick={() => handleEditQuestion(question)}
                    />
                    <BigListActionButton
                      icon="fa-solid fa-trash"
                      onClick={() => handleDelQuestion(question)}
                    />
                    <BigListActionButton
                      icon="fa-solid fa-arrow-up"
                      onClick={() => handleReorderQuestion(question, -1)}
                    />
                    <BigListActionButton
                      icon="fa-solid fa-arrow-down"
                      onClick={() => handleReorderQuestion(question, +1)}
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
