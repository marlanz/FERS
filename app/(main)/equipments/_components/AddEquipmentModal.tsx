"use client";

import React, { useCallback, useEffect, useState } from "react";
import { X, Plus, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { sanitizeRecord } from "@/lib/utils/equipmentSanitizer";
import type { EquipmentStatus } from "@/types/equipment";

// ─── Form types ───────────────────────────────────────────────────────────────

interface FormState {
  equipmentName: string;
  equipmentCode: string;
  status: EquipmentStatus;
  equipmentGroup: {
    level1: string;
    level2: string;
    level3: string;
    level4: string;
  };
  organization: {
    legalEntity: string;
    factory: string;
    workshop: string;
    layout: string;
    workCenter: string;
    area: string;
  };
  manufacturer: {
    country: string;
    brand: string;
    model: string;
    produceYear: string;
  };
  specification: string;
  installationLocation: string;
  note: string;
}

const EMPTY_FORM: FormState = {
  equipmentName: "",
  equipmentCode: "",
  status: "active",
  equipmentGroup: { level1: "", level2: "", level3: "", level4: "" },
  organization: {
    legalEntity: "",
    factory: "",
    workshop: "",
    layout: "",
    workCenter: "",
    area: "",
  },
  manufacturer: { country: "", brand: "", model: "", produceYear: "" },
  specification: "",
  installationLocation: "",
  note: "",
};

const STATUS_OPTIONS: { value: EquipmentStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "maintenance", label: "Maintenance" },
  { value: "inspection", label: "Inspection" },
  { value: "inactive", label: "Inactive" },
];

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: "var(--color-text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  marginBottom: 4,
  display: "block",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 34,
  padding: "0 10px",
  fontSize: 13,
  border: "1px solid var(--color-border)",
  borderRadius: 7,
  background: "var(--color-surface)",
  color: "var(--color-text-primary)",
  outline: "none",
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  height: "auto",
  minHeight: 64,
  padding: "8px 10px",
  resize: "vertical",
};

function FormField({
  label,
  required,
  fullWidth,
  children,
}: {
  label: string;
  required?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={fullWidth ? { gridColumn: "1 / -1" } : undefined}>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: "rgb(233,34,39)", marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "rgb(233,34,39)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 12,
          paddingBottom: 6,
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px 14px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

interface AddEquipmentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddEquipmentModal({
  open,
  onClose,
  onSuccess,
}: AddEquipmentModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM);
      setFieldErrors([]);
      setSubmitError("");
      setSubmitting(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose, submitting]);

  const update = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setFieldErrors([]);
      setSubmitError("");
    },
    [],
  );

  const updateNested = useCallback(
    <
      K extends "equipmentGroup" | "organization" | "manufacturer",
      F extends keyof FormState[K],
    >(
      section: K,
      field: F,
      value: FormState[K][F],
    ) => {
      setForm((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
      setFieldErrors([]);
      setSubmitError("");
    },
    [],
  );

  const buildPayload = useCallback(() => {
    const produceYear =
      form.manufacturer.produceYear.trim() === ""
        ? null
        : Number(form.manufacturer.produceYear);

    return {
      equipmentName: form.equipmentName,
      equipmentCode: form.equipmentCode,
      status: form.status,
      equipmentGroup: form.equipmentGroup,
      organization: {
        ...form.organization,
        area: form.organization.area || undefined,
      },
      manufacturer: {
        ...form.manufacturer,
        produceYear: Number.isFinite(produceYear) ? produceYear : null,
      },
      specification: form.specification || undefined,
      installationLocation: form.installationLocation || undefined,
      note: form.note || undefined,
    };
  }, [form]);

  const handleSubmit = useCallback(async () => {
    const payload = buildPayload();
    const { data, error } = sanitizeRecord(payload, 0);

    if (error || !data) {
      setFieldErrors(error?.messages ?? ["Please fix the highlighted fields."]);
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    setFieldErrors([]);

    try {
      const res = await fetch("/api/equipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        const msg =
          result.messages?.join("; ") ??
          result.error ??
          "Failed to create equipment.";
        setSubmitError(msg);
        return;
      }

      onSuccess();
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [buildPayload, onSuccess]);

  if (!open) return null;

  return (
    <>
      <div
        onClick={submitting ? undefined : onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          zIndex: 1000,
          backdropFilter: "blur(3px)",
          animation: "fadeIn 0.2s ease",
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add equipment"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: 1001,
          width: "min(680px, 95vw)",
          maxHeight: "90vh",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: 14,
          boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "scaleIn 0.2s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "18px 20px",
            borderBottom: "1px solid var(--color-border)",
            background: "var(--color-surface-2)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: "rgba(233,34,39,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Plus size={18} style={{ color: "rgb(233,34,39)" }} />
          </div>
          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--color-text-primary)",
              }}
            >
              Add Equipment
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--color-text-muted)",
                marginTop: 1,
              }}
            >
              Create a new equipment record
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              cursor: submitting ? "not-allowed" : "pointer",
              color: "var(--color-text-muted)",
              padding: 4,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              opacity: submitting ? 0.5 : 1,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: 20,
            overflowY: "auto",
            flex: 1,
            minHeight: 0,
          }}
        >
          {(fieldErrors.length > 0 || submitError) && (
            <div
              style={{
                marginBottom: 16,
                padding: "10px 14px",
                background: "rgba(239,68,68,0.07)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: 8,
                display: "flex",
                gap: 8,
                fontSize: 12,
                color: "#ef4444",
              }}
            >
              <XCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                {submitError ||
                  fieldErrors.map((m, i) => (
                    <div key={i}>{m}</div>
                  ))}
              </div>
            </div>
          )}

          <FormSection title="Basic Information">
            <FormField label="Equipment Name" required>
              <input
                style={inputStyle}
                value={form.equipmentName}
                onChange={(e) => update("equipmentName", e.target.value)}
                placeholder="e.g. CNC Milling Machine"
              />
            </FormField>
            <FormField label="Equipment Code" required>
              <input
                style={inputStyle}
                value={form.equipmentCode}
                onChange={(e) => update("equipmentCode", e.target.value)}
                placeholder="e.g. EQ-001"
              />
            </FormField>
            <FormField label="Status">
              <select
                style={inputStyle}
                value={form.status}
                onChange={(e) =>
                  update("status", e.target.value as EquipmentStatus)
                }
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </FormField>
          </FormSection>

          <FormSection title="Equipment Group">
            {(["level1", "level2", "level3", "level4"] as const).map((lvl) => (
              <FormField key={lvl} label={`Level ${lvl.slice(-1)}`}>
                <input
                  style={inputStyle}
                  value={form.equipmentGroup[lvl]}
                  onChange={(e) =>
                    updateNested("equipmentGroup", lvl, e.target.value)
                  }
                />
              </FormField>
            ))}
          </FormSection>

          <FormSection title="Organization">
            <FormField label="Legal Entity">
              <input
                style={inputStyle}
                value={form.organization.legalEntity}
                onChange={(e) =>
                  updateNested("organization", "legalEntity", e.target.value)
                }
              />
            </FormField>
            <FormField label="Factory">
              <input
                style={inputStyle}
                value={form.organization.factory}
                onChange={(e) =>
                  updateNested("organization", "factory", e.target.value)
                }
              />
            </FormField>
            <FormField label="Workshop">
              <input
                style={inputStyle}
                value={form.organization.workshop}
                onChange={(e) =>
                  updateNested("organization", "workshop", e.target.value)
                }
              />
            </FormField>
            <FormField label="Layout">
              <input
                style={inputStyle}
                value={form.organization.layout}
                onChange={(e) =>
                  updateNested("organization", "layout", e.target.value)
                }
              />
            </FormField>
            <FormField label="Work Center">
              <input
                style={inputStyle}
                value={form.organization.workCenter}
                onChange={(e) =>
                  updateNested("organization", "workCenter", e.target.value)
                }
              />
            </FormField>
            <FormField label="Area">
              <input
                style={inputStyle}
                value={form.organization.area}
                onChange={(e) =>
                  updateNested("organization", "area", e.target.value)
                }
              />
            </FormField>
          </FormSection>

          <FormSection title="Manufacturer">
            <FormField label="Country">
              <input
                style={inputStyle}
                value={form.manufacturer.country}
                onChange={(e) =>
                  updateNested("manufacturer", "country", e.target.value)
                }
              />
            </FormField>
            <FormField label="Brand">
              <input
                style={inputStyle}
                value={form.manufacturer.brand}
                onChange={(e) =>
                  updateNested("manufacturer", "brand", e.target.value)
                }
              />
            </FormField>
            <FormField label="Model">
              <input
                style={inputStyle}
                value={form.manufacturer.model}
                onChange={(e) =>
                  updateNested("manufacturer", "model", e.target.value)
                }
              />
            </FormField>
            <FormField label="Produce Year">
              <input
                style={inputStyle}
                type="number"
                min={1900}
                max={2100}
                value={form.manufacturer.produceYear}
                onChange={(e) =>
                  updateNested("manufacturer", "produceYear", e.target.value)
                }
                placeholder="e.g. 2022"
              />
            </FormField>
          </FormSection>

          <FormSection title="Additional Details">
            <FormField label="Specification" fullWidth>
              <textarea
                style={textareaStyle}
                value={form.specification}
                onChange={(e) => update("specification", e.target.value)}
                placeholder="Technical specifications…"
              />
            </FormField>
            <FormField label="Installation Location" fullWidth>
              <input
                style={inputStyle}
                value={form.installationLocation}
                onChange={(e) =>
                  update("installationLocation", e.target.value)
                }
              />
            </FormField>
            <FormField label="Note" fullWidth>
              <textarea
                style={textareaStyle}
                value={form.note}
                onChange={(e) => update("note", e.target.value)}
                placeholder="Optional notes…"
              />
            </FormField>
          </FormSection>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 20px",
            borderTop: "1px solid var(--color-border)",
            background: "var(--color-surface-2)",
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            disabled={submitting}
            style={{
              height: 34,
              padding: "0 16px",
              border: "1px solid var(--color-border)",
              borderRadius: 7,
              background: "var(--color-surface)",
              color: "var(--color-text-secondary)",
              fontSize: 13,
              fontWeight: 500,
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.6 : 1,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              height: 34,
              padding: "0 20px",
              border: "none",
              borderRadius: 7,
              background: submitting
                ? "rgba(233,34,39,0.4)"
                : "rgb(233,34,39)",
              color: "white",
              fontSize: 13,
              fontWeight: 600,
              cursor: submitting ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {submitting ? (
              <>
                <Loader2
                  size={13}
                  style={{ animation: "spin 1s linear infinite" }}
                />
                Saving…
              </>
            ) : (
              <>
                <CheckCircle2 size={13} />
                Save Equipment
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes scaleIn { from { opacity:0; transform:translate(-50%,-50%) scale(0.96) } to { opacity:1; transform:translate(-50%,-50%) scale(1) } }
        @keyframes spin    { to { transform:rotate(360deg) } }
      `}</style>
    </>
  );
}
