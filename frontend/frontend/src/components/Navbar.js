// src/components/Navbar.js
// src/components/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';

const Navbar = ({ onAuthClick }) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#fff', color: '#000' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6">🧠 User Story Generator</Typography>
        <Box>
          <Button color="inherit">Home</Button>
          <Button color="inherit">About</Button>
          <Button variant="contained" sx={{ ml: 2 }} onClick={onAuthClick}>
            Login / Signup
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
