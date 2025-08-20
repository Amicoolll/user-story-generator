// src/components/Navbar.js
import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import AuthDialog from "./Auth/AuthDialog"; // keep this path
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [menuEl, setMenuEl] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const { user, isAuthed, logout } = useAuth();

  const openMenu = (e) => setMenuEl(e.currentTarget);
  const closeMenu = () => setMenuEl(null);

  const handleLoginClick = () => {
    closeMenu();
    setAuthOpen(true);
  };

  const handleLogoutClick = () => {
    closeMenu();
    logout();
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        color="transparent"
        sx={{
          backdropFilter: "saturate(120%) blur(8px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Toolbar sx={{ py: 2 }}>
          {/* Brand */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <span
              style={{
                width: 24,
                height: 24,
                display: "inline-block",
                background:
                  "conic-gradient(from 180deg at 50% 50%, #60A5FA, #22D3EE, #60A5FA)",
                borderRadius: "50%",
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              CogniHubAI
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop actions */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
            <Button variant="outlined" size="small">Home</Button>

            {isAuthed ? (
              <>
                <Typography variant="body2" sx={{ mx: 1, color: "text.secondary" }}>
                  Hi, {user?.name || "User"}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleLogoutClick}
                  sx={{ px: 2.5, borderRadius: 999 }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                size="small"
                onClick={handleLoginClick}
                sx={{ px: 2.5, borderRadius: 999 }}
              >
                Login
              </Button>
            )}
          </Box>

          {/* Mobile menu */}
          <IconButton
            onClick={openMenu}
            sx={{ display: { xs: "inline-flex", md: "none" }, ml: 1 }}
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={menuEl} open={Boolean(menuEl)} onClose={closeMenu}>
            <MenuItem onClick={closeMenu}>Home</MenuItem>

            {isAuthed ? (
              <>
                <MenuItem disabled>Hi, {user?.name || "User"}</MenuItem>
                <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
              </>
            ) : (
              <MenuItem onClick={handleLoginClick}>Login</MenuItem>
            )}
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Auth modal: uses context-powered AuthDialog (no props like onSubmit needed) */}
      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
