"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const BRAND = "rgb(233,34,39)";
const COLORS = [
  BRAND,
  "#ff6b6b",
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
];

const STATUS_COLORS: Record<string, string> = {
  Active: "#10b981",
  Maintenance: "#f59e0b",
  Inactive: "#6b7280",
  Inspection: "#3b82f6",
};

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  height?: number;
}

function ChartCard({
  title,
  subtitle,
  children,
  height = 260,
}: ChartCardProps) {
  return (
    <div
      className="card"
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div>
        <div
          style={{
            fontWeight: 700,
            fontSize: "15px",
            color: "var(--color-text-primary)",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: "12px",
              color: "var(--color-text-muted)",
              marginTop: "2px",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      <div style={{ height }}>{children}</div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "8px",
          padding: "10px 14px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          fontSize: "13px",
        }}
      >
        {label && (
          <div
            style={{
              fontWeight: 600,
              marginBottom: "6px",
              color: "var(--color-text-primary)",
            }}
          >
            {label}
          </div>
        )}
        {payload.map((p: any, i: number) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--color-text-secondary)",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: p.color || p.fill,
                flexShrink: 0,
              }}
            />
            <span>
              {p.name}:{" "}
              <strong style={{ color: "var(--color-text-primary)" }}>
                {p.value}
              </strong>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Chart 1: Equipment by Factory
interface ByFactoryProps {
  data: { factory: string; count: number }[];
}
export function EquipmentByFactoryChart({ data }: ByFactoryProps) {
  return (
    <ChartCard
      title="Thống kê thiết bị theo nhà máy"
      subtitle="Tổng số lượng thiết bị theo nhà máy"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 4, right: 16, left: -10, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            vertical={false}
          />
          <XAxis
            dataKey="factory"
            tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(233,34,39,0.05)" }}
          />
          <Bar
            dataKey="count"
            name="Equipment"
            fill={BRAND}
            radius={[4, 4, 0, 0]}
            maxBarSize={48}
            isAnimationActive
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// Chart 2: Status Distribution (Donut)
interface StatusProps {
  data: { name: string; value: number }[];
}
export function StatusDistributionChart({ data }: StatusProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <ChartCard
      title="Thống kê trạng thái thiết bị"
      subtitle="Trạng thái thiết bị hiện tại"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            isAnimationActive
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={STATUS_COLORS[entry.name] || COLORS[index]}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--color-text-secondary)",
                }}
              >
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// Chart 3: Top Equipment Groups (Horizontal Bar)
interface GroupProps {
  data: { name: string; count: number; pct: number }[];
}
export function TopGroupsChart({ data }: GroupProps) {
  const display = data.slice(0, 10);
  return (
    <ChartCard
      title="Top Equipment Groups"
      subtitle="Machine quantity and percentage"
      height={300}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={display}
          layout="vertical"
          margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={150}
            tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(233,34,39,0.05)" }}
          />
          <Bar
            dataKey="count"
            name="Equipment"
            fill={BRAND}
            radius={[0, 4, 4, 0]}
            maxBarSize={20}
            isAnimationActive
            animationDuration={900}
            label={{
              position: "right",
              fontSize: 11,
              fill: "var(--color-text-muted)",
              content: (v) => (v != null ? `${v}` : ""),
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// Chart 4: Equipment by Work Center (Stacked)
interface WorkCenterProps {
  data: { workCenter: string; [factory: string]: string | number }[];
  factories: string[];
}
export function WorkCenterChart({ data, factories }: WorkCenterProps) {
  const factoryColors: Record<string, string> = {};
  factories.forEach((f, i) => {
    factoryColors[f] = COLORS[i % COLORS.length];
  });
  return (
    <ChartCard
      title="Equipment by Work Center"
      subtitle="Stacked comparison across factories"
      height={300}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 4, right: 16, left: -10, bottom: 40 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            vertical={false}
          />
          <XAxis
            dataKey="workCenter"
            tick={{ fontSize: 10, fill: "var(--color-text-secondary)" }}
            tickLine={false}
            axisLine={false}
            angle={-30}
            textAnchor="end"
          />
          <YAxis
            tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
            formatter={(value) => (
              <span style={{ color: "var(--color-text-secondary)" }}>
                {value}
              </span>
            )}
          />
          {factories.map((f) => (
            <Bar
              key={f}
              dataKey={f}
              name={f}
              stackId="a"
              fill={factoryColors[f]}
              isAnimationActive
              animationDuration={800}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// Chart 5: Produce Year Trend
interface YearProps {
  data: { year: number; count: number }[];
}
export function ProduceYearChart({ data }: YearProps) {
  return (
    <ChartCard
      title="Equipment by Produce Year"
      subtitle="Fleet age distribution trend"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 4, right: 16, left: -10, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            vertical={false}
          />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "var(--color-border)", strokeWidth: 1 }}
          />
          <Line
            type="monotone"
            dataKey="count"
            name="Equipment"
            stroke={BRAND}
            strokeWidth={2.5}
            dot={{
              r: 4,
              fill: BRAND,
              stroke: "var(--color-surface)",
              strokeWidth: 2,
            }}
            activeDot={{ r: 6, fill: BRAND }}
            isAnimationActive
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
