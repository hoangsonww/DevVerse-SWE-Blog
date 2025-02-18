"use client";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mdx-container"
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem",
        lineHeight: "1.6",
        fontSize: "1.12rem",
        backgroundColor: "var(--container-background)",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {children}
      <style jsx global>{`
        /* Ensure code blocks and long text don't overflow on small screens */
        .mdx-container pre,
        .mdx-container code {
          overflow-x: auto;
          white-space: pre-wrap;
          word-break: break-word;
        }
      `}</style>
    </div>
  );
}
