// src/components/Navbar.js
// src/components/Navbar.js
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function Navbar() {
  return (
    <AppBar elevation={0} color="transparent" position="static"
      sx={{ backdropFilter: "saturate(120%) blur(8px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <Toolbar sx={{ py: 2 }}>
        <Box sx={{ display:"flex", alignItems:"center", gap:1 }}>
          <span style={{ width:24, height:24, display:"inline-block",
            background:"conic-gradient(from 180deg at 50% 50%, #60A5FA, #22D3EE, #60A5FA)",
            borderRadius:"50%" }} />
          <Typography variant="h6" sx={{ fontWeight:700 }}>CogniHubAI</Typography>
        </Box>
        <Box sx={{ flexGrow:1 }} />
        <Button variant="outlined" size="small">Home</Button>
        <Button sx={{ ml:1 }} variant="contained" size="small">Login</Button>
      </Toolbar>
    </AppBar>
  );
}
