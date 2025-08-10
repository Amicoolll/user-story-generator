// src/components/UserStoriesDisplay.js
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Typography, Box } from "@mui/material";

const mdComponents = {
  h1: ({node, ...props}) => <Typography variant="h4" fontWeight={700} gutterBottom {...props} />,
  h2: ({node, ...props}) => <Typography variant="h5" fontWeight={700} gutterBottom {...props} />,
  h3: ({node, ...props}) => <Typography variant="h6" fontWeight={700} gutterBottom {...props} />,
  p:  ({node, ...props}) => <Typography variant="body1" sx={{ mb: 1.5 }} {...props} />,
  li: ({node, ...props}) => <li style={{ marginBottom: 6 }} {...props} />,
};

export default function UserStoriesDisplay({ stories }) {
  // normalize line endings so markdown breaks render consistently
  const content = (stories || "").replace(/\r\n/g, "\n");
  return (
    <Box sx={{ "& h1, & h2, & h3": { scrollMarginTop: 80 } }}>
      <ReactMarkdown components={mdComponents} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </Box>
  );
}
