/**
 * StatusBadge — self-contained equipment status badge.
 *
 * Automatically resolves color, background, and Vietnamese label
 * from the centralized EQUIPMENT_STATUSES config.
 *
 * Usage:
 *   <StatusBadge status={equipment.status} />
 */

import { getStatusMeta } from "@/lib/constants/equipment-status";

interface StatusBadgeProps {
  status: string;
  /** Optional size variant */
  size?: "sm" | "md";
}

export default function StatusBadge({
  status,
  size = "sm",
}: StatusBadgeProps) {
  const meta = getStatusMeta(status);

  const fontSize = size === "sm" ? "11px" : "12px";
  const padding = size === "sm" ? "2px 8px" : "4px 10px";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize,
        fontWeight: 600,
        background: meta.bg,
        color: meta.color,
        padding,
        borderRadius: "9999px",
        border: `1px solid ${meta.color}30`,
        whiteSpace: "nowrap",
        lineHeight: 1.4,
      }}
    >
      {/* Dot indicator */}
      <span
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: meta.color,
          display: "inline-block",
          marginRight: "5px",
          flexShrink: 0,
        }}
      />
      {meta.translate}
    </span>
  );
}
