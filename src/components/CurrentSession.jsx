import React from "react";
import { useScheduledSession } from "../contexts/ScheduledSessionProvider";

export default function CurrentSession() {
  const { scheduledSession } = useScheduledSession();
  return (
    <div style={{ textAlign: "right" }}>
      {scheduledSession ? (
        <>
          <strong>Scheduled Session: </strong>
          {` "${scheduledSession.title}"`}
        </>
      ) : (
        ""
      )}
    </div>
  );
}
