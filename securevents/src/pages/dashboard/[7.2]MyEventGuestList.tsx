import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import GuestCard from "../../components/GuestCard/GuestCard";
import "../../styles/SecurEventsStyle.css";
import "../../styles/GuestListPage.css";
import { useLocation } from "react-router-dom";
import { getEventGuests } from "../../api/eventApi";

const GuestListPage: React.FC = () => {

    const location = useLocation();
    const [guests, setGuests] = useState<any[]>([]);
    const [event, setEvent] = useState<any>(location.state?.event || null);

    useEffect(() => {
        async function loadGuests() {
            try {
                if (!event) return;
                const data = await getEventGuests(event.id || event.title);
                setGuests(data.guests || data);
            } catch (error) {
                console.error("Failed to load guests:", error);
            }
        }

        loadGuests();
    }, [event]);

  //  calculate values
  const totalGuests = guests.length;
  const revenue = event.price * totalGuests;

  return (
    <div style={{ padding: "20px" }}>

      {/* MAIN HEADER */}
      <Header
        centerType="title"
        title="GUEST LIST"
        showHome={true}
      />

      {/* SECOND HEADER (EVENT SUMMARY) */}
      <div className="guest-summary">

        {/* LEFT: EVENT TITLE */}
        <div className="summary-title">
          {event.title}
        </div>

        {/* RIGHT SIDE */}
        <div className="summary-right">

          {/* REVENUE */}
          <div className="summary-item">
            <i className="bi bi-cash-stack"></i>
            ${revenue}
          </div>

          {/* CAPACITY */}
          <div className="summary-item">
            <i className="bi bi-people-fill"></i>
            {totalGuests} / {event.capacity}
          </div>

        </div>
      </div>

      {/* LIST */}
      <div className="tickets-content">
        <div className="events-container">
          <div className="events-scroll">

            {guests.map((guest, index) => (
              <GuestCard
                key={index}
                title={event.title}
                name={guest.name}
                email={guest.email}
                dateTime={guest.dateTime}
              />
            ))}

          </div>
        </div>
      </div>

    </div>
  );
};

export default GuestListPage;