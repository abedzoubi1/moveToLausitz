"use client";
import { useState, useRef, useEffect } from "react";
import { Typography, Link } from "@mui/material";

interface ReadMoreTextProps {
  text: string;
  maxLines?: number;
}

export const ReadMoreText = ({ text, maxLines = 4 }: ReadMoreTextProps) => {
  const [expanded, setExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      // Check if text is overflowing
      const isOverflowing =
        textRef.current.scrollHeight > textRef.current.clientHeight;
      setShowReadMore(isOverflowing);
    }
  }, [text, maxLines]);

  return (
    <div>
      <Typography
        ref={textRef}
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: expanded ? "unset" : maxLines,
          lineHeight: 1.5,
        }}
      >
        {text}
      </Typography>
      {showReadMore && (
        <Link
          component="button"
          variant="body2"
          sx={{
            ml: 0.5,
            fontWeight: 500,
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Weniger lesen" : "Mehr lesen"}
        </Link>
      )}
    </div>
  );
};

export default ReadMoreText;
