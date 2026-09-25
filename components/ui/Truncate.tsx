import React from "react";

interface TruncateProps {
  text: string;
  lines?: 1 | 2 | 3;
  className?: string;
}

const lineClampClasses = {
  1: "overflow-hidden text-ellipsis whitespace-nowrap",
  2: "overflow-hidden",
  3: "overflow-hidden",
};

export default function Truncate({ text, lines = 1, className = "" }: TruncateProps) {
  return (
    <span
      title={text}
      className={`block min-w-0 ${lineClampClasses[lines]} ${className}`}
      style={
        lines > 1
          ? {
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: lines,
            }
          : undefined
      }
    >
      {text}
    </span>
  );
}
