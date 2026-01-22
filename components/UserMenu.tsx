"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { FiUser } from "react-icons/fi";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";

const UserMenu: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
    maxHeight: number;
    maxWidth: number;
  } | null>(null);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerId = "user-menu-portal";
    let container = document.getElementById(containerId);

    if (!container) {
      container = document.createElement("div");
      container.id = containerId;
      document.body.appendChild(container);
    }

    setPortalContainer(container);
  }, []);

  useEffect(() => {
    async function fetchSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    }
    fetchSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_, session) => setUser(session?.user ?? null),
    );
    return () => subscription.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current?.contains(target)) {
        return;
      }
      if (dropdownRef.current?.contains(target)) {
        return;
      }
      setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    const anchor = triggerRef.current;
    if (!anchor) {
      return undefined;
    }

    const clamp = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max);

    const updatePosition = () => {
      const anchorRect = anchor.getBoundingClientRect();
      const dropdownRect = dropdownRef.current?.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const margin = 12;
      const offset = 12;
      const maxHeight = Math.max(0, viewportHeight - margin * 2);
      const maxWidth = Math.max(0, viewportWidth - margin * 2);
      const rawWidth = dropdownRect?.width ?? 280;
      const rawHeight = dropdownRect?.height ?? 240;
      const width = Math.min(rawWidth, maxWidth);
      const height = Math.min(rawHeight, maxHeight);
      const desiredLeft = anchorRect.right - width;
      const left = clamp(desiredLeft, margin, viewportWidth - width - margin);
      let top = anchorRect.bottom + offset;
      if (top + height > viewportHeight - margin) {
        const above = anchorRect.top - height - offset;
        top =
          above >= margin
            ? above
            : clamp(top, margin, viewportHeight - height - margin);
      }

      setDropdownPosition({ top, left, maxHeight, maxWidth });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (dropdownRef.current && "ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => updatePosition());
      resizeObserver.observe(dropdownRef.current);
    }

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
    toast.success("Logged out successfully", { theme: "colored" });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning 🌤️,";
    if (hour < 18) return "Good afternoon 🌥️,";
    return "Good evening 🌙,";
  };

  const MenuItem = ({
    label,
    onClick,
  }: {
    label: string;
    onClick: () => void;
  }) => (
    <p
      onClick={onClick}
      style={{
        margin: 0,
        fontSize: "0.95rem",
        color: "var(--text-color)",
        backgroundColor: "rgba(0, 112, 243, 0.06)",
        cursor: "pointer",
        textAlign: "left",
        padding: "0.65rem 0.75rem",
        borderRadius: "10px",
        border: "1px solid rgba(0, 112, 243, 0.2)",
        transition:
          "background-color 0.2s, color 0.2s, border-color 0.2s, transform 0.2s",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        fontWeight: 600,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--link-color)";
        e.currentTarget.style.color = "var(--background-color)";
        e.currentTarget.style.borderColor = "var(--link-color)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(0, 112, 243, 0.06)";
        e.currentTarget.style.color = "var(--text-color)";
        e.currentTarget.style.borderColor = "rgba(0, 112, 243, 0.2)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {label}
    </p>
  );

  return (
    <div className="user-menu-wrapper" ref={menuRef}>
      <div
        className="icon-wrapper"
        onClick={() => setMenuOpen((prev) => !prev)}
        ref={triggerRef}
      >
        <FiUser size={24} />
      </div>

      {menuOpen &&
        portalContainer &&
        createPortal(
          <div
            className="dropdown"
            ref={dropdownRef}
            style={{
              top: `${dropdownPosition?.top ?? 0}px`,
              left: `${dropdownPosition?.left ?? 0}px`,
              maxHeight: `${dropdownPosition?.maxHeight ?? 320}px`,
              maxWidth: `${dropdownPosition?.maxWidth ?? 320}px`,
              visibility: dropdownPosition ? "visible" : "hidden",
            }}
          >
            {!user ? (
              <div className="menu-items">
                <MenuItem
                  label="Login"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/auth/login");
                  }}
                />

                <MenuItem
                  label="Register"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/auth/register");
                  }}
                />
              </div>
            ) : (
              <>
                <div className="user-info">
                  <span className="user-greeting">{getGreeting()}</span>
                  <span className="user-name">
                    {user?.identities?.[0]?.identity_data?.display_name ||
                      "Guest"}
                  </span>
                  <span className="user-email">{user.email}</span>
                </div>
                <div className="divider" />
                <button
                  className="logout-btn"
                  onClick={handleLogout}
                  type="button"
                >
                  Logout
                </button>
              </>
            )}
          </div>,
          portalContainer,
        )}

      <style jsx>{`
        .user-menu-wrapper {
          position: relative;
          display: inline-block;
        }

        .icon-wrapper {
          padding: 0.5rem;
          cursor: pointer;
          background: transparent;
          display: flex;
          align-items: center;
          border-radius: 50%;
          transition:
            transform 0.2s,
            color 0.2s;
          color: var(--text-color);
        }

        .icon-wrapper:hover {
          transform: scale(1.1);
          color: var(--link-color);
        }

        .dropdown {
          position: fixed;
          background:
            linear-gradient(135deg, rgba(15, 118, 110, 0.12), rgba(0, 0, 0, 0)),
            var(--container-background);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.18);
          padding: 0.85rem;
          z-index: 99999;
          min-width: min(240px, calc(100vw - 24px));
          max-width: min(320px, calc(100vw - 24px));
          overflow-y: auto;
          animation: dropdownIn 0.2s ease-out;
        }

        .user-info {
          margin: 0.2rem 0 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          text-align: left;
          padding: 0.7rem 0.85rem;
          border-radius: 12px;
          background: rgba(0, 112, 243, 0.08);
          border: 1px solid rgba(0, 112, 243, 0.2);
        }

        .user-greeting {
          font-size: 0.7rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--link-color);
        }

        .user-name {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-color);
        }

        .user-email {
          font-size: 0.88rem;
          color: var(--text-color);
          opacity: 0.8;
          word-break: break-word;
        }

        .divider {
          margin: 0.6rem 0 0.75rem;
          border-bottom: 1px solid var(--border-color);
        }

        .logout-btn {
          width: 100%;
          margin: 0;
          font-size: 0.95rem;
          color: #b91c1c;
          background-color: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.45);
          cursor: pointer;
          text-align: center;
          padding: 0.65rem 0.75rem;
          border-radius: 10px;
          font-weight: 600;
          transition:
            background-color 0.2s,
            color 0.2s,
            border-color 0.2s,
            transform 0.2s;
        }

        .logout-btn:hover {
          background-color: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.7);
          transform: translateY(-1px);
        }

        .menu-items {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        @keyframes dropdownIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default UserMenu;
