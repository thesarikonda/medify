// src/pages/Results.js
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
  const navigate = useNavigate();

  useEffect(() => {
    if (!state || !city) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `/data?state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}`;
        const response = await api.get(url);
        setData(response.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [state, city]);

  const handleBook = (center) => {
    navigate("/my-bookings", { state: { from: "results", preselect: center } });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {data.length} medical centers found in {city}
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {data.map((center) => (
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
                </CardContent>
                <CardActions>
                  <Button fullWidth variant="contained" onClick={() => handleBook(center)}>
                    Book FREE Visit
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
