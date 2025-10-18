// src/pages/MyBookings.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function MyBookings() {
  const location = useLocation();
  const [bookings, setBookings] = useState([]);

  // Load bookings from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("myBookings") || "[]");
    setBookings(stored);
  }, []);

  // Add preselected booking
  useEffect(() => {
    if (location.state?.from === "results" && location.state?.preselect) {
      const newBooking = location.state.preselect;
      setBookings((prev) => {
        const updated = [...prev, newBooking];
        localStorage.setItem("myBookings", JSON.stringify(updated));
        return updated;
      });
    }
  }, [location.state]);

  const handleCancel = (index) => {
    const updated = bookings.filter((_, i) => i !== index);
    setBookings(updated);
    localStorage.setItem("myBookings", JSON.stringify(updated));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>My Bookings</h1>

      {bookings.length === 0 ? (
        <p>You have no active bookings yet.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {bookings.map((center, index) => (
            <div key={index} style={{ border: "1px solid #ccc", padding: "1rem", width: "300px" }}>
              <h3>{center["Hospital Name"]}</h3>
              <p>{center.Address}</p>
              <p>{center.City}, {center.State} - {center["ZIP Code"]}</p>
              <p>Rating: {center["Overall Rating"] ?? "N/A"}</p>
              {center.bookingDate && <p>Date: {center.bookingDate}</p>}
              {center.bookingTime && <p>Time: {center.bookingTime}</p>}
              <button onClick={() => handleCancel(index)}>Cancel Booking</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
