"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/supabase/auth";
import { motion } from "framer-motion";
import { FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-toastify";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast.error(error.message, { theme: "colored" });
    } else {
      toast.success("Signed in successfully!", { theme: "colored" });
      router.push("/");
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
        borderRadius: "8px",
        transition: "background-color 0.3s ease, border-color 0.3s ease",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
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
          <FaSignInAlt size={48} color="var(--link-color)" />
        </div>
        <h1
          style={{
            margin: "0",
            fontSize: "2rem",
            color: "var(--text-color)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Login
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
          Sign in to access your account 🔒
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
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
              transition:
                "border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease",
            }}
          />
          <div
            style={{
              position: "relative",
              width: "calc(100% - 4rem)",
              margin: "0 1rem",
            }}
          >
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={inputStyles}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: "0",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "var(--link-color)",
              }}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
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
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </div>
        <div
          style={{
            marginTop: "1.5rem",
            fontSize: "0.9rem",
            color: "var(--text-color)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <p>
            Don't have an account?{" "}
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
          <p>
            Forgot your password?{" "}
            <Link
              href="/auth/reset"
              style={{
                color: "var(--link-color)",
                textDecoration: "underline",
                transition: "color 0.3s ease",
              }}
            >
              Reset Password
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const inputStyles: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  fontSize: "1rem",
  border: "1px solid var(--border-color)",
  borderRadius: "6px",
  backgroundColor: "var(--background-color)",
  color: "var(--text-color)",
  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
  fontFamily: "Inter, sans-serif",
};

const buttonStyles: React.CSSProperties = {
  width: "calc(100% - 2rem)",
  margin: "0 1rem",
  padding: "0.75rem",
  fontSize: "1rem",
  fontWeight: 600,
  border: "none",
  borderRadius: "6px",
  backgroundImage:
    "linear-gradient(45deg, var(--link-color), var(--hover-link-color))",
  color: "#fff",
  cursor: "pointer",
  transition: "background-position 0.5s ease, transform 0.2s ease",
};

const linkStyles: React.CSSProperties = {
  color: "var(--link-color)",
  textDecoration: "underline",
};

export default LoginPage;
