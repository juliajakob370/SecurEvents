// Imports: React, router navigation, local styles, and event context.
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./MyEventCard.css";
import { EventContext } from "../../context/EventContext";
import { refundCancelEvent, requestEventCancelCode } from "../../api/eventApi";
import defaultImage from "../../assets/default-image.png";

// Props for each event card in My Events page.
type Props = {
    id?: number;
    title: string;
    organizer: string;
    location: string;
    price: string;
    image: string;
    date: string;
    time: string;
    description: string;
    capacity: number;
    status: string;
    index: number;
};

// My Event card component.
const MyEventCard: React.FC<Props> = ({
    id,
    title,
    organizer,
    location,
    price,
    image,
    date,
    time,
    description,
    capacity,
    status,
    index
}) => {
    const navigate = useNavigate();
    const { removeEvent, refreshEvents } = useContext(EventContext);
    const [processing, setProcessing] = React.useState(false);

    // Delete or refund action.
    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (processing) return;

        const isPast = status === "past" || status === "cancelled" || status === "pending";

        const confirmMessage = isPast
            ? "Are you sure you want to cancel this event?"
            : "Refund all tickets and cancel this event?";

        const confirmDelete = window.confirm(confirmMessage);

        if (!confirmDelete || !id) {
            return;
        }

        setProcessing(true);
        try {
            if (isPast) {
                await removeEvent(id);
                return;
            }

            await requestEventCancelCode(id);
            const code = window.prompt("Verification code sent to your email. Enter code to refund and cancel event:", "");
            if (!code) {
                return;
            }

            await refundCancelEvent(id, code.trim());
            await refreshEvents();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to refund and cancel event.");
        } finally {
            setProcessing(false);
        }
    };

    const isCancelled = status === "cancelled";
    const isPending = status === "pending";

    return (
        <div
            className={`my-event-card ${isCancelled ? "cancelled" : ""} ${isPending ? "pending" : ""}`}
            onClick={() =>
                navigate("/get-tickets", {
                    state: {
                        event: {
                            id,
                            title,
                            organizer,
                            location,
                            price,
                            image,
                            date,
                            time,
                            description,
                            capacity,
                            status
                        }
                    }
                })
            }
        >
            {/* Left: event image */}
            <div className="event-image">
                <img
                    src={image || defaultImage}
                    alt={title}
                    onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== defaultImage) {
                            target.src = defaultImage;
                        }
                    }}
                />
            </div>

            {/* Middle: event content */}
            <div className="event-content">
                <div className="event-title-row">
                    <h3 className="event-title">{title}</h3>

                    <span className={`event-status ${status}`}>
                        {status === "active" ? "Active" : status === "cancelled" ? "Cancelled" : status === "pending" ? "Pending" : "Past"}
                    </span>
                </div>

                <div className="event-row">
                    <span className="event-organizer">{organizer}</span>

                    <span className="event-datetime">
                        <i className="bi bi-calendar-event"></i>
                        {date} • {time}
                    </span>
                </div>

                <div className="event-row">
                    <div className="event-location">
                        <i className="bi bi-geo-alt"></i>
                        <span>{location}</span>
                    </div>

                    <button
                        className="event-price-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate("/get-tickets", {
                                state: {
                                    event: {
                                        id,
                                        title,
                                        organizer,
                                        location,
                                        price,
                                        image,
                                        date,
                                        time,
                                        description,
                                        capacity,
                                        status
                                    }
                                }
                            });
                        }}
                    disabled={isPending}
                    >
                        {price}
                    </button>
                </div>
            </div>

            {/* Right: action buttons */}
            <div className="event-actions">
                <button
                    className="btn view-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate("/guest-list", {
                            state: {
                                event: {
                                    id,
                                    title,
                                    organizer,
                                    location,
                                    price,
                                    image,
                                    date,
                                    time,
                                    description,
                                    capacity,
                                    status
                                }
                            }
                        });
                    }}
                    disabled={isCancelled}
                >
                    <i className="bi bi-people-fill"></i>
                    View Guests
                </button>

                <button
                    className="btn edit-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate("/edit-event", {
                            state: {
                                event: {
                                    id,
                                    title,
                                    organizer,
                                    location,
                                    price,
                                    image,
                                    date,
                                    time,
                                    description,
                                    capacity,
                                    status,
                                    index
                                }
                            }
                        });
                    }}
                >
                    <i className="bi bi-pencil-fill"></i>
                    Edit Event
                </button>

                <button
                    className="btn delete-btn"
                    onClick={handleDelete}
                    disabled={isCancelled || processing}
                >
                    <i className={`bi ${status === "past" || status === "cancelled" || status === "pending" ? "bi-trash-fill" : "bi-cash-coin"}`}></i>
                    {processing
                        ? "Processing..."
                        : status === "pending"
                            ? "Cancel Pending"
                            : status === "past" || status === "cancelled"
                                ? "Cancelled"
                                : "Refund"}
                </button>
            </div>
        </div>
    );
};

export default MyEventCard;