import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../utils/useAuth";
import { PRODUCT_LINKS, COMPANY_LINKS } from "../siteNav";

const DROPDOWNS = [
  { key: "products", label: "Products", items: PRODUCT_LINKS },
  { key: "company", label: "Company", items: COMPANY_LINKS },
];

export default function Navbar({ dark = false }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [openDropdown, setOpenDropdown] = useState(null); // desktop hover/click dropdown key
  const [mobileExpanded, setMobileExpanded] = useState(null); // mobile accordion key
  const closeTimer = useRef(null);
  const navRef = useRef(null);

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

  // Close an open desktop dropdown on outside click / route change
  useEffect(() => {
    const onClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    setOpenDropdown(null);
    setMenuOpen(false);
    setMobileExpanded(null);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;
  const isGroupActive = (items) => items.some((it) => isActive(it.to));

  const openNow = (key) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(key);
  };
  const closeSoon = () => {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  const goTo = (to) => {
    if (user && to !== "/dashboard") logout();
    setOpenDropdown(null);
    navigate(to);
  };

  const navLinks = user && location.pathname === "/dashboard"
    ? [
        { to: "/", label: "Home" },
        { to: "/dashboard", label: "Dashboard" },
      ]
    : [{ to: "/", label: "Home" }];

  return (
    <nav
      ref={navRef}
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
          SurveyMatrix
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
              onClick={() => {
                if (user && to !== "/dashboard") logout();
              }}
              style={{
                textDecoration: "none",
                padding: "6px 14px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: isActive(to) ? "var(--teal)" : dark ? "rgba(255,255,255,0.75)" : "var(--muted)",
                background: isActive(to) ? (dark ? "rgba(13,148,136,.15)" : "rgba(13,148,136,.08)") : "transparent",
              }}
            >
              {label}
            </Link>
          ))}

          {/* Products / Company dropdowns */}
          {DROPDOWNS.map(({ key, label, items }) => {
            const active = isGroupActive(items);
            const open = openDropdown === key;
            return (
              <div
                key={key}
                style={{ position: "relative" }}
                onMouseEnter={() => openNow(key)}
                onMouseLeave={closeSoon}
              >
                <button
                  onClick={() => setOpenDropdown(open ? null : key)}
                  aria-expanded={open}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    textDecoration: "none",
                    padding: "6px 14px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    color: active || open ? "var(--teal)" : dark ? "rgba(255,255,255,0.75)" : "var(--muted)",
                    background: active || open ? (dark ? "rgba(13,148,136,.15)" : "rgba(13,148,136,.08)") : "transparent",
                  }}
                >
                  {label}
                  <svg width="10" height="10" viewBox="0 0 12 8" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {open && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      minWidth: 200,
                      background: dark ? "#151b23" : "#fff",
                      border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "var(--border)"}`,
                      borderRadius: 12,
                      boxShadow: "0 18px 40px rgba(15,23,42,0.16)",
                      padding: 8,
                      zIndex: 110,
                    }}
                  >
                    {items.map(({ to, label: itemLabel }) => (
                      <button
                        key={to}
                        onClick={() => goTo(to)}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "9px 12px",
                          borderRadius: 8,
                          fontSize: 14,
                          fontWeight: 500,
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          background: isActive(to) ? (dark ? "rgba(13,148,136,.18)" : "rgba(13,148,136,.08)") : "transparent",
                          color: isActive(to) ? "var(--teal)" : dark ? "rgba(255,255,255,0.85)" : "var(--ink)",
                        }}
                        onMouseEnter={(e) => { if (!isActive(to)) e.currentTarget.style.background = dark ? "rgba(255,255,255,0.06)" : "rgba(13,148,136,.06)"; }}
                        onMouseLeave={(e) => { if (!isActive(to)) e.currentTarget.style.background = "transparent"; }}
                      >
                        {itemLabel}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {user && location.pathname === "/dashboard" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: 10 }}>
              <span style={{ fontSize: 13, color: dark ? "rgba(255,255,255,.6)" : "var(--muted)" }}>
                {user.username}
              </span>
              <button onClick={logout} style={{ padding: "7px 18px", borderRadius: 8, cursor: "pointer", background: "transparent", border: `1px solid ${dark ? "rgba(255,255,255,.2)" : "var(--border)"}`, color: dark ? "#fff" : "var(--ink)" }}>
                Log out
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8, marginLeft: 10 }}>
              <Link to="/login" style={{ textDecoration: "none", padding: "7px 18px", borderRadius: 8, background: "transparent", border: `1px solid ${dark ? "rgba(255,255,255,.2)" : "var(--border)"}`, color: dark ? "#fff" : "var(--ink)" }}>
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
            overflowY: "auto",
          }}
        >
          {/* Main Navigation Links Wrapper */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4, flexGrow: 1 }}>
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => {
                  if (user && to !== "/dashboard") logout();
                  setMenuOpen(false);
                }}
                style={{
                  textDecoration: "none",
                  color: dark ? "#fff" : "#111",
                  fontSize: 18,
                  fontWeight: 600,
                  padding: "14px 0",
                  borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                }}
              >
                {label}
              </Link>
            ))}

            {/* Products / Company accordions */}
            {DROPDOWNS.map(({ key, label, items }) => {
              const expanded = mobileExpanded === key;
              return (
                <div key={key} style={{ borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                  <button
                    onClick={() => setMobileExpanded(expanded ? null : key)}
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: dark ? "#fff" : "#111",
                      fontSize: 18,
                      fontWeight: 600,
                      padding: "14px 0",
                      fontFamily: "inherit",
                    }}
                  >
                    {label}
                    <svg width="13" height="13" viewBox="0 0 12 8" fill="none" style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {expanded && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingBottom: 12 }}>
                      {items.map(({ to, label: itemLabel }) => (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setMenuOpen(false)}
                          style={{
                            textDecoration: "none",
                            color: dark ? "rgba(255,255,255,0.75)" : "var(--muted)",
                            fontSize: 15,
                            fontWeight: 500,
                            padding: "10px 0 10px 14px",
                          }}
                        >
                          {itemLabel}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Footer Wrapper (Pulled up and fits clean) */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
            {user && location.pathname === "/dashboard" ? (
              <>
                <span style={{ color: dark ? "rgba(255,255,255,.6)" : "var(--muted)", textAlign: "center", fontSize: 14, marginBottom: 2 }}>
                  Logged in as <strong>{user.username}</strong>
                </span>
                <button onClick={() => { logout(); setMenuOpen(false); }} style={{ width: "100%", padding: "12px", borderRadius: 10, border: `1px solid ${dark ? "rgba(255,255,255,.2)" : "#ccc"}`, background: "transparent", cursor: "pointer", fontSize: 16, fontWeight: 600, color: dark ? "#fff" : "#111" }}>
                  Log out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", textAlign: "center", width: "100%", padding: "12px", borderRadius: 10, boxSizing: "border-box", background: "linear-gradient(135deg,#0d9488,#f59e0b)", color: "#fff", fontSize: 16, fontWeight: 600 }}>
                Log in
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
