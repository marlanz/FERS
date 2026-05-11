"use client";

import {
  LayoutDashboard,
  Cpu,
  Factory,
  GitBranch,
  Wrench,
  BarChart3,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "equipment", label: "Equipment", icon: Cpu },
  { id: "factories", label: "Factories", icon: Factory },
  { id: "workcenters", label: "Work Centers", icon: GitBranch },
  { id: "maintenance", label: "Maintenance", icon: Wrench },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "import", label: "Import Excel", icon: FileSpreadsheet },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ collapsed, onToggle, activePage, onNavigate }: SidebarProps) {
  return (
    <aside
      style={{
        width: collapsed ? "64px" : "220px",
        minWidth: collapsed ? "64px" : "220px",
        background: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s ease, min-width 0.25s ease",
        overflow: "hidden",
        position: "relative",
        zIndex: 20,
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: "56px",
          display: "flex",
          alignItems: "center",
          padding: collapsed ? "0 20px" : "0 16px",
          borderBottom: "1px solid var(--color-border)",
          gap: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "30px",
            height: "30px",
            background: "rgb(233,34,39)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Zap size={16} color="white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--color-text-primary)", whiteSpace: "nowrap" }}>
              EMS Pro
            </div>
            <div style={{ fontSize: "11px", color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
              v2.4.1
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: "2px" }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`sidebar-item${isActive ? " active" : ""}`}
              style={{
                width: "100%",
                border: "none",
                justifyContent: collapsed ? "center" : "flex-start",
                padding: collapsed ? "8px" : "8px 12px",
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className="icon" />
              {!collapsed && (
                <span style={{ opacity: 1, transition: "opacity 0.2s" }}>{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        style={{
          margin: "12px 8px",
          padding: "8px",
          borderRadius: "8px",
          border: "1px solid var(--color-border)",
          background: "var(--color-surface-2)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-text-secondary)",
          transition: "all 0.15s ease",
          gap: "6px",
        }}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={16} /> : (
          <>
            <ChevronLeft size={16} />
            <span style={{ fontSize: "13px", fontWeight: 500, whiteSpace: "nowrap" }}>Collapse</span>
          </>
        )}
      </button>
    </aside>
  );
}
