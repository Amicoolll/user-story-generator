import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container, Box, Typography } from "@mui/material";
import { theme } from "./theme";
import Navbar from "./components/Navbar";
import FileUpload from "./components/FileUpload";
import UserStoriesDisplay from "./components/UserStoriesDisplay";

function App() {
  const [stories, setStories] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Replace your old handleUpload with this one
  const handleUpload = async (file) => {
    setStories("");
    setError("");
    setLoading(true);

    try {
      const form = new FormData();
      form.append("file", file); // Must match FastAPI param

      const res = await fetch("http://localhost:8000/generate-user-stories", {
        method: "POST",
        body: form,
      });

      const raw = await res.text();
      console.log("STATUS:", res.status, "RAW:", raw);

      if (!res.ok) throw new Error(raw || `HTTP ${res.status}`);

      let data = {};
      try {
        data = JSON.parse(raw);
      } catch {
        /* if plain text, skip JSON parse */
      }

      const output =
        data?.stories ??
        data?.user_stories ??
        data?.result ??
        (typeof data === "string" ? data : raw);

      setStories((output || "").trim());
      if (!output) setError("No stories returned from server.");
    } catch (e) {
      setError(e.message || "Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="ai-bg">
        <Navbar />
        <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 12 }, pb: { xs: 6, md: 8 }, px: { xs: 2, sm: 3 } }}>
          <Box textAlign="center" mb={6}>
            <Typography sx={{ typography: { xs: "h4", sm: "h3", md: "h2" }, color: "text.primary" }} gutterBottom>
              Upload Your Document & Let AI Generate Stories
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Powered by CogniHubAI’s advanced NLP engine
            </Typography>
          </Box>

          {/* Pass the new handler here */}
          <FileUpload onUpload={handleUpload} />

          {loading && <Typography color="text.secondary" sx={{ mt: 2 }}>Generating…</Typography>}
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

          <UserStoriesDisplay stories={stories} />
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
