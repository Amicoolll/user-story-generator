// src/components/Auth/AuthDialog.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, TextField, Button, Divider, Link,
  IconButton, InputAdornment
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GoogleIcon from "@mui/icons-material/Google";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../context/AuthContext"; // <-- integrate with context if available

export default function AuthDialog({
  open,
  onClose,
  mode: initialMode = "login",
  onGoogle,
  onLinkedIn,
  onSubmit, // optional: if omitted, we’ll use AuthContext
}) {
  const { login, signup, loading } = useAuth() || {};
  const [mode, setMode] = useState(initialMode); // "login" | "signup"
  const [showPw, setShowPw] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", organisation: "", password: "" });
  const isSignup = mode === "signup";

  // Reset form whenever dialog opens or initial mode changes
  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setValues({ name: "", email: "", organisation: "", password: "" });
      setShowPw(false);
    }
  }, [open, initialMode]);

  const change = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    // If caller provided onSubmit, use that (legacy behavior)
    if (onSubmit) {
      await onSubmit({ mode, ...values });
      return;
    }
    // Otherwise use AuthContext (new behavior)
    try {
      if (isSignup) {
        await signup?.({
          name: values.name,
          email: values.email,
          organisation: values.organisation || null,
          password: values.password,
        });
      } else {
        await login?.({ email: values.email, password: values.password });
      }
      onClose?.();
    } catch (err) {
      // If AuthContext throws, surface a simple alert (or wire a Snackbar)
      alert(err?.message || "Authentication failed");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.08)",
          bgcolor: "background.default",
          maxHeight: "92vh",
        },
      }}
    >
      <DialogTitle sx={{ pr: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {isSignup ? "Create your account" : "Welcome back"}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Streamline user story creation with AI.
        </Typography>

        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: "absolute", right: 12, top: 12 }}
          aria-label="Close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        {/* Social logins */}
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Button fullWidth variant="outlined" startIcon={<GoogleIcon />} onClick={onGoogle} sx={{ height: 44 }}>
            Google
          </Button>
          <Button fullWidth variant="outlined" startIcon={<LinkedInIcon />} onClick={onLinkedIn} sx={{ height: 44 }}>
            LinkedIn
          </Button>
        </Box>

        <Divider sx={{ my: 2 }}>or</Divider>

        {/* Email form */}
        <Box component="form" onSubmit={submit}>
          {isSignup && (
            <TextField
              label="Name"
              name="name"
              value={values.name}
              onChange={change}
              fullWidth
              sx={{ mb: 2 }}
              autoComplete="name"
              required
            />
          )}

          <TextField
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={change}
            fullWidth
            sx={{ mb: 2 }}
            autoComplete="email"
            required
          />

          {isSignup && (
            <TextField
              label="Organisation"
              name="organisation"            // <-- fixed name
              value={values.organisation}    // <-- fixed value
              onChange={change}
              fullWidth
              sx={{ mb: 2 }}
              autoComplete="organization"
            />
          )}

          <TextField
            label="Password"
            name="password"
            value={values.password}
            onChange={change}
            type={showPw ? "text" : "password"}
            required
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPw((p) => !p)} edge="end" aria-label="toggle password visibility">
                    {showPw ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <span />
            <Link
              component="button"
              type="button"
              underline="hover"
              onClick={() => alert("TODO: reset password")}
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, height: 46 }}
            disabled={loading}
          >
            {loading ? "Please wait…" : isSignup ? "Create account" : "Continue"}
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: { xs: 2.5, sm: 3.5 }, py: 2 }}>
        <Typography color="text.secondary" sx={{ width: "100%", textAlign: "center" }}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link
            component="button"
            type="button"
            underline="hover"
            onClick={() => setMode(isSignup ? "login" : "signup")}
          >
            {isSignup ? "Log in" : "Sign up"}
          </Link>
        </Typography>
      </DialogActions>
    </Dialog>
  );
}
