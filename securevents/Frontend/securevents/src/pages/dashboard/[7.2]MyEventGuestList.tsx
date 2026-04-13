import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import GuestCard from "../../components/GuestCard/GuestCard";
import "../../styles/SecurEventsStyle.css";
import "../../styles/GuestListPage.css";
import { cancelBooking, getBookingsByEvent } from "../../api/bookingApi";

type SelectedEvent = {
  id?: number;
  title: string;
  price: string;
  capacity: number;
  date?: string;
  time?: string;
};

type BookingItem = {
  id: number;
  eventTitle: string;
  quantity: number;
  totalAmount: number;
  buyerEmail: string;
  status: string;
  bookedAt: string;
};

const GuestListPage: React.FC = () => {
  const location = useLocation();
  const event = location.state?.event as SelectedEvent | undefined;

  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const loadGuests = useCallback(async () => {
    if (!event?.id) {
      setBookings([]);
      return;
    }

    try {
      const list = await getBookingsByEvent(event.id);
      setBookings(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load guests.");
      setBookings([]);
    }
  }, [event?.id]);

  useEffect(() => {
    loadGuests();
  }, [loadGuests]);

  const totalGuests = useMemo(
    () => bookings.filter((b) => b.status === "Confirmed").reduce((sum, b) => sum + b.quantity, 0),
    [bookings]
  );

  const revenue = useMemo(
    () => bookings.filter((b) => b.status === "Confirmed").reduce((sum, b) => sum + Number(b.totalAmount || 0), 0),
    [bookings]
  );

  const handleCancel = async (bookingId: number) => {
    if (cancellingId !== null) return;

    const confirmed = window.confirm(
      "Cancel this guest's ticket and refund them? This cannot be undone."
    );
    if (!confirmed) return;

    setCancellingId(bookingId);
    setError("");
    try {
      await cancelBooking(bookingId);
      await loadGuests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel ticket.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Header centerType="title" title="GUEST LIST" showHome={true} />

      <div className="guest-summary">
        <div className="summary-title">
          {event?.title || "No Event Selected"}
        </div>

        <div className="summary-right">
          <div className="summary-item">
            <i className="bi bi-cash-stack"></i>
            ${revenue.toFixed(2)}
          </div>

          <div className="summary-item">
            <i className="bi bi-people-fill"></i>
            {totalGuests} / {event?.capacity ?? 0}
          </div>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="tickets-content">
        <div className="events-container">
          <div className="events-scroll">
            {bookings.length === 0 ? (
              <div className="no-events">
                <p>No guests for this event yet.</p>
              </div>
            ) : (
              bookings.map((booking) => {
                const nameFromEmail = booking.buyerEmail.split("@")[0];
                return (
                  <GuestCard
                    key={booking.id}
                    id={booking.id}
                    title={booking.eventTitle}
                    name={nameFromEmail}
                    email={booking.buyerEmail}
                    dateTime={`${event?.date ?? ""} ${event?.time ?? ""}`.trim() || new Date(booking.bookedAt).toLocaleString()}
                    status={booking.status}
                    onCancel={handleCancel}
                    cancelling={cancellingId === booking.id}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestListPage;