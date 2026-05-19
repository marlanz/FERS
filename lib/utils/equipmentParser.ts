import { EquipmentStatus } from "@/types/equipment";

export function normalizeEquipmentCode(value: unknown): string {
  const raw = String(value || "").trim();

  // Empty
  if (!raw) {
    return "DỰ ĐỊNH ĐẦU TƯ";
  }

  // Remove accents + lowercase
  const normalized = raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const invalidKeywords = ["dau tu", "du kien dau tu", "du dinh dau tu"];

  const isInvalid = invalidKeywords.some((k) => normalized.includes(k));

  if (isInvalid) {
    return "DỰ ĐỊNH ĐẦU TƯ";
  }

  return raw;
}

export function parseEquipmentStatus(value: unknown): EquipmentStatus {
  const raw = String(value || "").trim();

  // Empty
  if (!raw) {
    return "pending-investment";
  }

  // Remove accents + lowercase
  const normalized = raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const invalidKeywords = ["dau tu", "du kien dau tu", "du dinh dau tu"];

  const isInvalid = invalidKeywords.some((k) => normalized.includes(k));

  if (isInvalid) {
    return "pending-investment";
  }

  return "active";
}
