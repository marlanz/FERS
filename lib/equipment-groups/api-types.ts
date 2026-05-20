import type { EquipmentGroupRecord } from "@/types/equipment-group";

// ---------------------------------------------------------------------------
// Shared error envelope (mirrors lib/equipment/api-types.ts pattern)
// ---------------------------------------------------------------------------

export interface ApiErrorResponse {
  error: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

// ---------------------------------------------------------------------------
// Success envelopes
// ---------------------------------------------------------------------------

export interface ListEquipmentGroupsResponse {
  data: EquipmentGroupRecord[];
}

export interface GetEquipmentGroupResponse {
  data: EquipmentGroupRecord;
}

export interface CreateEquipmentGroupResponse {
  data: EquipmentGroupRecord;
}

export interface UpdateEquipmentGroupResponse {
  data: EquipmentGroupRecord;
}

export interface DeleteEquipmentGroupResponse {
  deletedId: string;
}
