import React, { useState } from 'react';
import Navbar from './components/Navbar';
import FileUpload from './components/FileUpload';
import jsPDF from 'jspdf';
import AuthModal from './components/Auth/AuthModal';

import {
  Container, Typography, Paper, CircularProgress, Alert,
  Box, Button, Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

function App() {
  const [userStories, setUserStories] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(userStories, 180);
    doc.text(lines, 10, 10);
    doc.save('user_stories.pdf');
  };

  const handleDownloadDOCX = () => {
    const lines = userStories.split('\n').filter(Boolean);
    const doc = new Document({
      sections: [{
        children: lines.map((line, i) =>
          new Paragraph({
            children: [new TextRun(`${i + 1}. ${line}`)],
          })
        ),
      }],
    });
    Packer.toBlob(doc).then(blob => saveAs(blob, "user_stories.docx"));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(userStories);
    setCopied(true);
  };

  return (
    <>
      <Navbar onAuthClick={() => setAuthModalOpen(true)} />

      <Container sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Generate Accurate User Stories Automatically from Your Documents
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Upload your scope of work document and generate user stories with ease.
        </Typography>

        <FileUpload
          onStoriesGenerated={setUserStories}
          setLoading={setLoading}
          setError={setError}
        />

        {loading && <Box mt={3}><CircularProgress /></Box>}
        {error && <Box mt={3}><Alert severity="error">{error}</Alert></Box>}

        {userStories && (
          <Paper elevation={3} sx={{ mt: 6, p: 3, textAlign: 'left' }}>
            <Typography variant="h6" gutterBottom>Generated User Stories</Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {userStories}
            </Typography>
            <Box mt={2} display="flex" gap={2}>
              <Button variant="contained" onClick={handleDownloadPDF}>Download PDF</Button>
              <Button variant="contained" onClick={handleDownloadDOCX}>Download DOCX</Button>
              <Button variant="outlined" onClick={handleCopy}>Copy to Clipboard</Button>
            </Box>
          </Paper>
        )}

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

        {/* 🔐 Auth Modal */}
        <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </Container>
    </>
  );
}

export default App;
