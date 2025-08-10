// src/components/FileUpload.js
import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FileUpload = ({ onStoriesGenerated, setLoading, setError }) => {
  const [file, setFile] = useState(null);

  const handleChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('http://localhost:8000/generate-user-stories', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.user_stories) onStoriesGenerated(data.user_stories);
      else setError('Failed to generate user stories.');
    } catch (err) {
      setError('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        border: '2px dashed',
        borderColor: 'divider',
        borderRadius: 3,
        bgcolor: 'grey.50',
        p: 4,
        minHeight: 280,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        transition: 'background-color .2s, border-color .2s',
        '&:hover': { bgcolor: 'grey.100', borderColor: 'primary.light' },
      }}
    >
      <Box>
        <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          Drag & Drop your document here
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          PDF or DOCX only
        </Typography>

        <input id="fileInput" type="file" accept=".pdf,.docx" hidden onChange={handleChange} />
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="outlined" component="label" htmlFor="fileInput">
            {file ? file.name : 'Choose File'}
          </Button>
          <Button
            variant="contained"
            disabled={!file}
            onClick={handleUpload}
          >
            Start Generating
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FileUpload;
