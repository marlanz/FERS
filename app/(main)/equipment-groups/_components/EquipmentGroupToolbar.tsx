"use client";

import { useRef, useState, useEffect } from "react";
import {
  Search,
  FileSpreadsheet,
  Download,
  Plus,
  RefreshCw,
  TableIcon,
  ChevronDown,
} from "lucide-react";

interface EquipmentGroupToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  onAddGroup: () => void;
  onRefresh?: () => void;
  onImportExcel?: () => void;
}

export function EquipmentGroupToolbar({
  search,
  onSearchChange,
  onAddGroup,
  onRefresh,
  onImportExcel,
}: EquipmentGroupToolbarProps) {
  const [importMenuOpen, setImportMenuOpen] = useState(false);
  const importMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!importMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        importMenuRef.current &&
        !importMenuRef.current.contains(e.target as Node)
      ) {
        setImportMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [importMenuOpen]);

  return (
    <div
      style={{
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
        position: "sticky",
        top: 0,
        zIndex: 40,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "nowrap",
        }}
      >
        {/* Search — same style as EquipmentToolbar */}
        <div style={{ position: "relative", flex: 1, maxWidth: "340px" }}>
          <Search
            size={14}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--color-text-muted)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm nhóm, loại, cấu hình, công suất..."
            style={{
              width: "100%",
              height: "34px",
              paddingLeft: "32px",
              paddingRight: search ? "30px" : "10px",
              border: "1px solid var(--color-border)",
              borderRadius: "7px",
              fontSize: "13px",
              background: "var(--color-surface-2)",
              color: "var(--color-text-primary)",
              outline: "none",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgb(233,34,39)";
              e.target.style.boxShadow = "0 0 0 3px rgba(233,34,39,0.08)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--color-border)";
              e.target.style.boxShadow = "none";
            }}
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--color-text-muted)",
                fontSize: "16px",
                lineHeight: 1,
                padding: 0,
              }}
            >
              ×
            </button>
          )}
        </div>

        <div style={{ flex: 1 }} />

        {/* Refresh */}
        <button
          className="btn-ghost"
          style={{ height: "34px", padding: "0 10px", flexShrink: 0 }}
          title="Tải lại dữ liệu"
          onClick={onRefresh}
        >
          <RefreshCw size={14} />
          Tải lại
        </button>

        {/* Import dropdown */}
        <div ref={importMenuRef} style={{ position: "relative", flexShrink: 0 }}>
          <button
            id="group-toolbar-import-btn"
            className="btn-ghost"
            onClick={() => setImportMenuOpen((o) => !o)}
            style={{ height: "34px", gap: "5px" }}
            aria-haspopup="menu"
            aria-expanded={importMenuOpen}
          >
            <FileSpreadsheet size={14} />
            Nhập
            <ChevronDown
              size={12}
              style={{
                transition: "transform 0.15s",
                transform: importMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                opacity: 0.6,
              }}
            />
          </button>

          {importMenuOpen && (
            <div
              role="menu"
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                right: 0,
                minWidth: "190px",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "10px",
                boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
                zIndex: 200,
                overflow: "hidden",
                animation: "dropdownIn 0.15s ease",
              }}
            >
              {/* Import Excel */}
              <button
                id="group-toolbar-import-excel-btn"
                role="menuitem"
                onClick={() => {
                  setImportMenuOpen(false);
                  onImportExcel?.();
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "var(--color-text-primary)",
                  fontWeight: 500,
                  textAlign: "left",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--color-surface-2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "7px",
                    background: "rgba(34,197,94,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <TableIcon size={14} style={{ color: "#22c55e" }} />
                </span>
                <div>
                  <div>Nhập với Excel</div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--color-text-muted)",
                      fontWeight: 400,
                    }}
                  >
                    Chấp nhận file .xlsx, .xls
                  </div>
                </div>
              </button>
            </div>
          )}

          <style>{`
            @keyframes dropdownIn {
              from { opacity: 0; transform: translateY(-6px) }
              to   { opacity: 1; transform: translateY(0) }
            }
          `}</style>
        </div>

        {/* Export */}
        <button className="btn-ghost" style={{ height: "34px", flexShrink: 0 }}>
          <Download size={14} />
          Xuất
        </button>

        {/* Add new group — primary action */}
        <button
          id="group-toolbar-add-btn"
          className="btn-brand"
          onClick={onAddGroup}
          style={{ height: "34px", flexShrink: 0, fontWeight: 600 }}
        >
          <Plus size={14} />
          Thêm nhóm
        </button>
      </div>
    </div>
  );
}
