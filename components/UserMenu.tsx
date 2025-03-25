"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser } from "react-icons/fi";
import { toast } from "react-toastify";

const UserMenu: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  // Fetch session on mount and subscribe to auth changes
  useEffect(() => {
    async function fetchSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    }
    fetchSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  // Close menu if clicking outside the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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
    else if (hour < 18) return "Good afternoon 🌥️,";
    else return "Good evening 🌙,";
  };

  console.log(user)

  // Add this helper inside your component (above return)
  const MenuItem = ({ label, onClick }: { label: string; onClick: () => void }) => {
    const [hover, setHover] = useState(false);
    return (
      <p
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          margin: "0.5rem 0",
          fontSize: "1rem",
          color: hover ? "var(--background-color)" : "var(--text-color)",
          backgroundColor: hover ? "var(--link-color)" : "transparent",
          cursor: "pointer",
          textAlign: "center",
          padding: "0.5rem",
          borderRadius: "4px",
          transition: "background-color 0.2s, color 0.2s",
        }}
      >
        {label}
      </p>
    );
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }} ref={menuRef}>
      {/* Toggler Icon */}
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setMenuOpen((prev) => !prev)}
        style={{
          padding: "0.5rem",
          cursor: "pointer",
          background: "transparent",
          display: "flex",
          alignItems: "center",
          borderRadius: "50%",
          transition: "background-color 0.3s ease",
          color: "var(--text-color)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiUser size={24} color={isHovered ? "var(--link-color)" : "var(--text-color)"} />
      </motion.div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              top: "calc(100% + 0.5rem)",
              right: 0,
              backgroundColor: "var(--container-background)",
              border: "1px solid var(--border-color)",
              borderRadius: "6px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              padding: "1rem",
              zIndex: 99999,
              minWidth: "150px",
            }}
          >
            {!user ? (
              <>
                <MenuItem label="Login" onClick={() => { setMenuOpen(false); router.push("/auth/login"); }} />
                <MenuItem label="Register" onClick={() => { setMenuOpen(false); router.push("/auth/register"); }} />
              </>
            ) : (
              <>
                <p
                  style={{
                    margin: "0.5rem 0",
                    fontSize: "1rem",
                    color: "var(--text-color)",
                    textAlign: "center",
                  }}
                >
                  {getGreeting()} {user?.identities?.[0]?.identity_data?.display_name || "Guest"} ({user.email})
                </p>

                {/* Horizontal Line */}
                <div style={{ marginTop: "1rem", borderBottom: "1px solid var(--border-color)" }} />

                <MenuItem label="Logout" onClick={() => { setMenuOpen(false); handleLogout(); }} />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
