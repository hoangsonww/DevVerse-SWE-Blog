"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { FiUser } from "react-icons/fi";
import { toast } from "react-toastify";

const UserMenu: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

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
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      >
        <FiUser size={24} />
      </div>

      {menuOpen && (
        <div className="dropdown">
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
                  {user?.identities?.[0]?.identity_data?.display_name || "Guest"}
                </span>
                <span className="user-email">{user.email}</span>
              </div>
              <div className="divider" />
              <button className="logout-btn" onClick={handleLogout} type="button">
                Logout
              </button>
            </>
          )}
        </div>
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
          position: absolute;
          top: calc(100% + 0.65rem);
          right: 0;
          background:
            linear-gradient(
              135deg,
              rgba(15, 118, 110, 0.12),
              rgba(0, 0, 0, 0)
            ),
            var(--container-background);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.18);
          padding: 0.85rem;
          z-index: 99999;
          min-width: 240px;
          max-width: 320px;
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
