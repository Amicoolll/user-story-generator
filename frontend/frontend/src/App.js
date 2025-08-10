// src/App.js
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import FileUpload from './components/FileUpload';
import UserStoriesDisplay from './components/UserStoriesDisplay';
import jsPDF from 'jspdf';

import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Box,
  Button,
  Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

function App() {
  const [userStories, setUserStories] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleDownloadPDF = () => {
    if (!userStories) return;
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(userStories, 180);
    doc.text(lines, 10, 10);
    doc.save('user_stories.pdf');
  };

  const handleDownloadDOCX = () => {
    if (!userStories) return;
    const lines = userStories.split('\n').filter(Boolean);
    const doc = new Document({
      sections: [
        {
          children: lines.map((line) =>
            new Paragraph({ children: [new TextRun({ text: line })] })
          ),
        },
      ],
    });
    Packer.toBlob(doc).then((blob) => saveAs(blob, 'user_stories.docx'));
  };

  const handleCopy = () => {
    if (!userStories) return;
    navigator.clipboard.writeText(userStories);
    setCopied(true);
  };

  return (
    <>
      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
        {/* Stack vertically */}
        <Grid container direction="column" spacing={4}>
          {/* Top: Upload */}
          <Grid item xs={12}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Upload Scope of Work Document
              </Typography>

              <FileUpload
                onStoriesGenerated={setUserStories}
                setLoading={setLoading}
                setError={setError}
              />

              {loading && (
                <Box mt={2}>
                  <CircularProgress />
                </Box>
              )}

              {error && (
                <Box mt={2}>
                  <Alert severity="error">{error}</Alert>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Bottom: Stories */}
          <Grid item xs={12}>
            <Paper
              elevation={4}
              sx={{ p: 4, borderRadius: 3, minHeight: 420, display: 'flex', flexDirection: 'column' }}
            >
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Generated User Stories
              </Typography>

              {userStories ? (
                <UserStoriesDisplay stories={userStories} />
              ) : (
                <Typography color="text.secondary">
                  No user stories generated yet.
                </Typography>
              )}

              {userStories && (
                <Box mt={2} display="flex" gap={2} flexWrap="wrap">
                  <Button variant="contained" onClick={handleDownloadPDF}>
                    📄 Download as PDF
                  </Button>
                  <Button variant="contained" onClick={handleDownloadDOCX}>
                    📄 Download as DOCX
                  </Button>
                  <Button variant="outlined" onClick={handleCopy}>
                    📋 Copy to Clipboard
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Copy success toast */}
      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert elevation={6} variant="filled" severity="success">
          Copied to clipboard!
        </MuiAlert>
      </Snackbar>
    </>
  );
}

export default App;
