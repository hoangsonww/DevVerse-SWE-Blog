import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Inter } from "next/font/google";
import Script from "next/script";
import { DarkModeProvider } from "@/provider/DarkModeProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
});

export const metadata = {
  title:
    "DevVerse Blog - Your Source for Computer Science & Software Engineering Knowledge",
  description:
    "A collection of articles and resources on computer science and software engineering, covering topics like algorithms, web development, AI, and more.",
  keywords: [
    "Computer Science",
    "Software Engineering",
    "Coding",
    "Programming",
    "Web Development",
    "AI",
    "Artificial Intelligence",
    "Machine Learning",
    "Cloud Computing",
    "Data Structures",
    "Algorithms",
    "DevOps",
    "Cybersecurity",
    "Frontend Development",
    "Backend Development",
  ],
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "icon",
      url: "/favicon-32x32.png",
    },
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "DevVerse Blog - Your Source for Computer Science & SWE Knowledge",
    description: "Sharing Computer Science Knowledge and Resources",
    url: "https://devverse-swe.vercel.app",
    siteName:
      "DevVerse CS Blog - Your Source for Computer Science & SWE Knowledge",
    images: [
      {
        url: "https://devverse-swe.vercel.app/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "DevVerse Blog Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevVerse CS Blog",
    description: "Sharing Computer Science Knowledge",
    site: "@devverse",
    creator: "@movieverse",
    images: ["https://devverse-swe.vercel.app/android-chrome-512x512.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="author" content="DevVerse Team" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devverse-swe.vercel.app" />
        <meta
          property="og:image"
          content="https://devverse-swe.vercel.app/android-chrome-512x512.png"
        />
        <meta
          name="twitter:image"
          content="https://devverse-swe.vercel.app/android-chrome-512x512.png"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "DevVerse Blog",
              url: "https://devverse-swe.vercel.app",
              author: {
                "@type": "Organization",
                name: "DevVerse Team",
              },
              description:
                "A collection of articles and resources on computer science and software engineering.",
              image:
                "https://devverse-swe.vercel.app/android-chrome-512x512.png",
            }),
          }}
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
          integrity="sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+"
          crossOrigin="anonymous"
        />
        {/* Inline dark mode initialization */}
        <Script id="dark-mode-init" strategy="beforeInteractive">
          {`
            (function() {
              try {
                const darkMode = localStorage.getItem('darkMode');
                if (darkMode === 'true') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            })();
          `}
        </Script>
        {/* Google Tag (gtag.js) */}
        <Script
          strategy="beforeInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-FG083YTDHQ"
        />
        <Script id="gtag-init" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FG083YTDHQ');
          `}
        </Script>
        <title>
          DevVerse Blog - Your Source for Computer Science & Software
          Engineering Knowledge
        </title>
        <meta name="google-adsense-account" content="ca-pub-6608388491200814" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6608388491200814"
          crossOrigin="anonymous"
        ></Script>
      </head>
      <body className={inter.className}>
        <DarkModeProvider>
          <Navbar />
          <main className="container">{children}</main>
          <Footer />
        </DarkModeProvider>
      </body>
    </html>
  );
}
