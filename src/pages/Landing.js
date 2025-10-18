// src/pages/Landing.js
import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, MenuItem, Button, Paper, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Landing() {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/states").then((res) => setStates(res.data || []));
  }, []);

  useEffect(() => {
    if (selectedState) {
      api.get(`/cities/${selectedState}`).then((res) => setCities(res.data || []));
    } else {
      setCities([]);
    }
  }, [selectedState]);

  const handleSearch = () => {
    if (!selectedState || !selectedCity) return alert("Select both state and city");
    navigate(`/results?state=${selectedState}&city=${selectedCity}`);
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Find Medical Centers Near You
      </Typography>

      <Stack spacing={3} sx={{ mt: 2 }}>
        <TextField
          select
          label="Select State"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          fullWidth
        >
          {states.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Select City"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          fullWidth
          disabled={!selectedState}
        >
          {cities.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="contained" size="large" onClick={handleSearch}>
          Search Centers
        </Button>
      </Stack>
    </Paper>
  );
}
