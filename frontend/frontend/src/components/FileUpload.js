import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FileUpload = ({ onStoriesGenerated, setLoading, setError }) => {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/generate-user-stories", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      onStoriesGenerated(data.user_stories || '');
    } catch (err) {
      setError("Error generating user stories.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        border: '2px dashed #ccc',
        borderRadius: 3,
        p: 5,
        height: 220,
        mt: 4,
        textAlign: 'center',
        backgroundColor: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'background-color 0.3s',
        '&:hover': {
          backgroundColor: '#f0f0f0',
        },
      }}
    >
      <CloudUploadIcon sx={{ fontSize: 48, mb: 1, color: '#777' }} />
      <Typography variant="body1" gutterBottom>
        Drag & Drop your document here
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        PDF or DOCX only
      </Typography>

      <input type="file" id="fileInput" onChange={handleChange} hidden />
      <label htmlFor="fileInput">
        <Button variant="outlined" component="span" sx={{ mt: 2 }}>
          {file ? file.name : 'Choose File'}
        </Button>
      </label>

      <Box mt={2}>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!file}
        >
          Start Generating
        </Button>
      </Box>
    </Box>
  );
};

export default FileUpload;

