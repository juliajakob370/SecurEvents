import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import "../../styles/MainPage.css";
import "../../styles/[9]GetTicketsPage.css"; // reuse styles
import "../../styles/PostEventPage.css";
import defaultImage from "../../assets/default-image.png";

const PostEventPage: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [capacity, setCapacity] = useState(50);
  const [price, setPrice] = useState("");
  const [isFree, setIsFree] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      e.target.value = ""; // reset input
      return;
    }

    setImage(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (isFree) {
      setPrice(""); // clear price when free is checked
    }
  }, [isFree]);

  return (
    <div style={{ padding: "20px" }}>
      <Header centerType="title" title="POST EVENT" showProfile={true} />

      <div className="events-container">
        <div className="events-scroll tickets-scroll">
          <div className="post-event-layout">
            {/* LEFT SIDE */}
            <div className="post-left">
              {/* IMAGE */}
              <div className="ticket-event-card image-upload-box">
                <img
                  src={image || defaultImage}
                  alt="Event"
                  className="image-preview"
                />

                <label className="upload-btn">
                  <i className="bi bi-upload"></i>
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    hidden
                  />
                </label>

                <div className="capacity-row">
                  <span className="capacity-label">
                    <i className="bi bi-people-fill"></i> Capacity
                  </span>

                  <input
                    type="number"
                    min="1"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                  />
                </div>

                <div className="price-section">
                  <div className="price-label-row">
                    <span className="price-label">
                      <i className="bi bi-ticket-perforated"></i>
                      Price Per Ticket
                    </span>

                    <div className={`price-right-col ${isFree ? "disabled" : ""}`}>
                      <label className="checkbox-row light">
                        <input
                          type="checkbox"
                          checked={isFree}
                          onChange={() => setIsFree(!isFree)}
                        />
                        Free Event?
                      </label>

                      <div className="price-input-clean">
                        <span>$</span>

                        <input
                          type="number"
                          placeholder={isFree ? "0.00" : "Enter ticket price"}
                          disabled={isFree}
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="post-right ticket-selection-card">
              {/* TITLE */}
              <div className="post-form-inner">
                <div className="form-group">
                  <input type="text" placeholder=" " />
                  <label>Event Title</label>
                </div>

                {/* DATE */}
                <div className="form-group">
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <label>Date</label>
                </div>

                {/* TIME */}
                <div className="form-group">
                  <input type="time" />
                  <label>Time</label>
                </div>

                {/* LOCATION */}
                <div className="form-group">
                  <input type="text" placeholder=" " />
                  <label>
                    <i className="bi bi-geo-alt"></i> Location
                  </label>
                </div>

                {/* DESCRIPTION */}
                <div className="description-group">
                  <label>Description</label>
                  <textarea placeholder="Tell people about your event..." />
                </div>
              </div>
              <button className="post-event-btn">Post Event!</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEventPage;
