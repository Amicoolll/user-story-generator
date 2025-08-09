import React from "react";
import { Paper, Typography } from "@mui/material";

const UserStoriesDisplay = ({ stories }) => {
  return (
    <Paper elevation={3} style={{ padding: "20px", marginTop: "20px", whiteSpace: "pre-wrap" }}>
      <Typography variant="h6" gutterBottom>User Stories</Typography>
      <Typography variant="body1">{stories}</Typography>
    </Paper>
  );
};

export default UserStoriesDisplay;