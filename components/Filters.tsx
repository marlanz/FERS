"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, RotateCcw, Filter } from "lucide-react";

export interface FilterState {
  factories: string[];
  groups: string[];
  workCenters: string[];
  produceYears: string[];
  statuses: string[];
}

interface FiltersProps {
  factories: string[];
  groups: string[];
  workCenters: string[];
  produceYears: number[];
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
}

function MultiSelect({
  label,
  options,
  selected,
  onChange,
  brandAccent,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  brandAccent?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const allSelected = selected.length === options.length;
  const isActive = selected.length > 0;

  const toggle = (v: string) => {
    if (selected.includes(v)) onChange(selected.filter((s) => s !== v));
    else onChange([...selected, v]);
  };

  const toggleAll = () => {
    if (allSelected) onChange([]);
    else onChange([...options]);
  };

  return (
    <div ref={ref} style={{ position: "relative", minWidth: "140px" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "0 10px",
          height: "34px",
          border: `1px solid ${isActive ? "rgb(233,34,39)" : "var(--color-border)"}`,
          borderRadius: "8px",
          background: isActive ? "rgba(233,34,39,0.05)" : "var(--color-surface)",
          color: isActive ? "rgb(233,34,39)" : "var(--color-text-secondary)",
          fontSize: "13px",
          fontWeight: 500,
          cursor: "pointer",
          whiteSpace: "nowrap",
          width: "100%",
          justifyContent: "space-between",
          transition: "all 0.15s ease",
        }}
      >
        <span>
          {label}
          {selected.length > 0 && (
            <span
              style={{
                marginLeft: "6px",
                background: "rgb(233,34,39)",
                color: "white",
                borderRadius: "9999px",
                padding: "1px 6px",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              {selected.length}
            </span>
          )}
        </span>
        <ChevronDown
          size={13}
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}
        />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            minWidth: "200px",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 200,
            overflow: "hidden",
          }}
        >
          {/* Select All */}
          <div
            onClick={toggleAll}
            style={{
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              borderBottom: "1px solid var(--color-border)",
              fontSize: "12px",
              fontWeight: 600,
              color: "rgb(233,34,39)",
              transition: "background 0.1s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(233,34,39,0.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div
              style={{
                width: "14px",
                height: "14px",
                border: `2px solid rgb(233,34,39)`,
                borderRadius: "3px",
                background: allSelected ? "rgb(233,34,39)" : "transparent",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {allSelected && <span style={{ color: "white", fontSize: "9px", fontWeight: 800 }}>✓</span>}
            </div>
            Select All
          </div>
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {options.map((opt) => {
              const checked = selected.includes(opt);
              return (
                <div
                  key={opt}
                  onClick={() => toggle(opt)}
                  style={{
                    padding: "7px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    fontSize: "13px",
                    color: "var(--color-text-primary)",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface-2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      border: `2px solid ${checked ? "rgb(233,34,39)" : "var(--color-border)"}`,
                      borderRadius: "3px",
                      background: checked ? "rgb(233,34,39)" : "transparent",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.15s",
                    }}
                  >
                    {checked && <span style={{ color: "white", fontSize: "9px", fontWeight: 800 }}>✓</span>}
                  </div>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{opt}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Filters({ factories, groups, workCenters, produceYears, filters, onFiltersChange }: FiltersProps) {
  const years = produceYears.map(String);
  const statuses = ["active", "maintenance", "inactive", "inspection"];

  const hasFilters =
    filters.factories.length > 0 ||
    filters.groups.length > 0 ||
    filters.workCenters.length > 0 ||
    filters.produceYears.length > 0 ||
    filters.statuses.length > 0;

  const reset = () => onFiltersChange({ factories: [], groups: [], workCenters: [], produceYears: [], statuses: [] });

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "12px",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--color-text-secondary)", flexShrink: 0 }}>
        <Filter size={15} />
        <span style={{ fontSize: "13px", fontWeight: 600 }}>Filters</span>
      </div>

      <div style={{ width: "1px", height: "20px", background: "var(--color-border)", flexShrink: 0 }} />

      <MultiSelect
        label="Factory"
        options={factories}
        selected={filters.factories}
        onChange={(v) => onFiltersChange({ ...filters, factories: v })}
      />
      <MultiSelect
        label="Equipment Group"
        options={groups}
        selected={filters.groups}
        onChange={(v) => onFiltersChange({ ...filters, groups: v })}
      />
      <MultiSelect
        label="Work Center"
        options={workCenters}
        selected={filters.workCenters}
        onChange={(v) => onFiltersChange({ ...filters, workCenters: v })}
      />
      <MultiSelect
        label="Produce Year"
        options={years}
        selected={filters.produceYears}
        onChange={(v) => onFiltersChange({ ...filters, produceYears: v })}
      />
      <MultiSelect
        label="Status"
        options={statuses}
        selected={filters.statuses}
        onChange={(v) => onFiltersChange({ ...filters, statuses: v })}
      />

      {hasFilters && (
        <button
          onClick={reset}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "0 10px",
            height: "34px",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            background: "transparent",
            color: "var(--color-text-secondary)",
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgb(233,34,39)";
            e.currentTarget.style.color = "rgb(233,34,39)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border)";
            e.currentTarget.style.color = "var(--color-text-secondary)";
          }}
        >
          <RotateCcw size={13} />
          Reset
        </button>
      )}
    </div>
  );
}
