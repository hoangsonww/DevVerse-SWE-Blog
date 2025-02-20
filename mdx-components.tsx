import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import CodeBlock from "@/ui/CodeBlock";

export function useMDXComponents(
  components: MDXComponents = {},
): MDXComponents {
  return {
    // Headings
    h1: (props) => (
      <h1
        style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#333" }}
        {...props}
      />
    ),
    h2: (props) => (
      <h2
        style={{ fontSize: "2rem", marginBottom: "0.75rem", color: "#333" }}
        {...props}
      />
    ),
    h3: (props) => (
      <h3
        style={{ fontSize: "1.75rem", marginBottom: "0.75rem", color: "#333" }}
        {...props}
      />
    ),
    h4: (props) => (
      <h4
        style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "#333" }}
        {...props}
      />
    ),
    h5: (props) => (
      <h5
        style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "#333" }}
        {...props}
      />
    ),
    h6: (props) => (
      <h6
        style={{ fontSize: "1rem", marginBottom: "0.5rem", color: "#333" }}
        {...props}
      />
    ),

    // Paragraphs & text
    p: (props) => (
      <p style={{ marginBottom: "1rem", color: "#555" }} {...props} />
    ),
    a: (props) => (
      <a style={{ color: "#0070f3", textDecoration: "underline" }} {...props} />
    ),
    strong: (props) => <strong style={{ fontWeight: "bold" }} {...props} />,
    em: (props) => <em style={{ fontStyle: "italic" }} {...props} />,

    // Inline code: if no language is specified
    code: (props) => {
      if (!props.className) {
        return (
          <code
            style={{
              backgroundColor: "#000",
              padding: "0.2em 0.4em",
              borderRadius: "3px",
              fontFamily: "monospace",
              color: "#fff",
            }}
            {...props}
          />
        );
      }
      // If a language is specified, delegate to CodeBlock for highlighting.
      return <CodeBlock {...props} />;
    },

    // For preformatted code blocks, also use CodeBlock when possible.
    pre: (props) => {
      const child = props.children;
      if (child && child.props && child.props.className) {
        return <CodeBlock {...child.props} />;
      }
      return (
        <pre
          style={{
            backgroundColor: "#000",
            padding: "1em",
            overflowX: "auto",
            borderRadius: "5px",
            marginBottom: "1rem",
            color: "#000", // ensure default text color is black
          }}
          {...props}
        />
      );
    },

    // Images with default width/height if not provided
    img: (props: any) => {
      const { src, alt } = props;
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <Image
            src={src}
            alt={alt || "MDX Image"}
            width={200}
            height={200}
            style={{ objectFit: "contain" }}
          />
        </div>
      );
    },

    // Blockquote
    blockquote: (props) => (
      <blockquote
        style={{
          borderLeft: "4px solid #888",
          paddingLeft: "1rem",
          marginBottom: "1rem",
          color: "#666",
          fontStyle: "italic",
          margin: 0,
        }}
        {...props}
      />
    ),

    // Tables (wrapped in a responsive container)
    table: (props) => (
      <div style={{ overflowX: "auto", width: "100%" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "1rem",
            padding: "0.5rem",
          }}
          {...props}
        />
      </div>
    ),
    thead: (props) => <thead style={{ background: "none" }} {...props} />,
    tbody: (props) => <tbody {...props} />,
    tr: (props) => <tr style={{ borderBottom: "1px solid #ddd" }} {...props} />,
    th: (props) => (
      <th
        style={{
          padding: "0.75rem",
          textAlign: "left",
          fontWeight: "bold",
        }}
        {...props}
      />
    ),
    td: (props) => (
      <td style={{ padding: "0.75rem", textAlign: "left" }} {...props} />
    ),

    // Figures
    figure: (props) => (
      <figure style={{ margin: "1rem 0", textAlign: "center" }} {...props} />
    ),
    figcaption: (props) => (
      <figcaption
        style={{ fontSize: "0.9rem", color: "#777", marginTop: "0.5rem" }}
        {...props}
      />
    ),

    // Details and Summary
    details: (props) => (
      <details
        style={{
          marginBottom: "1rem",
          padding: "1rem",
          backgroundColor: "#f9f9f9",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
        {...props}
      />
    ),
    summary: (props) => (
      <summary style={{ cursor: "pointer", fontWeight: "bold" }} {...props} />
    ),

    // Definition List
    dl: (props) => <dl style={{ marginBottom: "1rem" }} {...props} />,
    dt: (props) => (
      <dt style={{ fontWeight: "bold", marginTop: "1rem" }} {...props} />
    ),
    dd: (props) => (
      <dd style={{ marginLeft: "1rem", marginBottom: "1rem" }} {...props} />
    ),

    // Subscript and Superscript
    sub: (props) => <sub style={{ fontSize: "0.8em" }} {...props} />,
    sup: (props) => <sup style={{ fontSize: "0.8em" }} {...props} />,

    // Highlighted text
    mark: (props) => (
      <mark style={{ backgroundColor: "#ff0", color: "#000" }} {...props} />
    ),

    ...components,
  };
}
