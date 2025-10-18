// src/pages/MyBookings.js
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
} from "@mui/material";

const STORAGE_KEY = "bookings";

function readBookings() {
  const raw = localStorage.getItem(STORAGE_KEY);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveBookings(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export default function MyBookings() {
  const location = useLocation();
  const preselect = location.state?.preselect || null;
  const [bookings, setBookings] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(preselect);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slot, setSlot] = useState("");

  useEffect(() => setBookings(readBookings()), []);
  useEffect(() => {
    if (preselect) setSelectedCenter(preselect);
  }, [preselect]);

  const times = {
    Morning: ["09:00 AM", "09:30 AM", "10:00 AM"],
    Afternoon: ["12:00 PM", "01:00 PM", "02:30 PM"],
    Evening: ["05:00 PM", "06:00 PM", "07:00 PM"],
  };

  const bookNow = (e) => {
    e.preventDefault();
    if (!selectedCenter || !date || !time || !slot)
      return alert("Select center, date & time");

    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 7);

    const chosen = new Date(date);
    if (chosen < today.setHours(0, 0, 0, 0) || chosen > maxDate) {
      return alert("Bookings allowed only within 7 days.");
    }

    const booking = {
      id: `${Date.now()}`,
      hospitalName: selectedCenter["Hospital Name"],
      address: selectedCenter.Address,
      city: selectedCenter.City,
      state: selectedCenter.State,
      zip: selectedCenter["ZIP Code"],
      date,
      time,
      slotPartOfDay: slot,
    };

    const newBookings = [booking, ...bookings];
    setBookings(newBookings);
    saveBookings(newBookings);

    setDate("");
    setTime("");
    setSlot("");
    alert("Booking saved!");
  };

  const deleteBooking = (id) => {
    const filtered = bookings.filter((b) => b.id !== id);
    setBookings(filtered);
    saveBookings(filtered);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Book an Appointment
        </Typography>

        <Box sx={{ mb: 3 }}>
          {selectedCenter ? (
            <>
              <Typography variant="subtitle1">{selectedCenter["Hospital Name"]}</Typography>
              <Typography variant="body2">{selectedCenter.Address}</Typography>
            </>
          ) : (
            <Typography color="text.secondary">
              No center selected. Choose one from the Results page.
            </Typography>
          )}
        </Box>

        <Stack spacing={3} component="form" onSubmit={bookNow}>
          <TextField
            type="date"
            label="Select Date (within 7 days)"
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
          />

          <TextField
            select
            label="Select Part of Day"
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
            fullWidth
          >
            <MenuItem value="">Select</MenuItem>
            <MenuItem value="Morning">Morning</MenuItem>
            <MenuItem value="Afternoon">Afternoon</MenuItem>
            <MenuItem value="Evening">Evening</MenuItem>
          </TextField>

          {slot && (
            <TextField
              select
              label="Select Time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              fullWidth
            >
              {times[slot].map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
          )}

          <Button variant="contained" type="submit">
            Confirm Booking
          </Button>
        </Stack>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Saved Bookings
      </Typography>

      {bookings.length === 0 ? (
        <Typography>No saved bookings</Typography>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((b) => (
            <Grid item xs={12} sm={6} md={4} key={b.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{b.hospitalName}</Typography>
                  <Typography>{b.address}</Typography>
                  <Typography>
                    {b.city}, {b.state} - {b.zip}
                  </Typography>
                  <Typography>Date: {b.date}</Typography>
                  <Typography>Time: {b.time}</Typography>
                  <Typography>{b.slotPartOfDay}</Typography>
                  <Button
                    sx={{ mt: 1 }}
                    color="error"
                    variant="outlined"
                    onClick={() => deleteBooking(b.id)}
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
