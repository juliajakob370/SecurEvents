import React from "react";
import "./TicketCard.css";

type Props = {
  id?: number;
  title: string;
  name: string;
  dateTime: string;
  status: "active" | "used" | "refunded";
  onClick?: () => void;
};

const TicketCard: React.FC<Props> = ({ title, name, dateTime, status, onClick }) => {
  return (
    <div
      className={`ticket-card ${status === "used" ? "ticket-used" : ""} ${status === "refunded" ? "ticket-refunded" : ""}`}
      onClick={onClick}
    >
      {/* LEFT: ICON */}
      <div className="ticket-icon">
        <i
          className={`bi ${status === "used" ? "bi-archive" : status === "refunded" ? "bi-cash-coin" : "bi-ticket-perforated"}`}
        ></i>
      </div>

      {/* RIGHT: INFO */}
      <div className="ticket-content">
        <h3 className="ticket-title">{title}</h3>

        <div className="ticket-row">
          <span className="ticket-name">{name}</span>

          <span className="ticket-datetime">
            <i className="bi bi-calendar-event"></i>
            {dateTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
