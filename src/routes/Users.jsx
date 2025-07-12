import axios from "axios";
import React, { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import ActiveForm from "../components/ActiveForm";
import Page from "../components/Page";
import PageHeader from "../components/PageHeader.jsx";
import RoleForm from "../components/RoleForm";
import { useAuth } from "../hooks/useAuth";
import "./Admin.css";

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
  const loadedUsers = useLoaderData();
  const [users, setUsers] = useState(loadedUsers);
  const { user: currentUser } = useAuth();

  const handleDelete = async (e, userId) => {
    if (!window.confirm("Are you sure?")) return;
    axios({
      method: "delete",
      url: `/users/${userId}`,
    })
      .then((response) => {
        if (response)
          setUsers((oldArray) => oldArray.filter((u) => u._id !== userId));
      })
      .catch((error) => {
        reject(error);
      });
  };

  return (
    <Page title="Users">
      <PageHeader
        title="Users"
        buttonTo={"add"}
        buttonText={"Add User"}
      ></PageHeader>
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
              if (user._id === currentUser.id) return;
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
                  <td>
                    <div className="actions">
                      <Link to={`/dashboard/users/${user._id}/edit`}>
                        <i className="fa-solid fa-edit"></i>
                      </Link>
                      <span className="btn link">
                        <i
                          onClick={(e) => handleDelete(e, user._id)}
                          className="fa-solid fa-trash"
                        ></i>
                      </span>
                    </div>
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
