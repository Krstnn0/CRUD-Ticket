import React, { useEffect, useState, useCallback } from "react";
import TicketForm from "./components/TicketForm";
import TicketList from "./components/TicketList";
import TicketDetail from "./components/TicketDetail";
import { getTickets, getTicket } from "./api";
import "./App.css";

export default function App() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await getTickets();
      setTickets(res.data);
    } catch (err) {
      setLoadError("Gagal memuat data tiket. Pastikan backend berjalan.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleCreated = (newTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
  };

  const handleSelect = async (id) => {
    setSelectedId(id);
    try {
      const res = await getTicket(id);
      setSelectedTicket(res.data);
    } catch (err) {
      setSelectedTicket(null);
    }
  };

  const handleUpdated = (updatedTicket) => {
    setSelectedTicket(updatedTicket);
    setTickets((prev) => prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)));
  };

  const handleDeleted = (id) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
    setSelectedId(null);
    setSelectedTicket(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Support Ticket Mini Application</h1>
        <p>Sistem pelaporan dan pemantauan tiket bantuan internal</p>
      </header>

      <div className="app-body">
        <aside className="app-sidebar">
          <TicketForm onCreated={handleCreated} />
        </aside>

        <main className="app-main">
          <h2>Daftar Tiket</h2>
          {loadError && <div className="error-message">{loadError}</div>}
          <TicketList
            tickets={tickets}
            onSelect={handleSelect}
            selectedId={selectedId}
            loading={loading}
          />

          {selectedTicket && (
            <TicketDetail
              ticket={selectedTicket}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
              onClose={() => {
                setSelectedId(null);
                setSelectedTicket(null);
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}
