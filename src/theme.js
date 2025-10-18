// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#26a69a" },
    background: { default: "#f7f9fc" },
  },
  typography: {
    h1: { fontSize: "2rem", fontWeight: 600 },
    h2: { fontSize: "1.5rem", fontWeight: 500 },
    body1: { color: "#444" },
  },
  shape: { borderRadius: 12 },
});

export default theme;
