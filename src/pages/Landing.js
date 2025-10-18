import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // axios instance

export default function Landing() {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    // Fetch states from API
    const fetchStates = async () => {
      try {
        const res = await api.get("/states");
        setStates(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      setSelectedCity("");
      return;
    }
    // Fetch cities for selected state
    const fetchCities = async () => {
      try {
        const res = await api.get(`/cities?state=${selectedState}`);
        setCities(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCities();
  }, [selectedState]);

  const handleSearch = () => {
    if (!selectedState || !selectedCity) {
      alert("Please select both state and city");
      return;
    }
    navigate(`/results?state=${selectedState}&city=${selectedCity}`);
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Search Medical Centers</h1>

      <div id="state" style={{ margin: "1rem" }}>
        <select
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedCity("");
          }}
        >
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div id="city" style={{ margin: "1rem" }}>
        <select
          value={selectedCity}
          disabled={!selectedState}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">Select City</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <button id="searchBtn" onClick={handleSearch}>Search</button>
    </div>
  );
}
