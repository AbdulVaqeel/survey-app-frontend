import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../utils/useAuth";

export default function Navbar({ dark = false }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      if (!mobile) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navLinks = user
    ? [
        { to: "/", label: "Home" },
        { to: "/about", label: "About" },
        { to: "/dashboard", label: "Dashboard" },
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/about", label: "About" },
      ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        height: "68px",
        background: dark
          ? "rgba(13,17,23,0.85)"
          : "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${
          dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"
        }`,
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          textDecoration: "none",
          zIndex: 102,
        }}
      >
        <span
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "linear-gradient(135deg,#0d9488,#f59e0b)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: 16,
          }}
        >
          S
        </span>

        <span
          style={{
            fontWeight: 700,
            fontSize: 18,
            color: dark ? "#fff" : "var(--ink)",
          }}
        >
          SurveyPulse
        </span>
      </Link>

      {/* ================= DESKTOP MENU ================= */}
      {!isMobile && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                textDecoration: "none",
                padding: "6px 14px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: isActive(to)
                  ? "var(--teal)"
                  : dark
                  ? "rgba(255,255,255,0.75)"
                  : "var(--muted)",
                background: isActive(to)
                  ? dark
                    ? "rgba(13,148,136,.15)"
                    : "rgba(13,148,136,.08)"
                  : "transparent",
              }}
            >
              {label}
            </Link>
          ))}

          {user ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginLeft: 10,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: dark
                    ? "rgba(255,255,255,.6)"
                    : "var(--muted)",
                }}
              >
                {user.username}
              </span>

              <button
                onClick={logout}
                style={{
                  padding: "7px 18px",
                  borderRadius: 8,
                  cursor: "pointer",
                  background: "transparent",
                  border: `1px solid ${
                    dark
                      ? "rgba(255,255,255,.2)"
                      : "var(--border)"
                  }`,
                  color: dark ? "#fff" : "var(--ink)",
                }}
              >
                Log out
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                gap: 8,
                marginLeft: 10,
              }}
            >
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  padding: "7px 18px",
                  borderRadius: 8,
                  background: "transparent",
                  border: `1px solid ${
                    dark
                      ? "rgba(255,255,255,.2)"
                      : "var(--border)"
                  }`,
                  color: dark ? "#fff" : "var(--ink)",
                }}
              >
                Log in
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ================= MOBILE HAMBURGER ================= */}
      {isMobile && (
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: 5,
            padding: 5,
            zIndex: 102,
          }}
        >
          <span
            style={{
              width: 25,
              height: 3,
              background: dark ? "#fff" : "#111",
              borderRadius: 5,
              transform: menuOpen ? "rotate(45deg) translate(6px, 5px)" : "none",
              transition: "transform 0.2s ease",
            }}
          ></span>

          <span
            style={{
              width: 25,
              height: 3,
              background: dark ? "#fff" : "#111",
              borderRadius: 5,
              opacity: menuOpen ? 0 : 1,
              transition: "opacity 0.2s ease",
            }}
          ></span>

          <span
            style={{
              width: 25,
              height: 3,
              background: dark ? "#fff" : "#111",
              borderRadius: 5,
              transform: menuOpen ? "rotate(-45deg) translate(6px, -5px)" : "none",
              transition: "transform 0.2s ease",
            }}
          ></span>
        </button>
      )}

      {/* ================= MOBILE FULLSCREEN MENU ================= */}
      {isMobile && menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: "100vh",
            background: dark ? "#0d1117" : "#ffffff",
            display: "flex",
            flexDirection: "column",
            padding: "80px 24px 60px 24px",
            boxSizing: "border-box",
            zIndex: 101,
          }}
        >
          {/* Main Navigation Links Wrapper */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, flexGrow: 1 }}>
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                style={{
                  textDecoration: "none",
                  color: dark ? "#fff" : "#111",
                  fontSize: 18,
                  fontWeight: 600,
                  padding: "6px 0",
                  borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Action Footer Wrapper (Pulled up and fits clean) */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
            {user ? (
              <>
                <span
                  style={{
                    color: dark ? "rgba(255,255,255,.6)" : "var(--muted)",
                    textAlign: "center",
                    fontSize: 14,
                    marginBottom: 2,
                  }}
                >
                  Logged in as <strong>{user.username}</strong>
                </span>

                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: 10,
                    border: `1px solid ${dark ? "rgba(255,255,255,.2)" : "#ccc"}`,
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: 16,
                    fontWeight: 600,
                    color: dark ? "#fff" : "#111",
                  }}
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                style={{
                  textDecoration: "none",
                  textAlign: "center",
                  width: "100%",
                  padding: "12px",
                  borderRadius: 10,
                  boxSizing: "border-box",
                  background: "linear-gradient(135deg,#0d9488,#f59e0b)",
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(13, 148, 136, 0.2)",
                }}
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}