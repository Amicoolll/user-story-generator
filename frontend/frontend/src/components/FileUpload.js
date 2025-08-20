// src/components/FileUpload.js
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/client";

export default function FileUpload({
  onStories,          // (stories: string) => void
  openLogin,          // () => void   // open central AuthDialog
  onError,            // (msg: string) => void (optional)
}) {
  const { isAuthed } = useAuth();
  const [file, setFile] = useState(null);
  const [hover, setHover] = useState(false);
  const [busy, setBusy] = useState(false);

  function pick(e) {
    setFile(e.target.files?.[0] || null);
  }

  function onDrop(e) {
    e.preventDefault();
    setFile(e.dataTransfer.files?.[0] || null);
    setHover(false);
  }

  async function startGenerating() {
    if (!file) return;
    // Gate: must be logged in
    if (!isAuthed) {
      // open central modal immediately for better UX
      openLogin?.();
      // apiFetch will also emit 'auth:unauthorized' on 401 later if someone bypasses
      return;
    }

    try {
      setBusy(true);
      onStories?.(""); // clear previous
      const form = new FormData();
      form.append("file", file);

      const data = await apiFetch("/generate-user-stories", {
        method: "POST",
        body: form,
        auth: true,
      });

      const output =
        data?.user_stories ||
        data?.stories ||
        data?.result ||
        (typeof data === "string" ? data : "");

      if (!output) {
        const msg = "No stories returned from server.";
        onError ? onError(msg) : console.warn(msg);
      }
      onStories?.((output || "").trim());
    } catch (err) {
      const msg = err?.message || "Upload failed";
      onError ? onError(msg) : alert(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        bgcolor: "background.paper",
        borderRadius: 4,
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: hover
          ? "0 0 0 1px rgba(59,130,246,.4), 0 30px 80px rgba(59,130,246,.12)"
          : "0 10px 30px rgba(0,0,0,.35)",
        transition: ".2s",
      }}
    >
      <Box
        onDragOver={(e) => {
          e.preventDefault();
          setHover(true);
        }}
        onDragLeave={() => setHover(false)}
        onDrop={onDrop}
        sx={{
          textAlign: "center",
          py: 6,
          border: "2px dashed rgba(255,255,255,0.12)",
          borderRadius: 3,
          transition: ".2s",
          background: hover ? "rgba(59,130,246,.06)" : "transparent",
        }}
      >
        <Box sx={{ fontSize: 44, mb: 2 }}>🧠</Box>

        <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
          Drag &amp; Drop your document here
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Works with PDF and DOCX
        </Typography>

        <input id="file" hidden type="file" accept=".pdf,.docx" onChange={pick} />
        <Button component="label" htmlFor="file" variant="outlined" sx={{ mr: 2 }} disabled={busy}>
          Choose File
        </Button>

        <Button
          variant="contained"
          disabled={!file || busy}
          onClick={startGenerating}
          sx={{ minWidth: 180 }}
        >
          {busy ? (
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={18} />
              Generating…
            </Box>
          ) : (
            "Start Generating"
          )}
        </Button>

        {file && (
          <Typography sx={{ mt: 2 }} color="text.secondary">
            Selected: {file.name}
          </Typography>
        )}

        {!isAuthed && (
          <Typography sx={{ mt: 1.5 }} color="text.secondary" variant="body2">
            Login required to upload
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
