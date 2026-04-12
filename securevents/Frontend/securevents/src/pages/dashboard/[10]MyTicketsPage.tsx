import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import "../../styles/MainPage.css";
import "../../styles/MyEventsPage.css";
import "../../styles/[10]MyTicketsPage.css";
import { AuthContext } from "../../context/AuthContext";
import { getBookingsByEmail } from "../../api/bookingApi";
import TicketCard from "../../components/TicketCard/TicketCard";

type BookingItem = {
  id: number;
  eventTitle: string;
  quantity: number;
  totalAmount: number;
  buyerEmail: string;
  status: string;
  bookedAt: string;
  transactionId?: number;
};

const MyTicketsPage: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState<BookingItem[]>([]);
  const [error, setError] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<BookingItem | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user?.email) {
        setTickets([]);
        return;
      }

      try {
        const list = await getBookingsByEmail(user.email);
        const normalized = Array.isArray(list) ? list : [];
        normalized.sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime());
        setTickets(normalized);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load tickets.");
        setTickets([]);
      }
    };

    load();
  }, [user?.email]);

  return (
    <div style={{ padding: "20px" }}>
      <Header centerType="title" title="MY TICKETS" showHome={true} />

      <div className="events-container">
        <div className="events-scroll">
          {error && <p className="form-error">{error}</p>}

          {tickets.length === 0 ? (
            <div className="no-events">
              <p>No purchased tickets yet.</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                id={ticket.id}
                title={ticket.eventTitle}
                name={ticket.buyerEmail}
                dateTime={`${new Date(ticket.bookedAt).toLocaleString()} • Qty ${ticket.quantity} • $${Number(ticket.totalAmount).toFixed(2)}`}
                status={ticket.status === "Refunded" ? "refunded" : ticket.status === "Confirmed" ? "active" : "used"}
                onClick={() => setSelectedTicket(ticket)}
              />
            ))
          )}
        </div>
      </div>

      {selectedTicket && (
        <div className="receipt-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="receipt-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="receipt-title">Ticket Receipt</h3>

            <div className="receipt-row">
              <span className="receipt-label">Booking ID</span>
              <span>#{selectedTicket.id}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Event</span>
              <span>{selectedTicket.eventTitle}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Buyer</span>
              <span>{selectedTicket.buyerEmail}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Quantity</span>
              <span>{selectedTicket.quantity}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Total</span>
              <span>${Number(selectedTicket.totalAmount).toFixed(2)}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Purchased At</span>
              <span>{new Date(selectedTicket.bookedAt).toLocaleString()}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Status</span>
              <span>{selectedTicket.status}</span>
            </div>

            <div className="receipt-footer">
              <button className="receipt-close-btn" onClick={() => setSelectedTicket(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;
