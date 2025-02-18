import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";

export function useMDXComponents(
  components: MDXComponents = {},
): MDXComponents {
  return {
    h1: (props) => (
      <h1
        style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#333" }}
        {...props}
      />
    ),
    h2: (props) => (
      <h2
        style={{ fontSize: "2rem", marginBottom: "0.75rem", color: "#444" }}
        {...props}
      />
    ),
    p: (props) => (
      <p style={{ marginBottom: "1rem", color: "#555" }} {...props} />
    ),
    ul: (props) => (
      <ul style={{ paddingLeft: "1.5rem", marginBottom: "1rem" }} {...props} />
    ),
    li: (props) => <li style={{ marginBottom: "0.5rem" }} {...props} />,
    img: (props: any) => (
      <Image
        sizes="100vw"
        style={{ width: "100%", height: "auto", marginBottom: "1rem" }}
        {...(props as ImageProps)}
      />
    ),
    blockquote: (props) => (
      <blockquote
        style={{
          borderLeft: "4px solid #888",
          paddingLeft: "1rem",
          marginBottom: "1rem",
          color: "#666",
          fontStyle: "italic",
          margin: 0
        }}
        {...props}
      />
    ),
    ...components,
  };
}
