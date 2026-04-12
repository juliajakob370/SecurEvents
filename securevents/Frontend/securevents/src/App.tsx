// Imports: React router, icons, and page routes.
import { EventProvider } from "./context/EventContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import LandingPage from "./pages/public/[0]LandingPage";
import LoginPage from "./pages/public/[1]LoginPage";
import LoginCodePage from "./pages/public/[1.1]LoginCodePage";
import SignupPage from "./pages/public/[2]SignupPage";
import SignupCodePage from "./pages/public/[2.1]SignupCodePage";
import MainPage from "./pages/dashboard/[3]MainPage";
import AboutPage from "./pages/public/[0.1]AboutPage";
import AboutDashboardPage from "./pages/dashboard/[11]AboutPage";
import AccountPage from "./pages/dashboard/[4]AccountPage";
import MyEventsPage from "./pages/dashboard/[7]MyEventsPage";
import GetTicketsPage from "./pages/dashboard/[9]GetTicketsPage";
import PaymentPage from "./pages/dashboard/[9.1]PaymentPage";
import TicketBookedConfirmation from "./pages/dashboard/[9.2]TicketBookedConfirmation";
import PostEventPage from "./pages/dashboard/[6]PostEventPage";
import GuestListPage from "./pages/dashboard/[7.2]MyEventGuestList";
import EditEventPage from "./pages/dashboard/[7.1]EditMyEventDetails";
import MyTicketsPage from "./pages/dashboard/[10]MyTicketsPage";
import AdminDashboardPage from "./pages/dashboard/[12]AdminDashboardPage";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/Auth/RequireAuth";
import PublicOnlyRoute from "./components/Auth/PublicOnlyRoute";
import RequireAdmin from "./components/Auth/RequireAdmin";

// Main app router.
function App() {
  return (
      <Router>
          <AuthProvider>
              <EventProvider>
                  <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
          <Route path="/login-code" element={<PublicOnlyRoute><LoginCodePage /></PublicOnlyRoute>} />
          <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />
          <Route path="/signup-code" element={<PublicOnlyRoute><SignupCodePage /></PublicOnlyRoute>} />
          <Route path="/main" element={<RequireAuth><MainPage /></RequireAuth>} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about-dashboard" element={<RequireAuth><AboutDashboardPage /></RequireAuth>} />
          <Route path="/account" element={<RequireAuth><AccountPage /></RequireAuth>} />
          <Route path="/my-events" element={<RequireAuth><MyEventsPage /></RequireAuth>} />
          <Route path="/my-tickets" element={<RequireAuth><MyTicketsPage /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth><RequireAdmin><AdminDashboardPage /></RequireAdmin></RequireAuth>} />
          <Route path="/get-tickets" element={<RequireAuth><GetTicketsPage /></RequireAuth>} />
          <Route path="/payment" element={<RequireAuth><PaymentPage /></RequireAuth>} />
          <Route path="/ticket-booked" element={<RequireAuth><TicketBookedConfirmation /></RequireAuth>} />
          <Route path="/post-event" element={<RequireAuth><PostEventPage /></RequireAuth>} />
          <Route path="/guest-list" element={<RequireAuth><GuestListPage /></RequireAuth>} />
          <Route path="/edit-event" element={<RequireAuth><EditEventPage /></RequireAuth>} />
                  </Routes>
              </EventProvider>
          </AuthProvider>
      </Router>
  );
}

export default App;
