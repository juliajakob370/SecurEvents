const BASE_URL = "http://localhost:5000/api/bookings";

function getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem("securevents_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
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

export async function createBooking(payload: {
    eventId: number;
    eventTitle: string;
    quantity: number;
    totalAmount: number;
    buyerEmail: string;
    transactionId: number;
}) {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw await buildError(response, "Failed to create booking");
    }

    return await response.json();
}

export async function getBookingsByEmail(email: string) {
    const response = await fetch(`${BASE_URL}?email=${encodeURIComponent(email)}`, {
        method: "GET",
        headers: {
            ...getAuthHeaders()
        }
    });

    if (!response.ok) {
        throw await buildError(response, "Failed to load your tickets");
    }

    return await response.json();
}

export async function getBookingsByEvent(eventId: number) {
    const response = await fetch(`${BASE_URL}?eventId=${eventId}`, {
        method: "GET",
        headers: {
            ...getAuthHeaders()
        }
    });

    if (!response.ok) {
        throw await buildError(response, "Failed to load guests");
    }

    return await response.json();
}

export async function cancelBooking(bookingId: number) {
    const response = await fetch(`${BASE_URL}/${bookingId}/cancel`, {
        method: "POST",
        headers: {
            ...getAuthHeaders()
        }
    });

    if (!response.ok) {
        throw await buildError(response, "Failed to cancel ticket");
    }

    return await response.json();
}
