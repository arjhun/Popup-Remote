import React from "react";
import Page from "../components/Page";
import BigList from "../components/BigList";
import BigListItem from "../components/BigListItem";
import BigListActions from "../components/BigListActions";
import { BigListActionButton } from "../components/BigListActions";
import { useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { Link } from "react-router-dom";
import { socket } from "../contexts/SocketProvider";
import styles from "./Admin.css";
export async function loader() {
  const sessions = await new Promise((resolve, reject) => {
    socket.emit("getUsers", (data) => {
      resolve(data);
    });
  });
  return sessions;
}

export default function Users() {
  const users = useLoaderData();

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <Page title={"Users"}>
      <h1>Admin</h1>
      <div className="users">
        <table>
          <thead>
            <tr>
              <td>Username</td>
              <td>email</td>
              <td>Name</td>
              <td>Role</td>
              <td>Active</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.active && <i className="fa-solid fa-check"></i>}
                  </td>
                  <td className="actions">
                    <Link to={`edit/${user._id}`}>
                      <i className="fa-solid fa-edit"></i>
                    </Link>
                    <Link to={`delete/${user._id}`}>
                      <i className="fa-solid fa-trash"></i>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Page>
  );
}
