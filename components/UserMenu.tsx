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
        margin: "0.5rem 0",
        fontSize: "1rem",
        color: "var(--text-color)",
        backgroundColor: "transparent",
        cursor: "pointer",
        textAlign: "center",
        padding: "0.5rem",
        borderRadius: "4px",
        transition: "background-color 0.2s, color 0.2s",
        display: "block",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--link-color)";
        e.currentTarget.style.color = "var(--background-color)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = "var(--text-color)";
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
            <>
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
            </>
          ) : (
            <>
              <p className="user-info">
                {getGreeting()}{" "}
                {user?.identities?.[0]?.identity_data?.display_name || "Guest"}{" "}
                ({user.email})
              </p>
              <div className="divider" />
              <p className="logout-btn" onClick={handleLogout}>
                Logout
              </p>
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
          top: calc(100% + 0.5rem);
          right: -180%;
          background-color: var(--container-background);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 1rem;
          z-index: 99999;
          min-width: 150px;
          animation: fadeIn 0.2s ease-out;
        }

        .menu-item {
          margin: 0.5rem 0;
          font-size: 1rem;
          color: var(--text-color);
          background-color: transparent;
          cursor: pointer;
          text-align: center;
          padding: 0.5rem;
          border-radius: 4px;
          transition:
            background-color 0.2s,
            color 0.2s;
        }

        .menu-item:hover {
          background-color: var(--link-color);
          color: var(--background-color);
        }

        .menu-item.logout {
          color: red;
        }

        .user-info {
          margin: 0.5rem 0;
          font-size: 1rem;
          color: var(--text-color);
          text-align: center;
        }

        .divider {
          margin-top: 1rem;
          border-bottom: 1px solid var(--border-color);
        }

        .logout-btn {
          margin: 0.5rem 0;
          font-size: 1rem;
          color: red;
          background-color: transparent;
          cursor: pointer;
          text-align: center;
          padding: 0.5rem;
          border-radius: 4px;
          transition:
            background-color 0.2s,
            color 0.2s;
        }

        .logout-btn:hover {
          background-color: var(--link-color);
          color: var(--background-color);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .menu-item,
        .logout-btn {
          margin: 0.5rem 0;
          font-size: 1rem;
          background-color: transparent;
          cursor: pointer;
          text-align: center;
          padding: 0.5rem;
          border-radius: 4px;
          transition:
            background-color 0.2s,
            color 0.2s;
        }

        /* For login/register - styled like logout but not red */
        .menu-item {
          color: var(--text-color);
        }
        .menu-item:hover {
          background-color: var(--link-color);
          color: var(--background-color);
        }

        /* Logout still red */
        .logout-btn {
          color: red;
        }
        .logout-btn:hover {
          background-color: var(--link-color);
          color: var(--background-color);
        }
      `}</style>
    </div>
  );
};

export default UserMenu;
