"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Cpu, Layers, Network, Box, Trash2, X } from "lucide-react";

import { EquipmentGroupToolbar } from "@/app/(main)/equipment-groups/_components/EquipmentGroupToolbar";
import { EquipmentGroupTable } from "./equipment-group-table";
import { EquipmentGroupDialog } from "./equipment-group-dialog";
import { DeleteEquipmentGroupDialog } from "./delete-equipment-group-dialog";
import type { EquipmentGroupRecord } from "@/types/equipment-group";
import type { ApiErrorResponse } from "@/lib/equipment-groups/api-types";

// ╔══════════════════════════════════════════════════════════════════╗
// ║  ⭐  MOCK DATA BLOCK — swap this out for live data in 2 steps   ║
// ║                                                                  ║
// ║  STEP 1: Delete the two lines below (import + mock assignment)   ║
// ║  STEP 2: Uncomment the `useEquipmentGroups` lines (search ⭐)   ║
// ╚══════════════════════════════════════════════════════════════════╝
import { MOCK_EQUIPMENT_GROUPS } from "@/lib/equipment-groups/mock-data"; // ⭐ DELETE
// import { useEquipmentGroups, useInvalidateEquipmentGroups } from "@/lib/equipment-groups/queries/use-equipment-groups"; // ⭐ UNCOMMENT

// ---------------------------------------------------------------------------
// KPI strip — mirrors EquipmentKpiRow style exactly
// ---------------------------------------------------------------------------

function GroupKpiStrip({
  groups,
  isLoading,
}: {
  groups: EquipmentGroupRecord[];
  isLoading: boolean;
}) {
  const totalGroups = groups.length;
  const uniqueL1 = new Set(groups.map((g) => g.level1)).size;
  const uniqueL2 = new Set(groups.map((g) => `${g.level1}|${g.level2}`)).size;
  const uniqueL3 = new Set(
    groups.map((g) => `${g.level1}|${g.level2}|${g.level3}`),
  ).size;

  const cards = [
    {
      label: "Tổng nhóm",
      value: totalGroups,
      color: "rgb(233,34,39)",
      bg: "rgba(233,34,39,0.04)",
      border: "rgba(233,34,39,0.2)",
      borderLeft: "3px solid rgb(233,34,39)",
      Icon: Cpu,
      iconBg: "rgba(233,34,39,0.1)",
    },
    {
      label: "Nhóm L1",
      value: uniqueL1,
      color: "#2563eb",
      bg: "rgba(59,130,246,0.04)",
      border: "rgba(59,130,246,0.2)",
      borderLeft: "3px solid #2563eb",
      Icon: Layers,
      iconBg: "rgba(59,130,246,0.1)",
    },
    {
      label: "Loại L2",
      value: uniqueL2,
      color: "#059669",
      bg: "rgba(16,185,129,0.04)",
      border: "rgba(16,185,129,0.2)",
      borderLeft: "3px solid #059669",
      Icon: Network,
      iconBg: "rgba(16,185,129,0.1)",
    },
    {
      label: "Cấu hình L3",
      value: uniqueL3,
      color: "#7c3aed",
      bg: "rgba(139,92,246,0.04)",
      border: "rgba(139,92,246,0.2)",
      borderLeft: "3px solid #7c3aed",
      Icon: Box,
      iconBg: "rgba(139,92,246,0.1)",
    },
  ] as const;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 12,
        padding: "14px 20px",
        borderBottom: "1px solid var(--color-border)",
        background: "var(--color-surface)",
        flexShrink: 0,
      }}
    >
      {cards.map(
        ({ label, value, color, bg, border, borderLeft, Icon, iconBg }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px",
              border: `1px solid ${border}`,
              borderLeft,
              borderRadius: 8,
              background: bg,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color,
                flexShrink: 0,
              }}
            >
              <Icon size={17} />
            </div>
            <div>
              <div
                style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}
              >
                {isLoading ? (
                  <div
                    className="skeleton"
                    style={{ height: 22, width: 36, borderRadius: 4 }}
                  />
                ) : (
                  value
                )}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--color-text-muted)",
                  marginTop: 2,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {label}
              </div>
            </div>
          </div>
        ),
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page client
// ---------------------------------------------------------------------------

export function EquipmentGroupPageClient() {
  // ── Data ──────────────────────────────────────────────────────────
  // ⭐ REPLACE everything between the dashes with:
  //    const { data: groups = [], isLoading, isError, error, refetch } = useEquipmentGroups();
  //    const invalidate = useInvalidateEquipmentGroups();
  // ─────────────────────────────────────────────────────────────────
  const groups: EquipmentGroupRecord[] = MOCK_EQUIPMENT_GROUPS; // ⭐ DELETE
  const isLoading = false;
  const isError = false;
  const error: Error | null = null;
  const refetch = () => {};
  const invalidate = async () => {}; // ⭐ DELETE
  // ─────────────────────────────────────────────────────────────────

  // Search state lifted here — passed to both toolbar (input) and table (filter)
  const [search, setSearch] = useState("");

  // Filtered count bubbled up from TanStack Table instance → drives results bar
  const [filteredCount, setFilteredCount] = useState(groups.length);

  // Multi-select state — bubbled up from the table for bulk actions
  const [selectedGroups, setSelectedGroups] = useState<EquipmentGroupRecord[]>([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // ── Modal state ───────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<EquipmentGroupRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EquipmentGroupRecord | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────
  const handleEdit = useCallback((group: EquipmentGroupRecord) => {
    setEditTarget(group);
  }, []);

  const handleDeleteRequest = useCallback((group: EquipmentGroupRecord) => {
    setDeleteTarget(group);
    setDeleteOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(
    async (group: EquipmentGroupRecord) => {
      try {
        const res = await fetch(`/api/equipment-groups/${group._id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const err: ApiErrorResponse = await res.json();
          toast.error(err.error ?? "Xoá thất bại. Vui lòng thử lại.");
          return;
        }

        toast.success("Đã xoá nhóm thiết bị.");
        setDeleteOpen(false);
        setDeleteTarget(null);
        await invalidate();
        refetch();
      } catch {
        toast.error("Network error. Please try again.");
      }
    },
    [invalidate, refetch],
  );

  const handleMutationSuccess = useCallback(() => {
    invalidate();
    refetch();
  }, [invalidate, refetch]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedGroups.length === 0) return;
    setIsBulkDeleting(true);
    let successCount = 0;
    let failCount = 0;
    try {
      await Promise.all(
        selectedGroups.map(async (group) => {
          try {
            const res = await fetch(`/api/equipment-groups/${group._id}`, {
              method: "DELETE",
            });
            if (res.ok) {
              successCount++;
            } else {
              failCount++;
            }
          } catch {
            failCount++;
          }
        }),
      );
      if (successCount > 0) {
        toast.success(`Đã xoá ${successCount} nhóm thiết bị.`);
        await invalidate();
        refetch();
      }
      if (failCount > 0) {
        toast.error(`${failCount} nhóm không thể xoá. Vui lòng thử lại.`);
      }
    } finally {
      setIsBulkDeleting(false);
      setBulkDeleteOpen(false);
      setSelectedGroups([]);
    }
  }, [selectedGroups, invalidate, refetch]);

  // ── Render ────────────────────────────────────────────────────────
  //
  // Mirrors EquipmentWrapper layout exactly:
  //   root          (flex column, height:100%, overflow:hidden)
  //     ├─ Toolbar  (EquipmentGroupToolbar — search + actions, flexShrink:0)
  //     ├─ Error    (conditional banner, flexShrink:0)
  //     ├─ KPI      (GroupKpiStrip, flexShrink:0)
  //     ├─ Results  (count bar, flexShrink:0)
  //     └─ Body     (flex:1, overflow:hidden → table fills it)
  //
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        background: "var(--color-background)",
      }}
    >
      {/* ── Toolbar (search lives here, not in the table) ── */}
      <EquipmentGroupToolbar
        search={search}
        onSearchChange={setSearch}
        onAddGroup={() => setCreateOpen(true)}
        onRefresh={refetch}
        selectedCount={selectedGroups.length}
        onDeleteSelected={() => setBulkDeleteOpen(true)}
        onClearSelection={() => setSelectedGroups([])}
      />

      {/* ── Error banner ── */}
      {isError && (
        <div
          style={{
            padding: "10px 20px",
            background: "rgba(239,68,68,0.08)",
            borderBottom: "1px solid rgba(239,68,68,0.25)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 13,
            color: "#ef4444",
            flexShrink: 0,
          }}
        >
          <span style={{ fontWeight: 600 }}>⚠ Lỗi tải dữ liệu:</span>
          <span style={{ opacity: 0.85 }}>
            {error instanceof Error ? error.message : "Unknown error"}
          </span>
          <button
            onClick={refetch}
            style={{
              marginLeft: "auto",
              padding: "4px 12px",
              border: "1px solid rgba(239,68,68,0.4)",
              borderRadius: 6,
              background: "rgba(239,68,68,0.1)",
              color: "#ef4444",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Thử lại
          </button>
        </div>
      )}

      {/* ── KPI strip (fixed — never scrolls) ── */}
      <GroupKpiStrip groups={groups} isLoading={isLoading} />

      {/* ── Results count bar (fixed — mirrors EquipmentWrapper) ── */}
      <div
        style={{
          padding: "6px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-surface)",
          flexShrink: 0,
        }}
      >
        {isLoading ? (
          <div
            className="skeleton"
            style={{ height: 14, width: 180, borderRadius: 4 }}
          />
        ) : (
          <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
            Showing{" "}
            <strong style={{ color: "var(--color-text-primary)" }}>
              {filteredCount}
            </strong>{" "}
            of{" "}
            <strong style={{ color: "rgb(233,34,39)" }}>{groups.length}</strong>{" "}
            records
            {search && (
              <span style={{ color: "var(--color-text-muted)" }}>
                {" "}— filtered by &ldquo;{search}&rdquo;
              </span>
            )}
          </span>
        )}
      </div>

      {/* ── Body: table fills remaining space, manages its own scroll ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "var(--color-surface)",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <EquipmentGroupTable
          data={groups}
          isLoading={isLoading}
          globalFilter={search}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
          onFilteredCountChange={setFilteredCount}
          onSelectionChange={setSelectedGroups}
        />
      </div>

      {/* ── Dialogs ── */}
      <EquipmentGroupDialog
        mode="create"
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={handleMutationSuccess}
      />

      <EquipmentGroupDialog
        mode="edit"
        open={editTarget !== null}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null);
        }}
        editTarget={editTarget}
        onSuccess={handleMutationSuccess}
      />

      <DeleteEquipmentGroupDialog
        group={deleteTarget}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
      />

      {/* ── Bulk delete confirmation overlay ── */}
      {bulkDeleteOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => !isBulkDeleting && setBulkDeleteOpen(false)}
        >
          <div
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: 14,
              padding: "28px 28px 22px",
              maxWidth: 420,
              width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "rgba(239,68,68,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Trash2 size={18} style={{ color: "#ef4444" }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                  Xoá {selectedGroups.length} nhóm thiết bị
                </div>
                <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                  Hành động này không thể hoàn tác. Tất cả{" "}
                  <strong style={{ color: "var(--color-text-primary)" }}>
                    {selectedGroups.length} nhóm
                  </strong>{" "}
                  đã chọn sẽ bị xoá vĩnh viễn.
                </div>
              </div>
            </div>

            {/* Preview list (max 5) */}
            <div
              style={{
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                padding: "10px 12px",
                marginBottom: 20,
                maxHeight: 140,
                overflowY: "auto",
              }}
            >
              {selectedGroups.slice(0, 5).map((g) => (
                <div
                  key={g._id}
                  style={{
                    fontSize: 12,
                    color: "var(--color-text-secondary)",
                    padding: "3px 0",
                    borderBottom: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "rgb(233,34,39)",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {g.fullPath}
                  </span>
                </div>
              ))}
              {selectedGroups.length > 5 && (
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--color-text-muted)",
                    paddingTop: 6,
                    fontStyle: "italic",
                  }}
                >
                  ...và {selectedGroups.length - 5} nhóm khác
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                onClick={() => setBulkDeleteOpen(false)}
                disabled={isBulkDeleting}
                className="btn-ghost"
                style={{ height: 36, opacity: isBulkDeleting ? 0.5 : 1 }}
              >
                <X size={14} />
                Huỷ
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={isBulkDeleting}
                style={{
                  height: 36,
                  padding: "0 18px",
                  background: isBulkDeleting ? "#f87171" : "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: isBulkDeleting ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  transition: "background 0.15s",
                }}
              >
                <Trash2 size={14} />
                {isBulkDeleting
                  ? `Đang xoá...`
                  : `Xoá ${selectedGroups.length} nhóm`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
