"use client";

import React from "react";
import {
  Cpu,
  Factory,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  HandCoins,
} from "lucide-react";
import { SparklineChart } from "./SparklineChart";

interface KpiCardProps {
  title: string;
  value: number;
  subtitle: string;
  trend: number; // percentage change
  sparkData: number[];
  icon: React.ReactNode;
  accent?: boolean;
}

function KpiCard({
  title,
  value,
  subtitle,
  trend,
  sparkData,
  icon,
  accent,
}: KpiCardProps) {
  const isPositive = trend >= 0;
  return (
    <div
      className="card"
      style={{
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        position: "relative",
        overflow: "hidden",
        minHeight: "112px",
        cursor: "default",
      }}
    >
      {/* Accent bar */}
      {accent && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "3px",
            background: "linear-gradient(90deg, rgb(233,34,39), #ff6b6b)",
            borderRadius: "12px 12px 0 0",
          }}
        />
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--color-text-secondary)",
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "26px",
              fontWeight: 800,
              color: accent ? "rgb(233,34,39)" : "var(--color-text-primary)",
              lineHeight: 1,
            }}
          >
            {value.toLocaleString()}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "var(--color-text-secondary)",
              marginTop: "2px",
            }}
          >
            {subtitle}
          </div>
        </div>
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "8px",
            background: accent
              ? "rgba(233,34,39,0.1)"
              : "var(--color-surface-2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accent ? "rgb(233,34,39)" : "var(--color-text-secondary)",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </div>

      {/* <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: isPositive ? "#10b981" : "#ef4444",
              background: isPositive
                ? "rgba(16,185,129,0.1)"
                : "rgba(239,68,68,0.1)",
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            {isPositive ? "+" : ""}
            {trend}%
          </span>
          <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
            so với tháng trước
          </span>
        </div>
        <div style={{ width: "80px", height: "32px" }}>
          <SparklineChart
            data={sparkData}
            color={accent ? "rgb(233,34,39)" : "#6b7280"}
          />
        </div>
      </div> */}
    </div>
  );
}

interface KpiCardsProps {
  totalEquipment: number;
  totalFactories: number;
  totalWorkCenters: number;
  activeEquipment: number;
  pendingInvestment: number;
}

export default function KpiCards({
  totalEquipment,
  totalFactories,
  totalWorkCenters,
  activeEquipment,
  pendingInvestment,
}: KpiCardsProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
        gap: "8px",
      }}
    >
      <KpiCard
        title="TỔNG THẾT BỊ"
        value={totalEquipment}
        subtitle="Thiết bị đã đăng kí"
        trend={8.2}
        sparkData={[18, 20, 19, 22, 24, 25, 28, 30]}
        icon={<Cpu size={20} />}
        accent
      />
      <KpiCard
        title="TỔNG NHÀ MÁY"
        value={totalFactories}
        subtitle="Nhà máy hoạt động"
        trend={0}
        sparkData={[3, 3, 3, 4, 4, 4, 4, totalFactories]}
        icon={<Factory size={20} />}
      />
      <KpiCard
        title="Số lượng xưởng"
        value={totalWorkCenters}
        subtitle="Xưởng hoạt động"
        trend={5.1}
        sparkData={[8, 10, 9, 11, 12, 13, 14, totalWorkCenters]}
        icon={<GitBranch size={20} />}
      />
      <KpiCard
        title="Thiết bị hoạt động"
        value={activeEquipment}
        subtitle={`${
          totalEquipment > 0
            ? Math.round((activeEquipment / totalEquipment) * 100)
            : 0
        }% Số thiết bị hoạt động`}
        trend={3.4}
        sparkData={[14, 16, 15, 18, 19, 20, 21, activeEquipment]}
        icon={<CheckCircle2 size={20} />}
      />
      <KpiCard
        title="Dự kiến đầu tư"
        value={pendingInvestment}
        subtitle="Số thiết bị đầu tư"
        trend={-12.5}
        sparkData={[6, 5, 7, 6, 5, 4, 3, pendingInvestment]}
        icon={<HandCoins size={20} />}
      />
    </div>
  );
}
