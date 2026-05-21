"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Cpu,
  Factory,
  Layers,
  GitBranch,
  Wrench,
  BarChart3,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useSidebarStore } from "@/lib/store/useSidebarStore";
import Image from "next/image";

const navItems = [
  { href: "dashboard", label: "Bảng thống kê", icon: LayoutDashboard },
  { href: "equipments", label: "Danh sách thiết bị", icon: Cpu },
  { href: "equipment-groups", label: "Nhóm thiết bị", icon: Layers },
  { href: "factories", label: "Quản lý nhà máy", icon: Factory },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { collapsed, setCollapsed, hydrated } = useSidebarStore();

  if (!hydrated) return null;

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
      }}
    >
      {/* Logo */}
      <div
        style={{
          minHeight: "72px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: collapsed ? "8px 5px 8px 5px" : "12px 16px 8px 16px",
          borderBottom: "1px solid var(--color-border)",
          gap: "4px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: collapsed ? "60px" : "100px",
            height: collapsed ? "20px" : "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Image
            src={"/logo-01.png"}
            alt="logo"
            width={collapsed ? 60 : 100}
            height={collapsed ? 20 : 40}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </div>
        {!collapsed && (
          <div
            style={{
              fontWeight: 700,
              fontSize: "14px",
              color: "var(--color-text-primary)",
              textAlign: "center",
              marginTop: "2px",
              lineHeight: 1.2,
              padding: "5px 2px",
              wordBreak: "break-word",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            Hệ thống Quản lí thiết bị Cơ khí
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          padding: "12px 8px",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;

          const formattedPathname = `/${item.href}`;

          const isActive = pathname === formattedPathname;

          return (
            <Link
              key={item.href}
              href={`/${item.href}`}
              className={`sidebar-item${isActive ? " active" : ""}`}
              style={{
                justifyContent: collapsed ? "center" : "flex-start",
                padding: collapsed ? "8px" : "8px 12px",
              }}
              title={collapsed ? item.label : undefined}
              // onClick={() => setPage(PAGE_TITLES[item.href])}
            >
              <Icon
                size={18}
                strokeWidth={isActive ? 2.5 : 2}
                className="icon"
              />

              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
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
          gap: "6px",
        }}
      >
        {collapsed ? (
          <ChevronRight size={16} />
        ) : (
          <>
            <ChevronLeft size={16} />
            <span
              style={{
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              Collapse
            </span>
          </>
        )}
      </button>
    </aside>
  );
}
