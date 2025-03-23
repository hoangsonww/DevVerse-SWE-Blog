"use client";

import React from "react";

const InlineCode: React.FC<React.HTMLAttributes<HTMLElement>> = (props) => {
  return (
    <>
      <code className="inline-code" {...props} />
      <style jsx>{`
        .inline-code {
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: monospace;
          transition:
            background-color 0.3s ease,
            color 0.3s ease;
          /* Light mode defaults */
          background-color: #f5f5f5;
          color: #333;
        }
        :global(html.dark) .inline-code {
          /* Dark mode styles */
          background-color: #1e1e1e;
          color: #ddd;
        }
      `}</style>
    </>
  );
};

export default InlineCode;
