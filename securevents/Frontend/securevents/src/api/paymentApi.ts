const BASE_URL = "http://localhost:5000/api/payments";

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

export async function checkoutPayment(payload: {
    eventId: number;
    eventTitle: string;
    quantity: number;
    totalAmount: number;
    buyerEmail: string;
    cardLast4: string;
}) {
    const response = await fetch(`${BASE_URL}/checkout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw await buildError(response, "Payment failed");
    }

    return await response.json();
}
