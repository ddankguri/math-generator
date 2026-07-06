"use client";

import React from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathTextProps {
  text: string;
  className?: string;
}

export default function MathText({ text, className = "" }: MathTextProps) {
  if (!text) return null;

  // Split text by \( and \)
  // In JS string, \( is represented as \\( and \) as \\)
  // The JSON parser outputs single backslashes in memory, so we check for literal "\(" and "\)"
  const parts = text.split(/\\\((.*?)\\\)/g);

  return (
    <span className={`inline-block leading-relaxed ${className}`}>
      {parts.map((part, index) => {
        // Every odd index is a math block captured by (.*?)
        if (index % 2 === 1) {
          try {
            const html = katex.renderToString(part, {
              displayMode: false,
              throwOnError: false,
            });
            return (
              <span
                key={index}
                className="inline-math px-0.5"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch (error) {
            console.error("KaTeX rendering error:", error);
            return <code key={index} className="bg-red-100 dark:bg-red-950 px-1 rounded">{part}</code>;
          }
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}
