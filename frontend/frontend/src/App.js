// src/App.js
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container, Box, Typography } from "@mui/material";
import { theme } from "./theme";

// Updated classes/modules (already in your project)
import AuthProvider from "./context/AuthContext";
import Navbar from "./components/Navbar";
import FileUpload from "./components/FileUpload";
import UserStoriesDisplay from "./components/UserStoriesDisplay";
import AuthDialog from "./components/Auth/AuthDialog";

export default function App() {
  // Central auth modal stays here (NOT inside Navbar)
  const [authOpen, setAuthOpen] = useState(false);
  const [stories, setStories] = useState("");

  // Let anything (api client / components) open the auth modal
  useEffect(() => {
    const openAuth = () => setAuthOpen(true);
    window.addEventListener("auth:unauthorized", openAuth);
    window.addEventListener("open-auth", openAuth);
    return () => {
      window.removeEventListener("auth:unauthorized", openAuth);
      window.removeEventListener("open-auth", openAuth);
    };
  }, []);

  // Wrapper around logout: also clears stories
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider onRequireAuth={() => setAuthOpen(true)}>
        <div className="ai-bg">
          {/* NAVBAR – same look/feel, uses context internally */}
          <Navbar onLoginClick={() => setAuthOpen(true)} />

          {/* HERO – keep your original headline and vibe */}
          <Box
            component="section"
            sx={{
              pt: { xs: 6, md: 12 },
              pb: { xs: 4, md: 6 },
              textAlign: "center",
              background:
                "radial-gradient(1200px 400px at 50% -50%, rgba(82,139,255,0.12), transparent), radial-gradient(1200px 400px at 50% -100%, rgba(34,211,238,0.08), transparent)",
            }}
          >
            <Container maxWidth="md">
              <Typography
                sx={{
                  typography: { xs: "h4", sm: "h3", md: "h2" },
                  color: "text.primary",
                  fontWeight: 800,
                }}
                gutterBottom
              >
                Upload Your Document & Let AI Generate Stories
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Powered by CogniHubAI’s advanced NLP engine
              </Typography>
            </Container>
          </Box>
          {/* MAIN – keep spacing */}
          <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 8 }, px: { xs: 2, sm: 3 } }}>
            {/* IMPORTANT:
               FileUpload MUST call `openLogin()` when unauthenticated,
               and dispatch `auth:unauthorized` on a 401.
               That restores the popup behavior. */}
            <Box sx={{ mb: 3 }}>
              <FileUpload onStories={setStories} openLogin={() => setAuthOpen(true)} />
            </Box>

            <UserStoriesDisplay stories={stories} />
          </Container>

          {/* CENTRAL AUTH MODAL */}
          <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
