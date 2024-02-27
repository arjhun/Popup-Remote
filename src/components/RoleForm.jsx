import React from "react";
import { Form } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
const roles = ["admin", "mod"];

export default function RoleForm({ id, role }) {
  const handleRoleChange = (e) => {
    axios({
      method: "put",
      url: `/users/${id}/role`,
      data: { role: e.target.value },
    });
  };

  return (
    <Form>
      <select onChange={handleRoleChange} defaultValue={role}>
        {roles.map((roleValue) => (
          <option key={roleValue}>{roleValue}</option>
        ))}
      </select>
    </Form>
  );
}
