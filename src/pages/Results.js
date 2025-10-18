import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api";

export default function Results() {
  const [searchParams] = useSearchParams();
  const state = searchParams.get("state") || "";
  const city = searchParams.get("city") || "";

  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedCenter, setSelectedCenter] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const navigate = useNavigate();

  // Fetch medical centers
  useEffect(() => {
    if (!state || !city) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/data?state=${state}&city=${city}`);
        setCenters(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [state, city]);

  // Generate next 7 days for date selection
  const getNext7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      days.push(d.toISOString().split("T")[0]); // YYYY-MM-DD
    }
    return days;
  };

  const handleBook = () => {
    if (!selectedDate || !selectedTime) {
      alert("Select both date and time slot");
      return;
    }
    const booking = {
      ...selectedCenter,
      bookingDate: selectedDate,
      bookingTime: selectedTime,
    };

    const existing = JSON.parse(localStorage.getItem("myBookings") || "[]");
    localStorage.setItem("myBookings", JSON.stringify([...existing, booking]));

    navigate("/my-bookings");
  };

  if (loading) return <p>Loading medical centers...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{centers.length} medical centers found in {city}</h1>

      {centers.length === 0 && <p>No medical centers found.</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {centers.map((center, idx) => (
          <div
            key={`${center["Hospital Name"]}-${idx}`}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              width: "300px",
            }}
          >
            <h3>{center["Hospital Name"]}</h3>
            <p>{center.Address}</p>
            <p>{center.City}, {center.State} - {center["ZIP Code"]}</p>
            <p>Rating: {center["Overall Rating"] ?? "N/A"}</p>

            {selectedCenter?.["Hospital Name"] === center["Hospital Name"] ? (
              <div>
                <label>
                  Select Date:
                  <select
                    id="dateSelect"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  >
                    <option value="">Select Date</option>
                    {getNext7Days().map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </label>

                <label style={{ display: "block", marginTop: "0.5rem" }}>
                  Select Time Slot:
                  <select
                    id="timeSelect"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  >
                    <option value="">Select Slot</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </select>
                </label>

                <button
                  id="bookBtn"
                  style={{ marginTop: "0.5rem" }}
                  onClick={handleBook}
                >
                  Book FREE Visit
                </button>
              </div>
            ) : (
              <button
                id="bookBtn"
                onClick={() => {
                  setSelectedCenter(center);
                  setSelectedDate("");
                  setSelectedTime("");
                }}
              >
                Book FREE Visit
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
