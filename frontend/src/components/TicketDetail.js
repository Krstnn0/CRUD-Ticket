import React, { useState } from "react";
import { updateTicket, deleteTicket } from "../api";

const STATUSES = ["open", "in_progress", "closed"];

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString("id-ID");
  } catch {
    return iso;
  }
}

export default function TicketDetail({ ticket, onUpdated, onDeleted, onClose }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!ticket) return null;

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setError("");
    setBusy(true);
    try {
      const res = await updateTicket(ticket.id, { status: newStatus });
      onUpdated(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Gagal mengubah status.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Hapus tiket #${ticket.id} - "${ticket.title}"?`)) return;
    setError("");
    setBusy(true);
    try {
      await deleteTicket(ticket.id);
      onDeleted(ticket.id);
    } catch (err) {
      setError(err.response?.data?.detail || "Gagal menghapus tiket.");
      setBusy(false);
    }
  };

  return (
    <div className="ticket-detail">
      <div className="ticket-detail-header">
        <h2>Tiket #{ticket.id}</h2>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <p>
        <strong>Title:</strong> {ticket.title}
      </p>
      <p>
        <strong>Description:</strong> {ticket.description}
      </p>
      <p>
        <strong>Priority:</strong>{" "}
        <span className={`badge priority-${ticket.priority}`}>{ticket.priority}</span>
      </p>
      <p>
        <strong>Dibuat:</strong> {formatDate(ticket.created_at)}
      </p>
      <p>
        <strong>Diperbarui:</strong> {formatDate(ticket.updated_at)}
      </p>

      <div className="form-field">
        <label htmlFor="status">Status</label>
        <select id="status" value={ticket.status} onChange={handleStatusChange} disabled={busy}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <button className="delete-btn" onClick={handleDelete} disabled={busy}>
        Hapus Tiket
      </button>
    </div>
  );
}
