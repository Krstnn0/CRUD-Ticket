import React, { useState } from "react";
import { createTicket } from "../api";

const PRIORITIES = ["low", "medium", "high"];

export default function TicketForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Title dan description wajib diisi.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createTicket({ title, description, priority });
      onCreated(res.data);
      resetForm();
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(
        Array.isArray(detail) ? detail.join(", ") : detail || "Gagal membuat tiket. Coba lagi."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="ticket-form" onSubmit={handleSubmit}>
      <h2>Buat Tiket Baru</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contoh: Internet lambat"
        />
      </div>

      <div className="form-field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Jelaskan detail masalah..."
          rows={3}
        />
      </div>

      <div className="form-field">
        <label htmlFor="priority">Priority</label>
        <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? "Menyimpan..." : "Buat Tiket"}
      </button>
    </form>
  );
}
