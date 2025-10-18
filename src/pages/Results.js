import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Box,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import api from "../api";

function buildUniqueKey(center) {
  return `${center["Hospital Name"]}-${center["ZIP Code"]}-${center.Address?.slice(0, 10)}`;
}

export default function Results() {
  const [searchParams] = useSearchParams();
  const state = searchParams.get("state") || "";
  const city = searchParams.get("city") || "";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingIndex, setBookingIndex] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("Morning");
  const navigate = useNavigate();

  const times = ["Morning", "Afternoon", "Evening"];

  // Generate next 7 days for date selection
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0]; // yyyy-mm-dd
  });

  useEffect(() => {
    if (!state || !city) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `/data?state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}`;
        const res = await api.get(url);
        setData(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [state, city]);

  const handleBookClick = (index) => {
    setBookingIndex(index);
    setSelectedDate("");
    setSelectedTime("Morning");
  };

  const handleConfirmBooking = (center) => {
    if (!selectedDate) {
      alert("Please select a date");
      return;
    }
    const booking = {
      ...center,
      bookingDate: selectedDate,
      bookingTime: selectedTime,
    };
    navigate("/my-bookings", { state: { from: "results", preselect: booking } });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        {data.length} medical centers found in {city}
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {data.map((center, index) => (
            <Grid item xs={12} sm={6} md={4} key={buildUniqueKey(center)}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6">{center["Hospital Name"]}</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {center.Address}
                  </Typography>
                  <Typography variant="body2">
                    {center.City}, {center.State} - {center["ZIP Code"]}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Rating: {center["Overall Rating"] ?? "N/A"}
                  </Typography>

                  {bookingIndex === index && (
                    <Box sx={{ mt: 2 }}>
                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <Select
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          displayEmpty
                        >
                          <MenuItem value="" disabled>
                            Select Date
                          </MenuItem>
                          {next7Days.map((d) => (
                            <MenuItem key={d} value={d}>
                              {d}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <Select
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                        >
                          {times.map((t) => (
                            <MenuItem key={t} value={t}>
                              {t}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <Button fullWidth variant="contained" onClick={() => handleConfirmBooking(center)}>
                        Confirm Booking
                      </Button>
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  {bookingIndex !== index && (
                    <Button fullWidth variant="contained" onClick={() => handleBookClick(index)}>
                      Book FREE Visit
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
