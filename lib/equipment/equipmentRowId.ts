import type { Equipment } from "@/types/equipment";

/** Stable row key for selection — MongoDB `_id` only (never equipmentCode). */
export function getEquipmentDocumentId(equipment: Equipment): string | null {
  if (equipment._id == null || equipment._id === "") return null;
  return String(equipment._id);
}
