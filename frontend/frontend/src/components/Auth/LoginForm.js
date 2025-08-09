// src/components/Auth/LoginForm.js
import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';

const LoginForm = ({ onSwitchToSignup }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Logging in:', formData);

    // TODO: Connect to FastAPI /login
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Log in</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
        />

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
          Log in
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{' '}
          <Button onClick={onSwitchToSignup} size="small">
            Sign up
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;
