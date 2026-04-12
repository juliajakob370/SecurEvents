import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header/Header";
import "../../styles/MainPage.css";
import "../../styles/MyEventsPage.css";
import "../../styles/[12]AdminDashboardPage.css";
import {
  approveEvent,
  cancelBookingAsAdmin,
  cancelEventAsAdmin,
  getAdminBookings,
  getAdminUsers,
  getAllEvents,
  getPendingEvents,
  rejectEvent,
  suspendUser,
  unsuspendUser,
} from "../../api/adminApi";

type AdminUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isSuspended: boolean;
};

type EventRow = {
  id?: number;
  title: string;
  organizer: string;
  status: string;
  date: string;
  time: string;
};

type Booking = {
  id: number;
  eventTitle: string;
  buyerEmail: string;
  quantity: number;
  totalAmount: number;
  status: string;
};

const AdminDashboardPage: React.FC = () => {
  const [pendingEvents, setPendingEvents] = useState<EventRow[]>([]);
  const [allEvents, setAllEvents] = useState<EventRow[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      setError("");
      const [pendingData, allEventsData, usersData, bookingsData] = await Promise.all([
        getPendingEvents(),
        getAllEvents(),
        getAdminUsers(),
        getAdminBookings(),
      ]);

      setPendingEvents(Array.isArray(pendingData) ? pendingData : []);
      setAllEvents(Array.isArray(allEventsData) ? allEventsData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admin dashboard.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;

    return users.filter((u) =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term)
    );
  }, [users, search]);

  const filteredBookings = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return bookings;

    return bookings.filter((b) =>
      b.eventTitle.toLowerCase().includes(term) ||
      b.buyerEmail.toLowerCase().includes(term) ||
      b.status.toLowerCase().includes(term)
    );
  }, [bookings, search]);

  const filteredEvents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return allEvents;

    return allEvents.filter((e) =>
      e.title.toLowerCase().includes(term) ||
      e.organizer.toLowerCase().includes(term) ||
      e.status.toLowerCase().includes(term)
    );
  }, [allEvents, search]);

  const totalRevenue = useMemo(
    () => bookings.filter((b) => b.status === "Confirmed").reduce((sum, b) => sum + Number(b.totalAmount || 0), 0),
    [bookings]
  );

  return (
    <div style={{ padding: "20px" }}>
      <Header centerType="title" title="ADMIN DASHBOARD" showHome={true} />

      {error && <p className="form-error">{error}</p>}

      <div className="admin-grid">
        <div className="admin-stat"><div className="admin-stat-title">Pending Events</div><div className="admin-stat-value">{pendingEvents.length}</div></div>
        <div className="admin-stat"><div className="admin-stat-title">Total Events</div><div className="admin-stat-value">{allEvents.length}</div></div>
        <div className="admin-stat"><div className="admin-stat-title">Users</div><div className="admin-stat-value">{users.length}</div></div>
        <div className="admin-stat"><div className="admin-stat-title">Confirmed Revenue</div><div className="admin-stat-value">${totalRevenue.toFixed(2)}</div></div>
      </div>

      <div className="admin-toolbar">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users, events, bookings..." />
      </div>

      <div className="events-container">
        <div className="events-scroll">
          <div className="account-section-card admin-section">
            <h3>Pending Event Moderation</h3>
            {pendingEvents.length === 0 ? <p>No pending events.</p> : pendingEvents.map((ev) => (
              <div key={ev.id} className="admin-row">
                <div>
                  <strong>{ev.title}</strong> - {ev.organizer} <span className="admin-pill pending">pending</span>
                </div>
                <div className="admin-actions">
                  <button className="admin-btn success" onClick={async () => { if (!ev.id) return; await approveEvent(ev.id); await load(); }}>Approve</button>
                  <button className="admin-btn danger" onClick={async () => { if (!ev.id) return; await rejectEvent(ev.id); await load(); }}>Reject</button>
                </div>
              </div>
            ))}
          </div>

          <div className="account-section-card admin-section">
            <h3>All Events Control</h3>
            {filteredEvents.slice(0, 30).map((ev) => (
              <div key={ev.id} className="admin-row">
                <div>
                  <strong>{ev.title}</strong> - {ev.organizer} - {ev.date} {ev.time} <span className={`admin-pill ${ev.status}`}>{ev.status}</span>
                </div>
                <div className="admin-actions">
                  <button className="admin-btn danger" onClick={async () => { if (!ev.id) return; await cancelEventAsAdmin(ev.id); await load(); }}>
                    Cancel Event
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="account-section-card admin-section">
            <h3>User Access Control</h3>
            {filteredUsers.map((u) => (
              <div key={u.id} className="admin-row">
                <div>
                  <strong>{u.firstName} {u.lastName}</strong> ({u.email}) [{u.role}] {u.isSuspended && <span className="admin-pill suspended">suspended</span>}
                </div>
                {u.role !== "Admin" && (
                  <div className="admin-actions">
                    <button className={`admin-btn ${u.isSuspended ? "success" : "danger"}`} onClick={async () => { u.isSuspended ? await unsuspendUser(u.id) : await suspendUser(u.id); await load(); }}>
                      {u.isSuspended ? "Unsuspend" : "Suspend"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="account-section-card admin-section">
            <h3>Tickets / Purchases Control</h3>
            {filteredBookings.slice(0, 50).map((b) => (
              <div key={b.id} className="admin-row">
                <div>
                  <strong>#{b.id}</strong> {b.eventTitle} - {b.buyerEmail} - Qty {b.quantity} - ${Number(b.totalAmount).toFixed(2)} <span className={`admin-pill ${b.status.toLowerCase()}`}>{b.status}</span>
                </div>
                <div className="admin-actions">
                  {b.status === "Confirmed" && (
                    <button className="admin-btn danger" onClick={async () => { await cancelBookingAsAdmin(b.id); await load(); }}>
                      Cancel Ticket
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
