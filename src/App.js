// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, Container } from "@mui/material";
import theme from "./theme";
import Header from "./components/Header";
import Landing from "./pages/Landing";
import Results from "./pages/Results";
import MyBookings from "./pages/MyBookings";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Container sx={{ py: 4 }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/results" element={<Results />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}
