// src/pages/Landing.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import api from "../api";

export default function Landing() {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await api.get("/states");
        setStates(response.data || []);
      } catch (error) {
        console.error("Error fetching states", error);
      }
    };
    fetchStates();
  }, []);

  // Fetch cities based on state
  useEffect(() => {
    if (!selectedState) return;
    const fetchCities = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/cities/${selectedState}`);
        setCities(response.data || []);
      } catch (error) {
        console.error("Error fetching cities", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, [selectedState]);

  const handleSearch = () => {
    if (!selectedState || !selectedCity) return alert("Select both state and city");
    navigate(`/results?state=${selectedState}&city=${selectedCity}`);
  };

  return (
    <Container sx={{ mt: 5, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Find Medical Centers
      </Typography>

      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="center"
        alignItems="center"
        gap={2}
        mt={4}
      >
        {/* State Dropdown */}
        <FormControl sx={{ minWidth: 200 }} id="state">
          <InputLabel>State</InputLabel>
          <Select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            label="State"
          >
            {states.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* City Dropdown */}
        <FormControl sx={{ minWidth: 200 }} id="city" disabled={!selectedState || loading}>
          <InputLabel>City</InputLabel>
          <Select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            label="City"
          >
            {loading ? (
              <MenuItem disabled>
                <CircularProgress size={20} />
              </MenuItem>
            ) : (
              cities.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        {/* Search Button */}
        <Button
          id="searchBtn"
          variant="contained"
          color="primary"
          sx={{ height: "56px" }}
          onClick={handleSearch}
        >
          Search
        </Button>
      </Box>
    </Container>
  );
}
