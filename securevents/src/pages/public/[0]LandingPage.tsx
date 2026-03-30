import './[0]Landing.css';
import logo from '../../assets/SecureEventLogo.png';
import eventImg from '../../assets/EventImg.jpg';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <div className="landing-container">

                <header className="landing-header">
                    <button className="about-btn">About</button>

                    <div className="header-actions">
                        <button
                            className="signup-btn"
                            onClick={() => navigate('/signup')}
                        >
                            Sign Up
                        </button>

                        <button
                            className="login-btn"
                            onClick={() => navigate('/login')}
                        >
                            Log In
                        </button>
                    </div>
                </header>

                <main className="landing-main">
                    <div className="logo-wrapper">
                        <img src={logo} alt="SecurEvents logo" className="landing-logo" />
                    </div>

                    <div className="landing-content">
                        <div className="image-box">
                            <img src={eventImg} alt="Event" className="event-image" />
                        </div>

                        <div className="description-box">
                            <h2>Welcome to SecurEvents</h2>
                            <p>
                                Securely browse events, book tickets, and manage your event experience.
                            </p>
                            <p>
                                A modern and secure platform for event organizers and guests.
                            </p>
                        </div>
                    </div>
                </main>

            </div>
        </div>
    );
}

export default LandingPage;