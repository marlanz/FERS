import type { Equipment, EquipmentStatus } from "@/types/equipment";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SanitizedEquipment
  extends Omit<Equipment, "_id" | "createdAt" | "updatedAt"> {}

export interface ParseResult {
  valid: SanitizedEquipment[];
  errors: ParseError[];
}

export interface ParseError {
  index: number;
  equipmentCode?: string;
  messages: string[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const VALID_STATUSES = new Set<string>([
  "active",
  "maintenance",
  "inactive",
  "inspection",
]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function s(val: unknown, fallback = ""): string {
  if (val === null || val === undefined) return fallback;
  return String(val).trim();
}

function num(val: unknown, fallback: number | null = null): number | null {
  if (val === null || val === undefined || val === "") return fallback;
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

function validateStatus(raw: unknown): EquipmentStatus {
  const lower = s(raw).toLowerCase();
  return VALID_STATUSES.has(lower) ? (lower as EquipmentStatus) : "active";
}

// ─── Parse raw JSON text ──────────────────────────────────────────────────────

export function parseJsonText(text: string): unknown[] {
  const parsed: unknown = JSON.parse(text); // throws on bad JSON
  if (!Array.isArray(parsed)) {
    throw new Error("JSON must be an array of equipment objects.");
  }
  return parsed;
}

// ─── Sanitize a single raw record ────────────────────────────────────────────

export function sanitizeRecord(
  raw: unknown,
  index: number
): { data: SanitizedEquipment | null; error: ParseError | null } {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return {
      data: null,
      error: { index, messages: ["Record is not a valid object."] },
    };
  }

  const r = raw as Record<string, unknown>;
  const messages: string[] = [];

  const equipmentName = s(r.equipmentName);
  const equipmentCode = s(r.equipmentCode);

  if (!equipmentName) messages.push("Missing required field: equipmentName");
  if (!equipmentCode) messages.push("Missing required field: equipmentCode");

  if (messages.length > 0) {
    return {
      data: null,
      error: { index, equipmentCode: equipmentCode || undefined, messages },
    };
  }

  // Sub-document helpers
  const grp = typeof r.equipmentGroup === "object" && r.equipmentGroup !== null
    ? (r.equipmentGroup as Record<string, unknown>)
    : {};

  const org = typeof r.organization === "object" && r.organization !== null
    ? (r.organization as Record<string, unknown>)
    : {};

  const mfr = typeof r.manufacturer === "object" && r.manufacturer !== null
    ? (r.manufacturer as Record<string, unknown>)
    : {};

  const data: SanitizedEquipment = {
    no: num(r.no) ?? 0,
    equipmentName,
    equipmentCode,
    equipmentGroup: {
      level1: s(grp.level1),
      level2: s(grp.level2),
      level3: s(grp.level3),
      level4: s(grp.level4),
    },
    organization: {
      legalEntity: s(org.legalEntity),
      factory: s(org.factory),
      workshop: s(org.workshop),
      layout: s(org.layout),
      workCenter: s(org.workCenter),
      area: s(org.area),
    },
    manufacturer: {
      country: s(mfr.country),
      brand: s(mfr.brand),
      model: s(mfr.model),
      produceYear: num(mfr.produceYear),
    },
    specification: s(r.specification),
    installationLocation: s(r.installationLocation),
    note: s(r.note),
    status: validateStatus(r.status),
  };

  return { data, error: null };
}

// ─── Sanitize the full array, de-duplicate within the batch ──────────────────

export function sanitizeBatch(raw: unknown[]): ParseResult {
  const valid: SanitizedEquipment[] = [];
  const errors: ParseError[] = [];
  const seenCodes = new Set<string>();

  raw.forEach((item, index) => {
    const { data, error } = sanitizeRecord(item, index);

    if (error) {
      errors.push(error);
      return;
    }

    if (!data) return;

    // Intra-batch duplicate check
    const code = data.equipmentCode.toUpperCase();
    if (seenCodes.has(code)) {
      errors.push({
        index,
        equipmentCode: data.equipmentCode,
        messages: [`Duplicate equipmentCode within the file: "${data.equipmentCode}"`],
      });
      return;
    }

    seenCodes.add(code);
    valid.push(data);
  });

  return { valid, errors };
}
