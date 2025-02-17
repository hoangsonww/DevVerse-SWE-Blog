export default function Footer() {
  return (
    <footer
      style={{
        textAlign: 'center',
        padding: '1rem 2rem',
        backgroundColor: 'var(--footer-background-color, #f0f0f0)',
        borderTop: '1px solid var(--footer-border-color, #eaeaea)',
        marginTop: '2rem',
        color: 'var(--text-color, #333)',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}
    >
      &copy; {new Date().getFullYear()}{" "}
      <a
        href="https://github.com/hoangsonww"
      >
        Son (David) Nguyen
      </a>
      . All rights reserved.
    </footer>
  );
}
