// Event type used by frontend and backend responses.
export type EventItem = {
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

// Get all events from backend.
export async function getEvents(): Promise<EventItem[]> {
    const response = await fetch(BASE_URL, {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Failed to load events");
    }

    return await response.json();
}

// Create a new event in backend.
export async function createEvent(eventData: EventItem) {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(eventData)
    });

    if (!response.ok) {
        throw new Error("Failed to create event");
    }

    return await response.json();
}

// Update event.
export async function updateEvent(eventId: string, eventData: EventItem) {
    const response = await fetch(`${BASE_URL}/${eventId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(eventData)
    });

    if (!response.ok) {
        throw new Error("Failed to update event");
    }

    return await response.json();
}

// Delete event.
export async function deleteEvent(eventId: string) {
    const response = await fetch(`${BASE_URL}/${eventId}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Failed to delete event");
    }

    return await response.json();
}

// Get current user's own events.
export async function getMyEvents(): Promise<EventItem[]> {
    const response = await fetch(`${BASE_URL}/my`, {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Failed to load my events");
    }

    return await response.json();
}

// Get one event's guests.
export async function getEventGuests(eventId: string) {
    const response = await fetch(`${BASE_URL}/${eventId}/guests`, {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Failed to load guest list");
    }

    return await response.json();
}

// Refund or close event tickets.
export async function refundEvent(eventId: string) {
    const response = await fetch(`${BASE_URL}/${eventId}/refund`, {
        method: "POST",
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Failed to refund event");
    }

    return await response.json();
}