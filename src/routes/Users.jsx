import React from "react";
import { useLoaderData, Link } from "react-router-dom";
import Page from "../components/Page";
import "./Admin.css";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import ActiveForm from "../components/ActiveForm";
import RoleForm from "../components/RoleForm";

export async function loader() {
  let users = await new Promise((resolve, reject) => {
    axios
      .request({
        method: "get",
        url: `/users`,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return users;
}

export default function users() {
  const users = useLoaderData();
  const { user: currentUser } = useAuth();

  return (
    <Page title="Users">
      <header>
        <h1>Admin</h1>
        <Link to="add" className="btn addUser">
          <i className="fa-solid fa-plus"></i> Add user
        </Link>
      </header>
      <div className="users">
        <table>
          <thead>
            <tr>
              <td>Username</td>
              <td>email</td>
              <td>First Name</td>
              <td>Last Name</td>
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
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>
                    <RoleForm id={user._id} role={user.role}></RoleForm>
                  </td>
                  <td>
                    {
                      <ActiveForm
                        id={user._id}
                        isActive={user.active}
                      ></ActiveForm>
                    }
                  </td>
                  <td className="actions">
                    <Link
                      to={
                        user._id === currentUser.id
                          ? `/dashboard/profile`
                          : `/dashboard/users/${user._id}/edit`
                      }
                    >
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
