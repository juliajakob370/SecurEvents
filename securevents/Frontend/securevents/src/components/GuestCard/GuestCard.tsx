import React, { useState } from "react";
import "./GuestCard.css";

type Props = {
  id: number;
  title: string;
  name: string;
  email: string;
  dateTime: string;
  status?: string;
  onCancel?: (id: number) => void;
  cancelling?: boolean;
};

const GuestCard: React.FC<Props> = ({ id, title, name, email, dateTime, status = "Confirmed", onCancel, cancelling = false }) => {
  const [checkedIn, setCheckedIn] = useState(false);

  const handleCheckIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedIn(!checkedIn);
  };

  return (
    <div className={`guest-card ${checkedIn ? "checked-in" : ""}`}>
      
      {/* LEFT: CHECK BUTTON */}
      <button className="guest-check-btn" onClick={handleCheckIn}>
        <i className={`bi ${checkedIn ? "bi-check-circle-fill" : "bi-person"}`}></i>
      </button>

      {/* EVENT TITLE */}
      <span className="guest-title">{title}</span>

        <div className="guest-name-block">
            <span className="guest-name">{name}</span>
            <span className="guest-email">{email}</span>
        </div>

      {/* DATE TIME */}
      <span className="guest-datetime">
        <i className="bi bi-calendar-event"></i>
        {dateTime}
      </span>

      <button
        className="btn delete-btn"
        onClick={(e) => {
          e.stopPropagation();
          onCancel?.(id);
        }}
        disabled={status !== "Confirmed" || cancelling}
      >
        {cancelling ? "Cancelling..." : status === "Confirmed" ? "Cancel Ticket" : status}
      </button>

    </div>
  );
};

export default GuestCard;