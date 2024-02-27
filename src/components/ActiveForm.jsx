import React, { useState } from "react";
import { Form } from "react-router-dom";
import axios from "axios";

export default function ActiveForm({ id, isActive }) {
  const handleActivate = async (e) => {
    axios({
      method: "put",
      url: `/users/${id}/active`,
      data: { active: e.target.checked },
    });
  };
  return (
    <Form>
      <input
        type="checkbox"
        defaultChecked={isActive}
        onChange={(e) => handleActivate(e)}
      ></input>
    </Form>
  );
}
