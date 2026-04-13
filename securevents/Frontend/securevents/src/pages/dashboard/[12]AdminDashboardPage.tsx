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
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const runAction = async (key: string, confirmMessage: string | null, action: () => Promise<unknown>) => {
    if (busyKey !== null) return;
    if (confirmMessage && !window.confirm(confirmMessage)) return;

    setBusyKey(key);
    setError("");
    try {
      await action();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setBusyKey(null);
    }
  };

  const load = async () => {
    setError("");

    const [pendingResult, allEventsResult, usersResult, bookingsResult] = await Promise.allSettled([
      getPendingEvents(),
      getAllEvents(),
      getAdminUsers(),
      getAdminBookings(),
    ]);

    const failures: string[] = [];

    if (pendingResult.status === "fulfilled") {
      setPendingEvents(Array.isArray(pendingResult.value) ? pendingResult.value : []);
    } else {
      failures.push("pending events");
      setPendingEvents([]);
    }

    if (allEventsResult.status === "fulfilled") {
      setAllEvents(Array.isArray(allEventsResult.value) ? allEventsResult.value : []);
    } else {
      failures.push("all events");
      setAllEvents([]);
    }

    if (usersResult.status === "fulfilled") {
      setUsers(Array.isArray(usersResult.value) ? usersResult.value : []);
    } else {
      failures.push("users");
      setUsers([]);
    }

    if (bookingsResult.status === "fulfilled") {
      setBookings(Array.isArray(bookingsResult.value) ? bookingsResult.value : []);
    } else {
      failures.push("bookings");
      setBookings([]);
    }

    if (failures.length > 0) {
      setError(`Failed to load: ${failures.join(", ")}. Please refresh or re-login.`);
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
                  <button
                    className="admin-btn success"
                    disabled={busyKey !== null}
                    onClick={() => ev.id && runAction(`approve:${ev.id}`, `Approve "${ev.title}"?`, () => approveEvent(ev.id!))}
                  >
                    {busyKey === `approve:${ev.id}` ? "Approving..." : "Approve"}
                  </button>
                  <button
                    className="admin-btn danger"
                    disabled={busyKey !== null}
                    onClick={() => ev.id && runAction(`reject:${ev.id}`, `Reject "${ev.title}"? This cancels the event.`, () => rejectEvent(ev.id!))}
                  >
                    {busyKey === `reject:${ev.id}` ? "Rejecting..." : "Reject"}
                  </button>
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
                  <button
                    className="admin-btn danger"
                    disabled={busyKey !== null}
                    onClick={() => ev.id && runAction(`cancelEvent:${ev.id}`, `Cancel event "${ev.title}"? This cannot be undone.`, () => cancelEventAsAdmin(ev.id!))}
                  >
                    {busyKey === `cancelEvent:${ev.id}` ? "Cancelling..." : "Cancel Event"}
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
                    <button
                      className={`admin-btn ${u.isSuspended ? "success" : "danger"}`}
                      disabled={busyKey !== null}
                      onClick={() => runAction(
                        `user:${u.id}`,
                        u.isSuspended
                          ? `Unsuspend ${u.email}?`
                          : `Suspend ${u.email}? They will lose access until unsuspended.`,
                        () => u.isSuspended ? unsuspendUser(u.id) : suspendUser(u.id)
                      )}
                    >
                      {busyKey === `user:${u.id}` ? "Working..." : u.isSuspended ? "Unsuspend" : "Suspend"}
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
                    <button
                      className="admin-btn danger"
                      disabled={busyKey !== null}
                      onClick={() => runAction(
                        `booking:${b.id}`,
                        `Cancel booking #${b.id} and refund ${b.buyerEmail}?`,
                        () => cancelBookingAsAdmin(b.id)
                      )}
                    >
                      {busyKey === `booking:${b.id}` ? "Cancelling..." : "Cancel Ticket"}
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
