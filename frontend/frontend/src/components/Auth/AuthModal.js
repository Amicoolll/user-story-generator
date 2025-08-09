// src/components/Auth/AuthModal.js
import React, { useState } from 'react';
import { Modal, Box } from '@mui/material';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 420,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const AuthModal = ({ open, onClose }) => {
  const [isSignup, setIsSignup] = useState(true);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {isSignup ? (
          <SignupForm onSwitchToLogin={() => setIsSignup(false)} />
        ) : (
          <LoginForm onSwitchToSignup={() => setIsSignup(true)} />
        )}
      </Box>
    </Modal>
  );
};

export default AuthModal;
