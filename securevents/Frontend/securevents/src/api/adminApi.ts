import { EventItem } from "./eventApi";
import { authFetch } from "./authFetch";

const USER_BASE = "http://localhost:5000/api/users";
const EVENT_BASE = "http://localhost:5000/api/events";
const BOOKING_BASE = "http://localhost:5000/api/bookings";

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

export async function getAdminUsers() {
    const response = await authFetch(`${USER_BASE}/admin/all`);

    if (!response.ok) {
        throw await buildError(response, "Failed to load users");
    }

    return await response.json();
}

export async function suspendUser(userId: number) {
    const response = await authFetch(`${USER_BASE}/admin/${userId}/suspend`, {
        method: "POST"
    });

    if (!response.ok) {
        throw await buildError(response, "Failed to suspend user");
    }

    return await response.json();
}

export async function unsuspendUser(userId: number) {
    const response = await authFetch(`${USER_BASE}/admin/${userId}/unsuspend`, {
        method: "POST"
    });

    if (!response.ok) {
        throw await buildError(response, "Failed to unsuspend user");
    }

    return await response.json();
}

export async function getPendingEvents(): Promise<EventItem[]> {
    const response = await authFetch(`${EVENT_BASE}/admin/pending`);

    if (!response.ok) {
        throw await buildError(response, "Failed to load pending events");
    }

    return await response.json();
}

export async function getAllEvents(): Promise<EventItem[]> {
    const response = await authFetch(`${EVENT_BASE}/admin/all`);

    if (!response.ok) {
        throw await buildError(response, "Failed to load all events");
    }

    return await response.json();
}

export async function approveEvent(eventId: number) {
    const response = await authFetch(`${EVENT_BASE}/${eventId}/admin/approve`, {
        method: "POST"
    });

    if (!response.ok) {
        throw await buildError(response, "Failed to approve event");
    }

    return await response.json();
}

export async function rejectEvent(eventId: number) {
    const response = await authFetch(`${EVENT_BASE}/${eventId}/admin/reject`, {
        method: "POST"
    });

    if (!response.ok) {
        throw await buildError(response, "Failed to reject event");
    }

    return await response.json();
}

export async function cancelEventAsAdmin(eventId: number) {
    const response = await authFetch(`${EVENT_BASE}/${eventId}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw await buildError(response, "Failed to cancel event");
    }

    return await response.json();
}

export async function getAdminBookings() {
    const response = await authFetch(`${BOOKING_BASE}/admin/all`);

    if (!response.ok) {
        throw await buildError(response, "Failed to load bookings");
    }

    return await response.json();
}

export async function cancelBookingAsAdmin(bookingId: number) {
    const response = await authFetch(`${BOOKING_BASE}/${bookingId}/cancel`, {
        method: "POST"
    });

    if (!response.ok) {
        throw await buildError(response, "Failed to cancel booking");
    }

    return await response.json();
}
