// src/components/Navbar.js
// src/components/Navbar.js
import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import AuthDialog from "./Auth/AuthDialog"; // <-- make sure file is src/components/Auth/AuthDialog.js

export default function Navbar() {
  const [menuEl, setMenuEl] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);

  const openMenu = (e) => setMenuEl(e.currentTarget);
  const closeMenu = () => setMenuEl(null);

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
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            <Button variant="outlined" size="small">Home</Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => setAuthOpen(true)}
              sx={{ px: 2.5, borderRadius: 999 }}
            >
              Login
            </Button>
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
            <MenuItem
              onClick={() => {
                closeMenu();
                setAuthOpen(true);
              }}
            >
              Login
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Auth modal */}
      <AuthDialog
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        mode="login"
        onGoogle={() => console.log("Google auth")}
        onLinkedIn={() => console.log("LinkedIn auth")}
        onSubmit={(payload) => {
          console.log("Auth submit", payload); // wire to FastAPI later
          setAuthOpen(false);
        }}
      />
    </>
  );
}
