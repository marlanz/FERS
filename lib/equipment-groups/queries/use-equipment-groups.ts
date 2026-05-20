import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { EquipmentGroupRecord } from "@/types/equipment-group";
import type {
  ListEquipmentGroupsResponse,
  ApiErrorResponse,
} from "@/lib/equipment-groups/api-types";

// ---------------------------------------------------------------------------
// Query key
// ---------------------------------------------------------------------------

export const EQUIPMENT_GROUPS_QUERY_KEY = ["equipment-groups"] as const;

// ---------------------------------------------------------------------------
// Fetcher
// ---------------------------------------------------------------------------

async function fetchEquipmentGroups(): Promise<EquipmentGroupRecord[]> {
  const res = await fetch("/api/equipment-groups");
  if (!res.ok) {
    const err: ApiErrorResponse = await res.json();
    throw new Error(
      err.error ?? `Failed to fetch equipment groups: ${res.statusText}`,
    );
  }
  const json: ListEquipmentGroupsResponse = await res.json();
  return json.data;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useEquipmentGroups() {
  return useQuery({
    queryKey: EQUIPMENT_GROUPS_QUERY_KEY,
    queryFn: fetchEquipmentGroups,
  });
}

/** Convenience hook for invalidating the list after mutations. */
export function useInvalidateEquipmentGroups() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: EQUIPMENT_GROUPS_QUERY_KEY });
}
