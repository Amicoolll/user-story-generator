// App.js
import { useState, useRef } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container, Box, Typography } from "@mui/material";
import { theme } from "./theme";
import Navbar from "./components/Navbar";
import FileUpload from "./components/FileUpload";
import UserStoriesDisplay from "./components/UserStoriesDisplay";
import AuthDialog from "./components/Auth/AuthDialog"; // <- move modal here (not in Navbar)

export default function App() {
  const [stories, setStories] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(!!localStorage.getItem("ch_token"));
  const pendingActionRef = useRef(null); // to run after login

  // ---- backend call ----
  const handleUpload = async (file) => {
    setStories(""); setError(""); setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("http://localhost:8000/generate-user-stories", { method: "POST", body: form });
      const raw = await res.text();
      if (!res.ok) throw new Error(raw || `HTTP ${res.status}`);
      let data = {}; try { data = JSON.parse(raw); } catch {}
      const output = data?.stories ?? data?.user_stories ?? data?.result ?? (typeof data === "string" ? data : raw);
      setStories((output || "").trim());
      if (!output) setError("No stories returned from server.");
    } catch (e) {
      setError(e.message || "Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  // ---- auth guard wrapper ----
  const requireAuth = (fn) => (...args) => {
    if (isAuthed) return fn(...args);
    // store the action to run after login, then open modal
    pendingActionRef.current = () => fn(...args);
    setAuthOpen(true);
  };

  // ---- handle modal submit (fake login for now) ----
  const handleAuthSubmit = ({ mode, email }) => {
    // TODO: replace with real API later
    localStorage.setItem("ch_token", "demo-token");
    setIsAuthed(true);
    setAuthOpen(false);
    // run pending action if any
    if (pendingActionRef.current) {
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      action();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ch_token");
    setIsAuthed(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="ai-bg">
        <Navbar onLoginClick={() => setAuthOpen(true)} isAuthed={isAuthed} onLogoutClick={handleLogout} />

        <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 12 }, pb: { xs: 6, md: 8 }, px: { xs: 2, sm: 3 } }}>
          <Box textAlign="center" mb={6}>
            <Typography sx={{ typography: { xs: "h4", sm: "h3", md: "h2" }, color: "text.primary" }} gutterBottom>
              Upload Your Document & Let AI Generate Stories
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Powered by CogniHubAI’s advanced NLP engine
            </Typography>
          </Box>

          {/* Gate the action: if not authed, open login modal */}
          <FileUpload onUpload={requireAuth(handleUpload)} onRequireAuth={() => setAuthOpen(true)} />

          {loading && <Typography color="text.secondary" sx={{ mt: 2 }}>Generating…</Typography>}
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

          <UserStoriesDisplay stories={stories} />
        </Container>

        {/* Central auth modal */}
        <AuthDialog
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          mode="login"
          onGoogle={() => console.log("Google auth")}
          onLinkedIn={() => console.log("LinkedIn auth")}
          onSubmit={handleAuthSubmit}
        />
      </div>
    </ThemeProvider>
  );
}
