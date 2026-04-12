// Auth API functions for login, signup, verification, and current user.
const BASE_URL = "http://localhost:5000/api/users";
const TOKEN_KEY = "securevents_token";
const REFRESH_TOKEN_KEY = "securevents_refresh_token";

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

async function tryRefreshToken() {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
        return false;
    }

    const response = await fetch(`${BASE_URL}/refresh-token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        return false;
    }

    const data = await response.json();
    if (data?.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
    }
    if (data?.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    }

    return true;
}

function getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// Update logged-in user profile.
export async function updateCurrentUser(
    firstName: string,
    lastName: string,
    email: string,
    oldEmailCode?: string,
    newEmailCode?: string
) {
    const response = await fetch(`${BASE_URL}/me`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify({ firstName, lastName, email, oldEmailCode, newEmailCode })
    });

    if (!response.ok) {
        throw await buildError(response, "Failed to update profile");
    }

    return await response.json();
}

export async function requestEmailChangeCodes(newEmail: string) {
    const response = await fetch(`${BASE_URL}/email-change/request-codes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify({ newEmail })
    });

    if (!response.ok) {
        throw await buildError(response, "Failed to send email-change codes");
    }

    return await response.json();
}

// Send dedicated payment verification code for logged-in user.
export async function requestPaymentCode() {
    const response = await fetch(`${BASE_URL}/payment/send-code`, {
        method: "POST",
        headers: {
            ...getAuthHeaders()
        }
    });

    if (!response.ok) {
        throw await buildError(response, "Failed to send payment verification code");
    }

    return await response.json();
}

// Verify dedicated payment verification code for logged-in user.
export async function verifyPaymentCode(code: string) {
    const response = await fetch(`${BASE_URL}/payment/verify-code`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify({ code })
    });

    if (!response.ok) {
        throw await buildError(response, "Failed to verify payment code");
    }

    return await response.json();
}

// Send login code to email.
export async function requestLoginCode(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: normalizedEmail })
    });

    if (!response.ok) {
        throw await buildError(response, "Failed to send login code");
    }

    return await response.json();
}

// Verify login code.
export async function verifyLoginCode(email: string, code: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const response = await fetch(`${BASE_URL}/verify-login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: normalizedEmail, code })
    });

    if (!response.ok) {
        throw await buildError(response, "Failed to verify login code");
    }

    const data = await response.json();
    if (data?.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
    }
    if (data?.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    }

    return data;
}

// Send signup code.
export async function requestSignupCode(firstName: string, lastName: string, email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const response = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ firstName, lastName, email: normalizedEmail })
    });

    if (!response.ok) {
        throw await buildError(response, "Failed to send signup code");
    }

    return await response.json();
}

// Verify signup code.
export async function verifySignupCode(email: string, code: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const response = await fetch(`${BASE_URL}/verify-signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: normalizedEmail, code })
    });

    if (!response.ok) {
        throw await buildError(response, "Failed to verify signup code");
    }

    const data = await response.json();
    if (data?.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
    }
    if (data?.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    }

    return data;
}

// Get currently logged-in user from backend JWT token.
export async function getCurrentUser() {
    let response = await fetch(`${BASE_URL}/me`, {
        method: "GET",
        headers: {
            ...getAuthHeaders()
        }
    });

    if (response.status === 401) {
        const refreshed = await tryRefreshToken();
        if (refreshed) {
            response = await fetch(`${BASE_URL}/me`, {
                method: "GET",
                headers: {
                    ...getAuthHeaders()
                }
            });
        }
    }

    if (!response.ok) {
        throw await buildError(response, "Failed to get current user");
    }

    return await response.json();
}

// Log out current user.
export async function logoutUser() {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const response = await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify({ refreshToken })
    });

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    if (!response.ok) {
        throw await buildError(response, "Failed to log out");
    }

    return await response.json();
}