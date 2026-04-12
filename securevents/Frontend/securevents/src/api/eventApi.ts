// Event type used by frontend and backend responses.
export type EventItem = {
    id?: number;
    createdByUserId?: number | null;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    organizer: string;
    image: string;
    status: string;
    capacity: number;
    price: string;
};

const BASE_URL = "http://localhost:5000/api/events";

function getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem("securevents_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getEventAvailability(eventId: number) {
    const response = await fetch(`${BASE_URL}/${eventId}/availability`, {
        method: "GET"
    });

    if (!response.ok) {
        throw await buildError(response, "Failed to load ticket availability");
    }

    return await response.json();
}

async function buildError(response: Response, fallback: string) {
    try {
        const data = await response.json();
        if (data?.message) {
            return new Error(String(data.message));
        }
    } catch {
    }

    return new Error(fallback);
}

// Get all events from backend.
export async function getEvents(): Promise<EventItem[]> {
    const response = await fetch(BASE_URL, {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok) {
        throw await buildError(response, "Failed to load events");
    }

    return await response.json();
}

export async function requestEventCancelCode(eventId: number) {
    const response = await fetch(`${BASE_URL}/${eventId}/request-cancel-code`, {
        method: "POST",
        headers: {
            ...getAuthHeaders()
        }
    });

    if (!response.ok) {
        throw await buildError(response, "Failed to send cancellation code");
    }

    return await response.json();
}

export async function refundCancelEvent(eventId: number, code: string) {
    const response = await fetch(`${BASE_URL}/${eventId}/refund-cancel`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify({ code })
    });

    if (!response.ok) {
        throw await buildError(response, "Failed to cancel event and refund");
    }

    return await response.json();
}

export async function getMyEvents(): Promise<EventItem[]> {
    const response = await fetch(`${BASE_URL}/my`, {
        method: "GET",
        headers: {
            ...getAuthHeaders()
        }
    });

    if (!response.ok) {
        throw await buildError(response, "Failed to load your events");
    }

    return await response.json();
}

// Create a new event in backend.
export async function createEvent(eventData: EventItem) {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify(eventData)
    });

    if (!response.ok) {
        throw await buildError(response, "Failed to create event");
    }

    return await response.json();
}

// Update event.
export async function updateEvent(eventId: string, eventData: EventItem) {
    const response = await fetch(`${BASE_URL}/${eventId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify(eventData)
    });

    if (!response.ok) {
        throw await buildError(response, "Failed to update event");
    }

    return await response.json();
}

// Delete event.
export async function deleteEvent(eventId: string) {
    const response = await fetch(`${BASE_URL}/${eventId}`, {
        method: "DELETE",
        headers: {
            ...getAuthHeaders()
        }
    });

    if (!response.ok) {
        throw await buildError(response, "Failed to delete event");
    }

    return await response.json();
}