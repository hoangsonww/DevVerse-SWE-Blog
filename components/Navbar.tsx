"use client";

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiHome, FiChevronRight, FiBook, FiSun, FiMoon } from "react-icons/fi";
import { FaRegStar } from "react-icons/fa";
import { DarkModeContext } from "@/provider/DarkModeProvider";
import UserMenu from "./UserMenu";
import { supabase } from "@/supabase/supabaseClient";

function formatSegment(segment: string): string {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Navbar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isHomePage = segments.length === 0;
  const { darkMode, setDarkMode } = useContext(DarkModeContext);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    }
    fetchSession();
  }, []);

  let breadcrumb: React.ReactNode;

  if (isHomePage) {
    breadcrumb = (
      <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
        <FiHome />
        <span>Home</span>
      </span>
    );
  } else if (segments[0] === "articles") {
    if (segments.length === 1) {
      breadcrumb = (
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Link
            href="/"
            style={{
              color: "var(--link-color)",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <FiHome />
            <span>Home</span>
          </Link>
          <FiChevronRight />
          <Link
            href="/"
            style={{
              color: "var(--link-color)",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <FiBook />
            <span>Articles</span>
          </Link>
        </span>
      );
    } else {
      breadcrumb = (
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Link
            href="/"
            style={{
              color: "var(--link-color)",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <FiHome />
            <span>Home</span>
          </Link>
          <FiChevronRight />
          <Link
            href="/"
            style={{
              color: "var(--link-color)",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <FiBook />
            <span>Articles</span>
          </Link>
          <FiChevronRight />
          <span>{formatSegment(segments[1])}</span>
        </span>
      );
    }
  } else if (segments[0] === "auth") {
    const valid = ["login", "register", "reset"];
    const second = segments[1]?.toLowerCase() || "";
    const authPage = valid.includes(second)
      ? second === "reset"
        ? "Reset Password"
        : formatSegment(second)
      : "404 Not Found";

    breadcrumb = (
      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Link
          href="/"
          style={{
            color: "var(--link-color)",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          <FiHome />
          <span>Home</span>
        </Link>
        <FiChevronRight />
        <span>{authPage}</span>
      </span>
    );
  } else if (segments[0] === "favorites") {
    breadcrumb = (
      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Link
          href="/"
          style={{
            color: "var(--link-color)",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          <FiHome />
          <span>Home</span>
        </Link>
        <FiChevronRight />
        <span>Favorites</span>
      </span>
    );
  } else {
    // ANY unmatched URL => show 404 crumb
    breadcrumb = (
      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Link
          href="/"
          style={{
            color: "var(--link-color)",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          <FiHome />
          <span>Home</span>
        </Link>
        <FiChevronRight />
        <span>404 Not Found</span>
      </span>
    );
  }

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <nav
        className="navbar"
        style={{
          backgroundColor: "var(--background-color)",
          padding: "1rem 2rem",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          flexWrap: "wrap",
          flexDirection:
            isMobile && isHomePage ? "row" : isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          animation: "fadeDown 0.6s ease forwards",
        }}
      >
        <div
          className="breadcrumb"
          style={{
            fontSize: "1.125rem",
            flex: "1 1 auto",
            display: "flex",
            justifyContent:
              isMobile && isHomePage
                ? "flex-start"
                : isMobile
                  ? "center"
                  : "flex-start",
            width: isMobile ? "100%" : "auto",
            marginBottom: isMobile && !isHomePage ? "0.5rem" : 0,
          }}
        >
          {breadcrumb}
          {isMobile && isHomePage && (
            <div
              className="right-section"
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                marginLeft: "auto",
                justifyContent: "flex-start",
              }}
            >
              <UserMenu />
              {user && (
                <div
                  className="icon-btn favorites-btn"
                  onClick={() => router.push("/favorites")}
                  aria-label="View Favorites"
                >
                  <FaRegStar size={24} />
                </div>
              )}
              <div
                className="icon-btn toggle-btn"
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
              </div>
            </div>
          )}
        </div>

        {!isMobile || !isHomePage ? (
          <div
            className="right-section"
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              justifyContent: isMobile ? "center" : "flex-end",
              width: isMobile ? "100%" : "auto",
            }}
          >
            <UserMenu />
            {user && (
              <div
                className="icon-btn"
                onClick={() => router.push("/favorites")}
                aria-label="View Favorites"
              >
                <FaRegStar size={24} />
              </div>
            )}
            <div
              className="icon-btn"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
            </div>
          </div>
        ) : null}
      </nav>

      <style jsx>{`
        @keyframes fadeDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .icon-btn {
          padding: 0.5rem;
          cursor: pointer;
          background: transparent;
          display: flex;
          align-items: center;
          border-radius: 50%;
          transition:
            transform 0.2s ease,
            color 0.3s ease;
          color: ${darkMode ? "#f9f9f9" : "#333"};
        }
        .icon-btn:hover {
          transform: scale(1.1);
          color: var(--link-color);
        }
        .icon-btn:active {
          transform: scale(0.95);
        }
      `}</style>
    </>
  );
}
