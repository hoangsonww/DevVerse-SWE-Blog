"use client";

import { useRouter } from "next/navigation";
import { FiAlertTriangle, FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <div className="icon-wrapper">
          <FiAlertTriangle size={80} />
        </div>
        <h1>404 - Page Not Found</h1>
        <p>
          Sorry, the page you are looking for doesn’t exist. It might have been
          removed or the URL might be incorrect.
        </p>
        <button
          onClick={() => router.push("/")}
          className="home-button"
          aria-label="Go back to Home"
        >
          <FiArrowLeft size={20} className="arrow-icon" />
          Go back to Home
        </button>
      </div>

      <style jsx>{`
        .not-found-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: var(--background-color);
          padding: 1rem;
          border-radius: 8px;
          transition: background-color 0.3s ease;
        }
        .not-found-card {
          background-color: var(--container-background);
          color: var(--text-color);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.8s ease-out;
          max-width: 600px;
          width: 100%;
          transition:
            box-shadow 0.3s ease,
            background-color 0.3s ease;
        }
        .icon-wrapper {
          margin-bottom: 1rem;
          color: var(--link-color);
          animation: bounce 1.5s infinite;
        }
        h1 {
          margin: 0.5rem 0;
          font-size: 2.5rem;
          color: var(--text-color);
        }
        p {
          font-size: 1.125rem;
          margin-bottom: 1.5rem;
          line-height: 1.6;
          color: var(--text-color);
        }
        .home-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background-color: var(--link-color);
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition:
            background-color 0.3s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
          font: inherit;
        }
        .home-button .arrow-icon {
          transition: transform 0.3s ease;
        }
        .home-button:hover {
          background-color: var(--hover-link-color);
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }
        .home-button:hover .arrow-icon {
          transform: translateX(-5px);
        }
        .home-button:focus {
          outline: 3px solid var(--hover-link-color);
          outline-offset: 2px;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
