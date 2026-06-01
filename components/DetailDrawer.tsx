"use client";

import {
  X,
  MapPin,
  Factory,
  Cpu,
  Wrench,
  FileText,
  Tag,
  User,
  Calendar,
  Globe,
} from "lucide-react";
import type { Equipment } from "@/types/equipment";

const STATUS_LABELS: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  active: { label: "Active", color: "#059669", bg: "rgba(16,185,129,0.1)" },
  "pending-investment": {
    label: "Maintenance",
    color: "#d97706",
    bg: "rgba(245,158,11,0.1)",
  },
  inactive: {
    label: "Inactive",
    color: "#6b7280",
    bg: "rgba(107,114,128,0.1)",
  },
  inspection: {
    label: "Inspection",
    color: "#2563eb",
    bg: "rgba(59,130,246,0.1)",
  },
};

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  if (!value && value !== 0) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      <span
        style={{
          fontSize: "11px",
          fontWeight: 600,
          color: "var(--color-text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "13px",
          color: "var(--color-text-primary)",
          wordBreak: "break-word",
        }}
      >
        {String(value)}
      </span>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderBottom: "1px solid var(--color-border)",
          paddingBottom: "8px",
        }}
      >
        <span style={{ color: "rgb(233,34,39)" }}>{icon}</span>
        <span
          style={{
            fontWeight: 700,
            fontSize: "13px",
            color: "var(--color-text-primary)",
          }}
        >
          {title}
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px 20px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

interface DetailDrawerProps {
  equipment: Equipment | null;
  onClose: () => void;
}

export default function DetailDrawer({
  equipment,
  onClose,
}: DetailDrawerProps) {
  if (!equipment) return null;
  const status = equipment.status || "active";
  const statusInfo = STATUS_LABELS[status];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          zIndex: 200,
          animation: "fadeIn 0.2s ease",
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "460px",
          height: "100vh",
          background: "var(--color-surface)",
          zIndex: 201,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.15)",
          animation: "slideIn 0.25s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "12px",
            background:
              "linear-gradient(135deg, rgba(233,34,39,0.04), transparent)",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "6px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  background: statusInfo.bg,
                  color: statusInfo.color,
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  border: `1px solid ${statusInfo.color}30`,
                }}
              >
                {statusInfo.label}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "var(--color-text-muted)",
                  fontFamily: "monospace",
                }}
              >
                #{equipment.equipmentCode}
              </span>
            </div>
            <h2
              style={{
                fontWeight: 800,
                fontSize: "17px",
                color: "var(--color-text-primary)",
                margin: 0,
              }}
            >
              {equipment.equipmentName}
            </h2>
            <div
              style={{
                fontSize: "12px",
                color: "var(--color-text-muted)",
                marginTop: "4px",
              }}
            >
              {equipment.equipmentGroup.level1} ›{" "}
              {equipment.equipmentGroup.level2}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              border: "1px solid var(--color-border)",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-text-secondary)",
              flexShrink: 0,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(233,34,39,0.05)";
              e.currentTarget.style.borderColor = "rgb(233,34,39)";
              e.currentTarget.style.color = "rgb(233,34,39)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "var(--color-border)";
              e.currentTarget.style.color = "var(--color-text-secondary)";
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* Equipment Classification */}
          <Section icon={<Tag size={15} />} title="Equipment Classification">
            <DetailRow
              label="Group Level 1"
              value={equipment.equipmentGroup.level1}
            />
            <DetailRow
              label="Group Level 2"
              value={equipment.equipmentGroup.level2}
            />
            <DetailRow
              label="Group Level 3"
              value={equipment.equipmentGroup.level3}
            />
            <DetailRow
              label="Group Level 4"
              value={equipment.equipmentGroup.level4}
            />
          </Section>

          {/* Organization */}
          <Section icon={<Factory size={15} />} title="Organization Hierarchy">
            <DetailRow
              label="Legal Entity"
              value={equipment.organization.legalEntity}
            />
            <DetailRow label="Factory" value={equipment.organization.factory} />
            <DetailRow
              label="Workshop"
              value={equipment.organization.workshop}
            />
            <DetailRow label="Layout" value={equipment.organization.layout} />
            <DetailRow
              label="Work Center"
              value={equipment.organization.workCenter}
            />
            {equipment.organization.area && (
              <DetailRow label="Area" value={equipment.organization.area} />
            )}
          </Section>

          {/* Manufacturer */}
          <Section icon={<Wrench size={15} />} title="Manufacturer Information">
            <DetailRow label="Brand" value={equipment.manufacturer.brand} />
            <DetailRow label="Model" value={equipment.manufacturer.model} />
            <DetailRow label="Country" value={equipment.manufacturer.country} />
            <DetailRow
              label="Produce Year"
              value={equipment.manufacturer.produceYear}
            />
          </Section>

          {/* Technical */}
          <Section icon={<Cpu size={15} />} title="Technical Specifications">
            <div style={{ gridColumn: "1 / -1" }}>
              <DetailRow
                label="Specification"
                value={equipment.specification}
              />
            </div>
            <DetailRow
              label="Installation Location"
              value={equipment.installationLocation}
            />
            {equipment.note && (
              <DetailRow label="Notes" value={equipment.note} />
            )}
          </Section>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 20px",
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            className="btn-brand"
            style={{ flex: 1, justifyContent: "center" }}
          >
            Edit Equipment
          </button>
          <button
            className="btn-ghost"
            style={{ flex: 1, justifyContent: "center" }}
          >
            Schedule Maintenance
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  );
}
