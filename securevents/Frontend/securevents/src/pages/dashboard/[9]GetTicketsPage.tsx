// Imports: React state, router hooks, reusable header, and styles.
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import "../../styles/MainPage.css";
import "../../styles/[9]GetTicketsPage.css";
import { getEventAvailability } from "../../api/eventApi";
import defaultImage from "../../assets/default-image.png";

// Type for selected event passed from previous page.
type SelectedEvent = {
    id?: number;
    title: string;
    organizer: string;
    location: string;
    price: string;
    image: string;
    date: string;
    time: string;
    description: string;
    status: string;
    capacity: number;
};

// Get Tickets page.
const GetTicketsPage: React.FC = () => {
    // Navigation and router state.
    const navigate = useNavigate();
    const location = useLocation();

    // Event passed from EventCard.
    const event = location.state?.event as SelectedEvent | undefined;

    // Ticket quantity state.
    const [quantity, setQuantity] = useState(1);
    const [remainingTickets, setRemainingTickets] = useState<number | null>(null);
    const [availabilityMessage, setAvailabilityMessage] = useState("");

    // Convert price string safely into a number.
    const priceNumber = useMemo(() => {
        if (!event?.price) return 0;
        if (event.price.toLowerCase() === "free") return 0;
        return Number(event.price.replace("$", ""));
    }, [event]);

    // Calculate total price.
    const total = quantity * priceNumber;
    // Availability must be known and > 0 before purchase is allowed.
    // Falling back to capacity is unsafe when the availability API fails (event may be sold out).
    const isPurchasable = event?.status === "active" && (remainingTickets ?? 0) > 0;

    useEffect(() => {
        const loadAvailability = async () => {
            if (!event?.id) {
                setRemainingTickets(null);
                return;
            }

            try {
                const data = await getEventAvailability(event.id);
                setRemainingTickets(Number(data?.remaining ?? 0));
                setAvailabilityMessage("");
            } catch (err) {
                setAvailabilityMessage(err instanceof Error ? err.message : "Failed to load availability.");
                setRemainingTickets(null);
            }
        };

        loadAvailability();
    }, [event?.id]);

    // Clamp quantity when availability resolves or drops below the current selection.
    useEffect(() => {
        if (remainingTickets == null) return;
        if (quantity > remainingTickets) {
            setQuantity(Math.max(1, remainingTickets));
        }
    }, [remainingTickets, quantity]);

    // Handle quantity change with safe limits.
    const handleQuantityChange = (value: string) => {
        if (!event) return;

        const parsed = Number(value);

        if (Number.isNaN(parsed)) {
            setQuantity(1);
            return;
        }

        if (parsed < 1) {
            setQuantity(1);
            return;
        }

        const maxTickets = remainingTickets ?? event.capacity;
        if (parsed > maxTickets) {
            setQuantity(maxTickets);
            return;
        }

        setQuantity(parsed);
    };

    return (
        <div style={{ padding: "20px" }}>
            {/* Header */}
            <Header centerType="title" title="Get Tickets" showHome={true} />

            {/* Main container */}
            <div className="events-container">
                <div className="events-scroll tickets-scroll">
                    {!event ? (
                        <div className="ticket-selection-card">
                            <h2>No event selected</h2>
                            <p>Please return to the main page and choose an event.</p>
                        </div>
                    ) : (
                        <div className="tickets-page-layout">
                            {/* Event details card */}
                            <div className="ticket-event-card">
                                <img
                                    src={event.image || defaultImage}
                                    alt={event.title}
                                    className="ticket-event-image"
                                    onError={(e) => {
                                        const target = e.currentTarget;
                                        if (target.src !== defaultImage) {
                                            target.src = defaultImage;
                                        }
                                    }}
                                />

                                <div className="ticket-event-info">
                                    <h2>{event.title}</h2>
                                    <p><strong>Organizer:</strong> {event.organizer}</p>
                                    <p><strong>Location:</strong> {event.location}</p>
                                    <p><strong>Date:</strong> {event.date}</p>
                                    <p><strong>Time:</strong> {event.time}</p>
                                    <p><strong>Status:</strong> {event.status}</p>
                                    <p><strong>Capacity:</strong> {event.capacity}</p>
                                    <p><strong>Remaining Tickets:</strong> {remainingTickets ?? "..."}</p>
                                    <p><strong>Price per Ticket:</strong> {event.price}</p>
                                    <p><strong>Description:</strong> {event.description}</p>
                                </div>
                            </div>

                            {/* Ticket selection card */}
                            <div className="ticket-selection-card">
                                <h3>Select Tickets</h3>

                                {!isPurchasable && (
                                    <p className="form-error">
                                        This event is {event.status}. Ticket purchase is not available.
                                    </p>
                                )}
                                {availabilityMessage && <p className="form-error">{availabilityMessage}</p>}

                                <div className="ticket-quantity-row">
                                    <label>Number of Tickets</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={(remainingTickets ?? 0) > 0 ? (remainingTickets ?? 1) : 1}
                                        value={quantity}
                                        onChange={(e) => handleQuantityChange(e.target.value)}
                                        disabled={!isPurchasable}
                                    />
                                </div>

                                <div className="ticket-total-box">
                                    <p>Ticket Price: {event.price}</p>
                                    <p>Quantity: {quantity}</p>
                                    <h3>Total: ${total.toFixed(2)}</h3>
                                </div>

                                <button
                                    className="proceed-payment-btn"
                                    disabled={!isPurchasable}
                                    onClick={() =>
                                        navigate("/payment", {
                                            state: {
                                                event,
                                                quantity,
                                                total
                                            }
                                        })
                                    }
                                >
                                    Proceed to Payment
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GetTicketsPage;