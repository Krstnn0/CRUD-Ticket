import React from "react";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString("id-ID");
  } catch {
    return iso;
  }
}

export default function TicketList({ tickets, onSelect, selectedId, loading }) {
  if (loading) return <p>Memuat tiket...</p>;

  if (!tickets.length) {
    return <p className="empty-state">Belum ada tiket. Buat tiket baru di form sebelah kiri.</p>;
  }

  return (
    <table className="ticket-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Dibuat</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((t) => (
          <tr
            key={t.id}
            className={t.id === selectedId ? "selected-row" : ""}
            onClick={() => onSelect(t.id)}
          >
            <td>{t.id}</td>
            <td>{t.title}</td>
            <td>
              <span className={`badge priority-${t.priority}`}>{t.priority}</span>
            </td>
            <td>
              <span className={`badge status-${t.status}`}>{t.status}</span>
            </td>
            <td>{formatDate(t.created_at)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
