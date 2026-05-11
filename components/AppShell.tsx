"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";
import DashboardContent from "@/components/DashboardContent";

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  equipment: "Equipment Registry",
  factories: "Factory Management",
  workcenters: "Work Centers",
  maintenance: "Maintenance Schedule",
  reports: "Reports & Analytics",
  import: "Import Excel",
  settings: "System Settings",
};

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "var(--color-background)",
      }}
    >
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopHeader
          title={PAGE_TITLES[activePage] || "Dashboard"}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((d) => !d)}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />

        <main
          style={{
            flex: 1,
            overflowY: "auto",
            background: "var(--color-background)",
          }}
        >
          {activePage === "dashboard" ? (
            <DashboardContent searchValue={searchValue} />
          ) : activePage === "equipment" ? (
            <DashboardContent searchValue={searchValue} />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: "16px",
                color: "var(--color-text-muted)",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  background: "rgba(233,34,39,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                }}
              >
                🚧
              </div>
              <div style={{ fontWeight: 700, fontSize: "18px", color: "var(--color-text-primary)" }}>
                {PAGE_TITLES[activePage]}
              </div>
              <div style={{ fontSize: "14px", textAlign: "center", maxWidth: "300px" }}>
                This module is under development. Navigate to{" "}
                <button
                  onClick={() => setActivePage("dashboard")}
                  style={{
                    color: "rgb(233,34,39)",
                    fontWeight: 600,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Dashboard
                </button>{" "}
                to explore the equipment analytics.
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
