// Booking payload type.
export type CreateBookingPayload = {
    eventId: string | number;
    quantity: number;
    paymentMethodId: string | number;
    verificationCode: string;
};

// Create booking after payment.
export async function createBooking(payload: CreateBookingPayload) {
    const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error("Failed to create booking");
    }

    return await response.json();
}

// Get current user's bookings.
export async function getMyBookings() {
    const response = await fetch("http://localhost:5000/api/bookings/my", {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Failed to load bookings");
    }

    return await response.json();
}