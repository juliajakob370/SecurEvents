import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import "../../styles/MainPage.css";
import "../../styles/[9]GetTicketsPage.css";

const GetTicketsPage: React.FC = () => {
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);

    const ticketPrice = 25;
    const total = quantity * ticketPrice;

    return (
        <div style={{ padding: "20px" }}>
            <Header centerType="title" title="Get Tickets" showHome={true} />

            <div className="events-container">
                <div className="events-scroll tickets-scroll">
                    <div className="tickets-page-layout">

                        <div className="ticket-event-card">
                            <img
                                src="https://tse4.mm.bing.net/th/id/OIP.KZ2a11mYjDyMMZyi5kbvwQHaHa?w=1200&h=1200&rs=1&pid=ImgDetMain&o=7&rm=3"
                                alt="Event"
                                className="ticket-event-image"
                            />

                            <div className="ticket-event-info">
                                <h2>Summer Music Festival</h2>
                                <p><strong>Organizer:</strong> Mr. Music</p>
                                <p><strong>Location:</strong> Toronto, ON</p>
                                <p><strong>Date:</strong> Aug 12 • 7:00 PM</p>
                                <p><strong>Price per Ticket:</strong> ${ticketPrice}</p>
                            </div>
                        </div>

                        <div className="ticket-selection-card">
                            <h3>Select Tickets</h3>

                            <div className="ticket-quantity-row">
                                <label>Number of Tickets</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                />
                            </div>

                            <div className="ticket-total-box">
                                <p>Ticket Price: ${ticketPrice}</p>
                                <p>Quantity: {quantity}</p>
                                <h3>Total: ${total}</h3>
                            </div>

                            <button
                                className="proceed-payment-btn"
                                onClick={() => navigate("/payment", { state: { total, quantity } })}
                            >
                                Proceed to Payment
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default GetTicketsPage;