// Imports: header, event card, styles, and profile image.
import React from "react";
import Header from "../../components/Header/Header";
import "../../styles/MainPage.css";
import EventCard from "../../components/EventCard/EventCard";
import profile0 from "../../assets/profilePics/profile0.png";

// Temporary frontend event data.
// Later this can come from backend instead of being hardcoded.
const events = [
    {
        title: "Summer Music Festival",
        organizer: "Mr. Music",
        location: "Toronto, ON",
        price: "$25",
        image: "https://tse4.mm.bing.net/th/id/OIP.KZ2a11mYjDyMMZyi5kbvwQHaHa?w=1200&h=1200&rs=1&pid=ImgDetMain&o=7&rm=3",
        dateTime: "Aug 12 • 7:00 PM",
        description: "Enjoy live music in a beautiful outdoor stage under the sun, drinks and food trucks available for purchase at the venue."
    },
    {
        title: "Tech Networking Night",
        organizer: "Google Developer's Group @ Conestoga College",
        location: "Waterloo, ON",
        price: "Free",
        image: "https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,h_1080,q_100,w_1080/v1/gcs/platform-data-goog/events/DF25-Event-thumbnail-year-square_wjZLNYl.png",
        dateTime: "Aug 12 • 7:00 PM",
        description: "🚀Tech Networking Night! - Meet Startups & Get Ready for the Networking 🚀 💫 Secure your spot (few tickets left 🔥) Networking with startups will take place as part of the Growth Summit on March 17th (3 pm to 9 pm), starting at 6:15 pm. This is a unique opportunity to engage nd network with people and teams passionate about their idea, and learn about their journey. It is a chance to build relationships with industry leaders and ask any questions you are interested in! Sometimes all it takes is 𝐨𝐧𝐞 𝐜𝐨𝐧𝐯𝐞𝐫𝐬𝐚𝐭𝐢𝐨𝐧, 𝐨𝐧𝐞 𝐢𝐝𝐞𝐚, 𝐨𝐫 𝐨𝐧𝐞 𝐜𝐨𝐧𝐧𝐞𝐜𝐭𝐢𝐨𝐧 to change your direction. Learn more about participating startups using posters below and prepare your questions! We hope to see YOU there!"
    },
    {
        title: "Art Expo 2026",
        organizer: "Creative Co.",
        location: "Brampton, ON",
        price: "$10",
        image: "https://luxury.am/wp-content/uploads/2023/04/52781012862_ed864c9219_c.jpg",
        dateTime: "Aug 12 • 7:00 PM",
        description: "Shwocase or graudating students at the art program. Come see a variety of art pieces and learn about their inspiration."
    },
    {
        title: "Sleep Under The Sea",
        organizer: "Georgia Aquarium",
        location: "Atlanta, GA",
        price: "$139.99",
        image: "https://www.georgiaaquarium.org/wp-content/uploads/2018/10/sleep-under-the-sea-4-1600x1065.jpg",
        dateTime: "Aug 12 • 7:00 PM",
        description: "After the aquarium closes, you will have the chance to sleep under the sea, watching the peaceful ocean creatures. Enjoy exclusive after-hour tours, midnight snacks and admission to the aquarium the following day."
    },
    {
        title: "Super Cool Event",
        organizer: "Bibi",
        location: "Waterloo, ON",
        price: "$100",
        image: "https://koreajoongangdaily.joins.com/data/photo/2022/11/21/159f5073-0127-4463-ba60-f15c4292d62c.jpg",
        dateTime: "Aug 12 • 7:00 PM",
        description: "This event will be super cool."
    }
];

// Main dashboard page.
const MainPage: React.FC = () => {
    return (
        <div style={{ padding: "20px" }}>
            {/* Header */}
            <Header
                centerType="search"
                showProfile={true}
                profileImage={profile0}
            />

            {/* Event list container */}
            <div className="events-container">
                <div className="events-scroll">
                    {events.map((event, index) => (
                        <EventCard
                            key={index}
                            title={event.title}
                            organizer={event.organizer}
                            location={event.location}
                            price={event.price}
                            image={event.image}
                            dateTime={event.dateTime}
                            description={event.description}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MainPage;