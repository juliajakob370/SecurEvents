// Auth API functions for login, signup, verification, and current user.
const BASE_URL = "http://localhost:5000/api/users";

// Send login code to email.
export async function requestLoginCode(email: string) {
    const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email })
    });

    if (!response.ok) {
        throw new Error("Failed to send login code");
    }

    return await response.json();
}

// Verify login code.
export async function verifyLoginCode(email: string, code: string) {
    const response = await fetch(`${BASE_URL}/verify-login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include", //credentials: "include" is what lets cookies go with the request
        body: JSON.stringify({ email, code })
    });

    if (!response.ok) {
        throw new Error("Failed to verify login code");
    }

    return await response.json();
}

// Send signup code.
export async function requestSignupCode(firstName: string, lastName: string, email: string) {
    const response = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ firstName, lastName, email })
    });

    if (!response.ok) {
        throw new Error("Failed to send signup code");
    }

    return await response.json();
}

// Verify signup code.
export async function verifySignupCode(email: string, code: string) {
    const response = await fetch(`${BASE_URL}/verify-signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email, code })
    });

    if (!response.ok) {
        throw new Error("Failed to verify signup code");
    }

    return await response.json();
}

// Get currently logged-in user from backend session cookie.
export async function getCurrentUser() {
    const response = await fetch(`${BASE_URL}/me`, {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Failed to get current user");
    }

    return await response.json();
}

// Log out current user.
export async function logoutUser() {
    const response = await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Failed to log out");
    }

    return await response.json();
}