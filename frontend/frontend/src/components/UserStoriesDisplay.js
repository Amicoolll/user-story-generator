import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** ---- helpers: very small markdown interpreter for exports ---- */
const splitBold = (text) => {
  // returns [{text, bold}] handling **bold** segments
  const parts = [];
  const regex = /\*\*(.+?)\*\*/g;
  let last = 0, m;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push({ text: text.slice(last, m.index), bold: false });
    parts.push({ text: m[1], bold: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), bold: false });
  return parts.length ? parts : [{ text, bold: false }];
};

const classifyLine = (line) => {
  if (/^\s*###\s+/.test(line)) return { level: 3, text: line.replace(/^\s*###\s+/, "") };
  if (/^\s*##\s+/.test(line))  return { level: 2, text: line.replace(/^\s*##\s+/, "") };
  if (/^\s*#\s+/.test(line))   return { level: 1, text: line.replace(/^\s*#\s+/, "") };
  return { level: 0, text: line };
};

export default function UserStoriesDisplay({ stories = "" }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCopy = async () => {
    if (!stories?.trim()) return;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(stories);
      else {
        const ta = document.createElement("textarea");
        ta.value = stories; document.body.appendChild(ta); ta.select();
        document.execCommand("copy"); document.body.removeChild(ta);
      }
      setCopied(true); setTimeout(() => setCopied(false), 1200);
    } catch {/* noop */}
  };

  /** --------- PDF export with simple markdown --------- */
  const handleDownloadPDF = () => {
    if (!stories?.trim()) return;
    setDownloading(true);
    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 56;
      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();
      let y = margin;

      const addLine = (runs, fontSize = 12, boldAll = false) => {
        doc.setFont("helvetica", boldAll ? "bold" : "normal");
        doc.setFontSize(fontSize);
        const lineHeight = Math.round(fontSize * 1.3);

        // combine runs to single string for wrapping
        const plain = runs.map(r => r.text).join("");
        const wrapped = doc.splitTextToSize(plain, width - margin * 2);

        wrapped.forEach(wline => {
          if (y + lineHeight > height - margin) { doc.addPage(); y = margin; }
          // re-bold within the wrapped line using splitBold again
          const segments = splitBold(wline);
          let x = margin;
          segments.forEach(seg => {
            doc.setFont("helvetica", seg.bold || boldAll ? "bold" : "normal");
            doc.text(seg.text, x, y, { baseline: "alphabetic" });
            // estimate width for x advance
            x += doc.getTextWidth(seg.text);
          });
          y += lineHeight;
        });
      };

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("CogniHubAI — Generated User Stories", margin, y);
      y += 24;

      stories.split("\n").forEach(raw => {
        const { level, text } = classifyLine(raw);
        const runs = splitBold(text.length ? text : " ");
        if (level === 1) addLine(runs, 18, true);
        else if (level === 2) addLine(runs, 16, true);
        else if (level === 3) addLine(runs, 14, true);
        else addLine(runs, 12, false);
      });

      doc.save("user_stories.pdf");
    } finally {
      setDownloading(false);
    }
  };

  /** --------- DOCX export with simple markdown --------- */
  const handleDownloadDocx = async () => {
    if (!stories?.trim()) return;
    setDownloading(true);
    try {
      const children = [
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "CogniHubAI — Generated User Stories", bold: true, size: 28 })],
        }),
      ];

      stories.split("\n").forEach(raw => {
        const { level, text } = classifyLine(raw);
        const runs = splitBold(text.length ? text : " ");

        const sizeByLevel = level === 1 ? 32 : level === 2 ? 28 : level === 3 ? 26 : 24;
        const boldAll = level > 0;

        children.push(
          new Paragraph({
            spacing: { after: 120 },
            children: runs.map(r => new TextRun({ text: r.text, bold: boldAll || r.bold, size: sizeByLevel }))
          })
        );
      });

      const doc = new Document({ sections: [{ properties: {}, children }] });
      const blob = await Packer.toBlob(doc);
      saveAs(blob, "user_stories.docx");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ mt: 4, p: 3, borderRadius: 4, border: "1px solid rgba(255,255,255,.08)" }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Generated User Stories
      </Typography>

      {stories ? (
        <Box sx={{
          p: 0,
          "& h1, & h2, & h3": { mt: 2, mb: 1, fontWeight: 700 },
          "& p": { m: 0, mb: 1.2, lineHeight: 1.7 },
          "& ul": { pl: 3, mb: 1.2 },
          "& li": { mb: .6 }
        }}>
          {/* UI render with Markdown */}
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {stories}
          </ReactMarkdown>
        </Box>
      ) : (
        <Typography color="text.secondary">No user stories generated yet.</Typography>
      )}

      <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
        <Button size="small" variant="outlined" startIcon={<ContentCopyIcon />} onClick={handleCopy} disabled={!stories?.trim()}>
          {copied ? "Copied" : "Copy"}
        </Button>
        <Button size="small" variant="outlined" startIcon={<PictureAsPdfIcon />} onClick={handleDownloadPDF} disabled={!stories?.trim() || downloading}>
          {downloading ? "Preparing…" : "Download PDF"}
        </Button>
        <Button size="small" variant="outlined" startIcon={<DescriptionIcon />} onClick={handleDownloadDocx} disabled={!stories?.trim() || downloading}>
          {downloading ? "Preparing…" : "Download .docx"}
        </Button>
      </Stack>
    </Paper>
  );
}
