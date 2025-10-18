import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
} from "@mui/material";

export default function MyBookings() {
  const location = useLocation();
  const [bookings, setBookings] = useState([]);

  // Load existing bookings on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("myBookings") || "[]");
    setBookings(stored);
  }, []);

  // Add preselected booking (from Results.js)
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
    <Box>
      <Typography variant="h5" gutterBottom>
        My Bookings
      </Typography>

      {bookings.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          You have no active bookings yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((center, index) => (
            <Grid item xs={12} sm={6} md={4} key={`${center["Hospital Name"]}-${index}`}>
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
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    onClick={() => handleCancel(index)}
                  >
                    Cancel Booking
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
