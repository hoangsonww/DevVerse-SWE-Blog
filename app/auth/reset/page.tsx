"use client";

import React, { useState } from "react";
import { verifyEmailExists, resetPassword } from "@/supabase/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaUnlockAlt } from "react-icons/fa";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [emailExists, setEmailExists] = useState<boolean>(false);
  const [emailToReset, setEmailToReset] = useState<string>("");

  const router = useRouter();

  const handleVerifyEmail = async () => {
    if (!email.trim()) {
      toast.error("Email is required", { theme: "colored" });
      return;
    }
    setLoading(true);
    const exists = await verifyEmailExists(email);
    if (exists) {
      setEmailExists(true);
      setEmailToReset(email);
      toast.success("Email found! Please reset your password below.", {
        theme: "colored",
      });
    } else {
      toast.error("Email does not exist", { theme: "colored" });
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!password.trim() || !confirmPassword.trim()) {
      toast.error("Both password fields are required", { theme: "colored" });
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { theme: "colored" });
      return;
    }
    setLoading(true);
    const response = await resetPassword(emailToReset, password);
    if (response.error) {
      toast.error(response.error.message, { theme: "colored" });
    } else {
      toast.success("Password updated successfully! Please login.", {
        theme: "colored",
      });
      router.push("/login");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "var(--background-color)",
        padding: "1rem",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundColor: "var(--container-background)",
          border: "1px solid var(--border-color)",
          borderRadius: "12px",
          padding: "2rem",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
          textAlign: "center",
          transition: "background-color 0.3s ease, border-color 0.3s ease",
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <FaUnlockAlt size={48} color="var(--link-color)" />
        </div>
        <h1
          style={{
            margin: "0",
            fontSize: "2rem",
            color: "var(--text-color)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Reset Password
        </h1>
        <p
          style={{
            marginTop: "0.5rem",
            marginBottom: "1.5rem",
            fontSize: "1rem",
            color: "var(--text-color)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Verify your email to reset your password 🔑
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "calc(100% - 4rem)",
              margin: "0 1rem",
              padding: "0.75rem 1rem",
              fontSize: "1rem",
              border: "1px solid var(--border-color)",
              borderRadius: "6px",
              backgroundColor: "var(--background-color)",
              color: "var(--text-color)",
              fontFamily: "Inter, sans-serif",
              transition: "border-color 0.3s ease, box-shadow 0.3s ease",
            }}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleVerifyEmail}
            disabled={loading}
            style={{
              width: "calc(100% - 2rem)",
              margin: "0 1rem",
              padding: "0.75rem",
              fontSize: "1rem",
              fontWeight: 600,
              border: "none",
              borderRadius: "6px",
              backgroundImage:
                "linear-gradient(45deg, var(--link-color), var(--hover-link-color))",
              backgroundSize: "200% 200%",
              backgroundPosition: "0% 50%",
              color: "#fff",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              transition: "background-position 0.5s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundPosition =
                "100% 50%")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundPosition =
                "0% 50%")
            }
          >
            {loading ? "Verifying..." : "Reset Password"}
          </motion.button>
        </div>

        {/* Reset PW modal */}
        {emailExists && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <p
              style={{
                marginBottom: "1rem",
                fontSize: "1rem",
                color: "var(--text-color)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Enter your new password below 🔐
            </p>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "calc(100% - 4rem)",
                margin: "0 1rem",
                padding: "0.75rem 1rem",
                fontSize: "1rem",
                border: "1px solid var(--border-color)",
                borderRadius: "6px",
                backgroundColor: "var(--background-color)",
                color: "var(--text-color)",
                fontFamily: "Inter, sans-serif",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
              }}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: "calc(100% - 4rem)",
                margin: "0 1rem",
                padding: "0.75rem 1rem",
                fontSize: "1rem",
                border: "1px solid var(--border-color)",
                borderRadius: "6px",
                backgroundColor: "var(--background-color)",
                color: "var(--text-color)",
                fontFamily: "Inter, sans-serif",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
              }}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleResetPassword}
              disabled={loading}
              style={{
                width: "calc(100% - 2rem)",
                margin: "0 1rem",
                padding: "0.75rem",
                fontSize: "1rem",
                fontWeight: 600,
                border: "none",
                borderRadius: "6px",
                backgroundImage:
                  "linear-gradient(45deg, var(--link-color), var(--hover-link-color))",
                backgroundSize: "200% 200%",
                backgroundPosition: "0% 50%",
                color: "#fff",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                transition:
                  "background-position 0.5s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundPosition =
                  "100% 50%")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundPosition =
                  "0% 50%")
              }
            >
              {loading ? "Resetting..." : "Reset Password"}
            </motion.button>
          </div>
        )}

        <div
          style={{
            marginTop: "1rem",
            fontSize: "0.9rem",
            color: "var(--text-color)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <p>
            Suddenly remembered your password?{" "}
            <Link
              href="/auth/login"
              style={{
                color: "var(--link-color)",
                textDecoration: "underline",
                transition: "color 0.3s ease",
              }}
            >
              Login
            </Link>
          </p>
          <p>
            Need an account?{" "}
            <Link
              href="/auth/register"
              style={{
                color: "var(--link-color)",
                textDecoration: "underline",
                transition: "color 0.3s ease",
              }}
            >
              Register
            </Link>
          </p>
        </div>
      </motion.div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        toastStyle={{
          background: "var(--container-background)",
          color: "var(--text-color)",
          border: "1px solid var(--border-color)",
          fontFamily: "Inter, sans-serif",
        }}
      />
    </div>
  );
};

export default ResetPasswordPage;
