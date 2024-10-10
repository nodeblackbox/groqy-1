// components/CreatePayload.jsx
import React, { useState } from "react";
import axios from "axios";

const CreatePayload = () => {
  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    url: "",
    method: "POST",
    headers: {},
    body: {},
    subtasks: [],
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/payloads", form);
      setMessage("Payload created successfully!");
      setForm({
        id: "",
        name: "",
        description: "",
        url: "",
        method: "POST",
        headers: {},
        body: {},
        subtasks: [],
      });
    } catch (error) {
      setMessage(error.response?.data?.error || "Error creating payload");
    }
  };

  return (
    <div>
      <h2>Create New Payload</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        {/* Input fields for each form property */}
        <input
          type="text"
          name="id"
          placeholder="ID"
          value={form.id}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          type="url"
          name="url"
          placeholder="URL"
          value={form.url}
          onChange={handleChange}
          required
        />
        <select name="method" value={form.method} onChange={handleChange}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
        {/* For headers and body, you might use JSON editors or similar components */}
        <button type="submit">Create Payload</button>
      </form>
    </div>
  );
};

export default CreatePayload;
