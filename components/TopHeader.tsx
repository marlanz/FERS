"use client";

import { useState } from "react";
import { Search, Bell, Download, Sun, Moon, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/useAuthStore";

interface TopHeaderProps {
  darkMode?: boolean;
  onToggleDark?: () => void;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
}

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/equipments": "Equipment Registry",
  "/factories": "Factory Management",
  "/workcenters": "Work Centers",
  "/maintenance": "Maintenance Schedule",
  "/reports": "Reports & Analytics",
  "/import": "Import Excel",
  "/settings": "System Settings",
};

export default function TopHeader({
  darkMode,
  onToggleDark,
  searchValue,
}: TopHeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const path = usePathname();

  const avatar = user?.image;

  return (
    <header
      style={{
        height: "56px",
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: "12px",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      {/* Page title */}
      <div style={{ flex: "0 0 auto" }}>
        <h1
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--color-text-primary)",
            margin: 0,
          }}
        >
          {PAGE_TITLES[path]}
        </h1>
      </div>

      <div style={{ flex: 1 }} />

      {/* Export button */}
      {path === "/dashboard" && (
        <button
          className="btn-brand"
          style={{ height: "34px", fontSize: "13px" }}
        >
          <Download size={14} />
          Export Report
        </button>
      )}

      {/* Dark mode toggle */}
      <button
        onClick={onToggleDark}
        className="btn-ghost"
        style={{ height: "34px", padding: "0 10px" }}
        title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* Notifications */}
      <div style={{ position: "relative" }}>
        <button
          className="btn-ghost"
          style={{ height: "34px", padding: "0 10px", position: "relative" }}
          onClick={() => setNotifOpen(!notifOpen)}
          title="Notifications"
        >
          <Bell size={16} />
          <span
            style={{
              position: "absolute",
              top: "6px",
              right: "6px",
              width: "8px",
              height: "8px",
              background: "rgb(233,34,39)",
              borderRadius: "50%",
              border: "2px solid var(--color-surface)",
            }}
          />
        </button>
      </div>

      {/* User avatar */}
      <button
        className="btn-ghost"
        style={{ height: "34px", padding: "0 10px", gap: "8px" }}
      >
        {avatar && (
          <Image
            src={avatar}
            alt={user.name || "User avatar"}
            width={26}
            height={26}
            className="rounded-full shrink-0"
          />
        )}
        <span style={{ fontSize: "13px", fontWeight: 500 }}>
          {user?.name ?? user?.email}
        </span>
        <ChevronDown size={13} />
      </button>
    </header>
  );
}
