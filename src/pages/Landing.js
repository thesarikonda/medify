import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Typography,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

export default function Landing() {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStates = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://meddata-backend.onrender.com/states");
        setStates(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    if (!selectedState) return;
    const fetchCities = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://meddata-backend.onrender.com/cities?state=${selectedState}`
        );
        setCities(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
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
    <Box sx={{ textAlign: "center", p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Search Medical Centers
      </Typography>

      {loading && <CircularProgress sx={{ my: 2 }} />}

      <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 3 }}>
        <div id="state">
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>State</InputLabel>
            <Select
              value={selectedState}
              label="State"
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity("");
              }}
            >
              {states.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div id="city">
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>City</InputLabel>
            <Select
              value={selectedCity}
              label="City"
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedState}
            >
              {cities.map((city) => (
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
