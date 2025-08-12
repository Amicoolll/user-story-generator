// src/theme.js
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#3B82F6" },   // electric blue
    secondary: { main: "#0EA5E9" },
    background: {
      default: "#0B1220",           // deep navy
      paper: "#0F172A",
    },
    text: { primary: "#E5E7EB", secondary: "#9CA3AF" },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: `"Inter", system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial`,
    h2: { fontWeight: 700, letterSpacing: "-0.02em" },
  },
});
