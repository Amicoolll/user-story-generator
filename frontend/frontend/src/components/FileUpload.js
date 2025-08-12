// src/components/FileUpload.js
import { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function FileUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [hover, setHover] = useState(false);

  const pick = (e) => setFile(e.target.files[0] || null);
  const drop = (e) => { e.preventDefault(); setFile(e.dataTransfer.files?.[0] || null); setHover(false); };

  return (
    <Paper elevation={0} sx={{
      p:4,
      bgcolor:"background.paper",
      borderRadius:4,
      border:"1px solid rgba(255,255,255,0.08)",
      boxShadow: hover ? "0 0 0 1px rgba(59,130,246,.4), 0 30px 80px rgba(59,130,246,.12)" :
                         "0 10px 30px rgba(0,0,0,.35)"
    }}>
      <Box onDragOver={(e)=>{e.preventDefault(); setHover(true);}}
           onDragLeave={()=>setHover(false)} onDrop={drop}
           sx={{ textAlign:"center", py:6, border:"2px dashed rgba(255,255,255,0.12)",
                 borderRadius:3, transition:".2s", background: hover ? "rgba(59,130,246,.06)" : "transparent" }}>
        <Box sx={{ fontSize:44, mb:2 }}>🧠</Box>
        <Typography variant="h5" sx={{ mb:1, fontWeight:600 }}>
          Drag & Drop your document here
        </Typography>
        <Typography color="text.secondary" sx={{ mb:3 }}>
          Works with PDF and DOCX
        </Typography>

        <input id="file" hidden type="file" accept=".pdf,.docx" onChange={pick} />
        <Button component="label" htmlFor="file" variant="outlined" sx={{ mr:2 }}>
          Choose File
        </Button>
        <Button
          variant="contained"
          disabled={!file}
          onClick={()=>onUpload?.(file)}
        >
          Start Generating
        </Button>

        {file && (
          <Typography sx={{ mt:2 }} color="text.secondary">
            Selected: {file.name}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
