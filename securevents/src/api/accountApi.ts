// Profile type.
export type ProfileData = {
    fullName: string;
    email: string;
    profileImage?: string;
};

// Payment card type.
export type PaymentMethod = {
    id: number | string;
    cardName: string;
    cardLast4: string;
    expiryDate: string;
    billingAddress: string;
};

const USER_BASE_URL = "http://localhost:5000/api/users";
const PAYMENT_BASE_URL = "http://localhost:5000/api/payment-methods";

// Get current profile.
export async function getProfile() {
    const response = await fetch(`${USER_BASE_URL}/me`, {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Failed to load profile");
    }

    return await response.json();
}

// Update profile.
export async function updateProfile(profileData: ProfileData) {
    const response = await fetch(`${USER_BASE_URL}/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(profileData)
    });

    if (!response.ok) {
        throw new Error("Failed to update profile");
    }

    return await response.json();
}

// Get saved payment methods.
export async function getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await fetch(PAYMENT_BASE_URL, {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Failed to load payment methods");
    }

    return await response.json();
}

// Add payment method.
export async function createPaymentMethod(cardData: {
    cardName: string;
    cardNumber: string;
    expiryDate: string;
    billingAddress: string;
}) {
    const response = await fetch(PAYMENT_BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(cardData)
    });

    if (!response.ok) {
        throw new Error("Failed to save payment method");
    }

    return await response.json();
}

// Delete payment method.
export async function deletePaymentMethod(cardId: string | number) {
    const response = await fetch(`${PAYMENT_BASE_URL}/${cardId}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Failed to delete payment method");
    }

    return await response.json();
}