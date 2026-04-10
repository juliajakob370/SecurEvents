import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import "../../styles/MainPage.css";
import "../../styles/[9.1]PaymentPage.css";

const PaymentPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const total = location.state?.total || 25;
    const quantity = location.state?.quantity || 1;

    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        navigate("/ticket-booked", { state: { total, quantity } });
    };

    return (
        <div style={{ padding: "20px" }}>
            <Header centerType="title" title="Payment" showHome={true} />

            <div className="events-container">
                <div className="events-scroll payment-scroll">
                    <div className="payment-page-layout">

                        <div className="payment-summary-card">
                            <h2>Order Summary</h2>
                            <p><strong>Event:</strong> Summer Music Festival</p>
                            <p><strong>Tickets:</strong> {quantity}</p>
                            <p><strong>Total Amount:</strong> ${total}</p>
                        </div>

                        <div className="payment-form-card">
                            <h2>Enter Card Details</h2>

                            <form onSubmit={handlePayment} className="payment-form">
                                <div className="account-field">
                                    <label>Name on Card</label>
                                    <input
                                        type="text"
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="account-field">
                                    <label>Card Number</label>
                                    <input
                                        type="text"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="payment-form-grid">
                                    <div className="account-field">
                                        <label>Expiry Date</label>
                                        <input
                                            type="text"
                                            value={expiryDate}
                                            onChange={(e) => setExpiryDate(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="account-field">
                                        <label>CVV</label>
                                        <input
                                            type="password"
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="confirm-payment-btn">
                                    Confirm Payment
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;