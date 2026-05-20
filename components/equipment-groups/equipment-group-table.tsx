"use client";

import { useMemo, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Layers,
} from "lucide-react";
import type { EquipmentGroupRecord } from "@/types/equipment-group";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function SortIcon({ state }: { state: "asc" | "desc" | false }) {
  if (state === "asc") return <ChevronUp size={12} />;
  if (state === "desc") return <ChevronDown size={12} />;
  return <ChevronsUpDown size={12} style={{ opacity: 0.4 }} />;
}

const PAGE_SIZES = [10, 20, 50];

const LEVEL_CFG: Record<number, { bg: string; color: string; border: string }> = {
  1: { bg: "rgba(233,34,39,0.08)", color: "rgb(233,34,39)", border: "rgba(233,34,39,0.2)" },
  2: { bg: "rgba(59,130,246,0.08)", color: "#2563eb", border: "rgba(59,130,246,0.2)" },
  3: { bg: "rgba(16,185,129,0.08)", color: "#059669", border: "rgba(16,185,129,0.2)" },
  4: { bg: "rgba(139,92,246,0.08)", color: "#7c3aed", border: "rgba(139,92,246,0.2)" },
};

function LevelBadge({ level, value }: { level: number; value: string }) {
  const cfg = LEVEL_CFG[level];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: 12,
        fontWeight: 500,
        padding: "2px 8px",
        borderRadius: 9999,
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        whiteSpace: "nowrap",
        maxWidth: 160,
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
      title={value}
    >
      {value}
    </span>
  );
}

function buildPageNums(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface EquipmentGroupTableProps {
  data: EquipmentGroupRecord[];
  isLoading?: boolean;
  /** Controlled search term — owned by the page client, passed through the toolbar */
  globalFilter: string;
  onEdit: (group: EquipmentGroupRecord) => void;
  onDelete: (group: EquipmentGroupRecord) => void;
  /** Bubbles the live filtered count up to the parent for the results bar */
  onFilteredCountChange?: (count: number) => void;
}

export function EquipmentGroupTable({
  data,
  isLoading,
  globalFilter,
  onEdit,
  onDelete,
  onFilteredCountChange,
}: EquipmentGroupTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Reset to page 1 whenever the search term changes
  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [globalFilter]);

  // ── Column definitions ────────────────────────────────────────────
  const columns = useMemo<ColumnDef<EquipmentGroupRecord>[]>(
    () => [
      {
        id: "index",
        header: "#",
        size: 44,
        enableSorting: false,
        cell: ({ row, table }) => {
          const idx =
            table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
            row.index +
            1;
          return (
            <span style={{ fontSize: 11, color: "var(--color-text-muted)", fontFamily: "monospace" }}>
              {idx}
            </span>
          );
        },
      },
      {
        accessorKey: "level1",
        header: "Nhóm (L1)",
        size: 180,
        cell: ({ getValue }) => <LevelBadge level={1} value={getValue<string>()} />,
      },
      {
        accessorKey: "level2",
        header: "Loại (L2)",
        size: 160,
        cell: ({ getValue }) => <LevelBadge level={2} value={getValue<string>()} />,
      },
      {
        accessorKey: "level3",
        header: "Cấu hình (L3)",
        size: 150,
        cell: ({ getValue }) => <LevelBadge level={3} value={getValue<string>()} />,
      },
      {
        accessorKey: "level4",
        header: "Công suất (L4)",
        size: 110,
        cell: ({ getValue }) => <LevelBadge level={4} value={getValue<string>()} />,
      },
      {
        accessorKey: "createdAt",
        header: "Ngày tạo",
        size: 110,
        cell: ({ getValue }) => (
          <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
            {formatDate(getValue<string>())}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        size: 90,
        enableSorting: false,
        cell: ({ row }) => (
          <div
            style={{ display: "flex", gap: 4, justifyContent: "center" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Edit"
              onClick={() => onEdit(row.original)}
              style={{
                width: 26,
                height: 26,
                borderRadius: 5,
                border: "1px solid var(--color-border)",
                background: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-text-muted)",
                transition: "all 0.12s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(59,130,246,0.08)";
                e.currentTarget.style.color = "#2563eb";
                e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
                e.currentTarget.style.color = "var(--color-text-muted)";
                e.currentTarget.style.borderColor = "var(--color-border)";
              }}
            >
              <Pencil size={12} />
            </button>
            <button
              aria-label="Delete"
              onClick={() => onDelete(row.original)}
              style={{
                width: 26,
                height: 26,
                borderRadius: 5,
                border: "1px solid var(--color-border)",
                background: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-text-muted)",
                transition: "all 0.12s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                e.currentTarget.style.color = "#ef4444";
                e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
                e.currentTarget.style.color = "var(--color-text-muted)";
                e.currentTarget.style.borderColor = "var(--color-border)";
              }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete],
  );

  // ── Table instance ────────────────────────────────────────────────
  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, pagination },
    onSortingChange: setSorting,
    onGlobalFilterChange: () => {}, // controlled externally — no-op setter
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Bubble filtered count up for the results bar in page-client
  const filteredCount = table.getFilteredRowModel().rows.length;
  useEffect(() => {
    onFilteredCountChange?.(filteredCount);
  }, [filteredCount, onFilteredCountChange]);

  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const pageNums = buildPageNums(pageIndex + 1, pageCount);
  const rowFrom = filteredCount === 0 ? 0 : pageIndex * pageSize + 1;
  const rowTo = Math.min((pageIndex + 1) * pageSize, filteredCount);

  // ── Render ────────────────────────────────────────────────────────
  //
  // Structure mirrors EquipmentDataTable exactly:
  //   wrapper  (flex column, flex:1, overflow:hidden)
  //     ├─ sub-toolbar  (page-size only — search is in EquipmentGroupToolbar)
  //     ├─ table area   (flex:1, overflow:auto)   ← only scrollable zone
  //     └─ pagination   (flexShrink:0, borderTop) ← always visible
  //
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflow: "hidden",
        background: "var(--color-surface)",
      }}
    >
      {/* ── Sub-toolbar: page-size selector only ── */}
      <div
        style={{
          padding: "8px 14px",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
          background: "var(--color-surface-2)",
        }}
      >
        <div style={{ flex: 1 }} />
        <div
          style={{
            fontSize: 12,
            color: "var(--color-text-secondary)",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <span>Hiện</span>
          <select
            value={pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
              setPagination((p) => ({ ...p, pageIndex: 0 }));
            }}
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: 6,
              padding: "2px 5px",
              fontSize: 12,
              background: "var(--color-surface)",
              color: "var(--color-text-primary)",
              cursor: "pointer",
            }}
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span>/ trang</span>
        </div>
      </div>

      {/* ── Table scroll area — only this overflows ── */}
      <div style={{ flex: 1, overflowX: "auto", overflowY: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            fontSize: 13,
          }}
        >
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => {
                  const isCenter = header.id === "index" || header.id === "actions";
                  return (
                    <th
                      key={header.id}
                      style={{
                        width: header.getSize(),
                        padding: "9px 12px",
                        background: "var(--color-surface-2)",
                        borderBottom: "2px solid var(--color-border)",
                        textAlign: isCenter ? "center" : "left",
                        position: "sticky",
                        top: 0,
                        zIndex: 5,
                        whiteSpace: "nowrap",
                        cursor: header.column.getCanSort() ? "pointer" : "default",
                        userSelect: "none",
                      }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                          fontSize: 11,
                          fontWeight: 700,
                          color: "var(--color-text-secondary)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          justifyContent: isCenter ? "center" : "flex-start",
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <SortIcon state={header.column.getIsSorted()} />
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {columns.map((_, j) => (
                      <td
                        key={j}
                        style={{ padding: "10px 12px", borderBottom: "1px solid var(--color-border)" }}
                      >
                        <div
                          className="skeleton"
                          style={{ height: 16, borderRadius: 4, width: j === 0 ? 28 : "80%" }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              : table.getRowModel().rows.length === 0
              ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      style={{ padding: "60px 20px", textAlign: "center", color: "var(--color-text-muted)" }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <Layers size={36} style={{ opacity: 0.2 }} />
                        <div style={{ fontWeight: 700, fontSize: 15, color: "var(--color-text-secondary)" }}>
                          {globalFilter ? "Không tìm thấy kết quả" : "Chưa có nhóm thiết bị nào"}
                        </div>
                        <div style={{ fontSize: 13 }}>
                          {globalFilter
                            ? "Thử thay đổi từ khoá tìm kiếm"
                            : 'Nhấn "Thêm nhóm" để thêm nhóm đầu tiên'}
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              : table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    style={{ transition: "background 0.1s" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background = "var(--color-surface-2)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background = "";
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const isCenter = cell.column.id === "index" || cell.column.id === "actions";
                      return (
                        <td
                          key={cell.id}
                          style={{
                            padding: "9px 12px",
                            borderBottom: "1px solid var(--color-border)",
                            verticalAlign: "middle",
                            textAlign: isCenter ? "center" : "left",
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination — fixed at bottom, never scrolls ── */}
      <div
        style={{
          padding: "10px 14px",
          borderTop: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          justifyContent: "space-between",
          flexShrink: 0,
          background: "var(--color-surface)",
        }}
      >
        {/* "Đang hiện X–Y trên Z" — mirrors EquipmentDataTable wording */}
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
          Đang hiện{" "}
          <strong style={{ color: "var(--color-text-primary)" }}>
            {rowFrom}–{rowTo}
          </strong>{" "}
          trên{" "}
          <strong style={{ color: "rgb(233,34,39)" }}>{filteredCount}</strong>
          {filteredCount !== data.length && (
            <span style={{ color: "var(--color-text-muted)" }}>
              {" "}(lọc từ {data.length})
            </span>
          )}
        </span>

        {/* Page buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="btn-ghost"
            style={{ height: 30, padding: "0 8px", opacity: !table.getCanPreviousPage() ? 0.4 : 1 }}
          >
            <ChevronLeft size={14} />
          </button>

          {pageNums.map((p, i) =>
            p === "…" ? (
              <span key={`e-${i}`} style={{ padding: "0 4px", color: "var(--color-text-muted)", fontSize: 13 }}>
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => table.setPageIndex(Number(p) - 1)}
                style={{
                  width: 30,
                  height: 30,
                  border: `1px solid ${pageIndex + 1 === p ? "rgb(233,34,39)" : "var(--color-border)"}`,
                  borderRadius: 6,
                  background: pageIndex + 1 === p ? "rgb(233,34,39)" : "transparent",
                  color: pageIndex + 1 === p ? "white" : "var(--color-text-secondary)",
                  fontSize: 13,
                  fontWeight: pageIndex + 1 === p ? 700 : 400,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {p}
              </button>
            ),
          )}

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="btn-ghost"
            style={{ height: 30, padding: "0 8px", opacity: !table.getCanNextPage() ? 0.4 : 1 }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
