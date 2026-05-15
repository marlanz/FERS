export default function EquipmentLoading() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* header row shimmer */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            padding: "10px 16px",
            borderBottom: "2px solid var(--color-border)",
            background: "var(--color-surface-2)",
          }}
        >
          {[14, 30, 110, 200, 110, 90, 160, 120, 100, 70, 120].map((w, i) => (
            <div
              key={i}
              className="skeleton"
              style={{ width: w, height: 12, borderRadius: 3, flexShrink: 0 }}
            />
          ))}
        </div>
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "12px",
              padding: "11px 16px",
              borderBottom: "1px solid var(--color-border)",
              opacity: 1 - i * 0.05,
            }}
          >
            <div
              className="skeleton"
              style={{ width: 14, height: 14, borderRadius: 3, flexShrink: 0 }}
            />
            <div
              className="skeleton"
              style={{ width: 30, height: 14, borderRadius: 3 }}
            />
            <div
              className="skeleton"
              style={{ width: 110, height: 14, borderRadius: 3 }}
            />
            <div
              className="skeleton"
              style={{ flex: 2, height: 14, borderRadius: 3 }}
            />
            <div
              className="skeleton"
              style={{ width: 110, height: 14, borderRadius: 3 }}
            />
            <div
              className="skeleton"
              style={{ width: 90, height: 14, borderRadius: 3 }}
            />
            <div
              className="skeleton"
              style={{ flex: 1, height: 14, borderRadius: 3 }}
            />
            <div
              className="skeleton"
              style={{ width: 120, height: 14, borderRadius: 3 }}
            />
            <div
              className="skeleton"
              style={{ width: 100, height: 14, borderRadius: 3 }}
            />
            <div
              className="skeleton"
              style={{ width: 50, height: 14, borderRadius: 3 }}
            />
            <div
              className="skeleton"
              style={{ width: 70, height: 20, borderRadius: 9999 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
