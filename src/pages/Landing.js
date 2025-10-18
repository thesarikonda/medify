import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Typography,
  FormControl,
  InputLabel,
} from "@mui/material";

const STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
];

const CITIES = {
  Alabama: ["DOTHAN", "MOBILE", "MONTGOMERY"],
  Alaska: ["ANCHORAGE", "FAIRBANKS"],
  Arizona: ["PHOENIX", "TUCSON"],
  Arkansas: ["LITTLE ROCK", "FAYETTEVILLE"],
  California: ["LOS ANGELES", "SAN FRANCISCO"],
  Colorado: ["DENVER", "BOULDER"],
};

export default function Landing() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const handleSearch = () => {
    if (!selectedState || !selectedCity) {
      alert("Please select both state and city");
      return;
    }
    navigate(`/results?state=${selectedState}&city=${selectedCity}`);
  };

  return (
    <Box sx={{ textAlign: "center", p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Search Medical Centers
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 3 }}>
        {/* State dropdown */}
        <div id="state">
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>State</InputLabel>
            <Select
              value={selectedState}
              label="State"
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity(""); // Reset city when state changes
              }}
            >
              {STATES.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* City dropdown */}
        <div id="city">
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>City</InputLabel>
            <Select
              value={selectedCity}
              label="City"
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedState}
            >
              {(CITIES[selectedState] || []).map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <Button id="searchBtn" variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>
    </Box>
  );
}
