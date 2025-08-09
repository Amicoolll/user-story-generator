// src/components/Auth/SignupForm.js
// src/components/Auth/SignupForm.js
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box
} from '@mui/material';

const SignupForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organisation: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitted data:', formData);
    // TODO: Connect to backend
  };

  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Typography variant="h6" gutterBottom>
        Create your account
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          fullWidth
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          size="small"
          margin="dense"
          required
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          size="small"
          margin="dense"
          required
        />

        <TextField
          fullWidth
          label="Organisation"
          name="organisation"
          value={formData.organisation}
          onChange={handleChange}
          size="small"
          margin="dense"
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          size="small"
          margin="dense"
          required
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2, mb: 1 }}
        >
          Sign Up
        </Button>

        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          Already have an account?{' '}
          <Button onClick={onSwitchToLogin} size="small">
            Log in
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignupForm;
