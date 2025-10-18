// src/components/Header.js
import React from "react";
import { AppBar, Toolbar, Typography, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          HealthCare Finder
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button color="inherit" component={Link} to="/">
            Find Doctors
          </Button>
          <Button color="inherit" component={Link} to="/my-bookings">
            My Bookings
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
