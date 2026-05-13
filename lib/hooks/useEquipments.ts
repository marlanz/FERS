import { useQuery } from "@tanstack/react-query";
import type { Equipment } from "@/types/equipment";

async function fetchEquipments(): Promise<Equipment[]> {
  const res = await fetch("/api/equipments");
  if (!res.ok) {
    throw new Error(`Failed to fetch equipments: ${res.statusText}`);
  }
  return res.json();
}

export const EQUIPMENTS_QUERY_KEY = ["equipments"] as const;

export function useEquipments() {
  return useQuery({
    queryKey: EQUIPMENTS_QUERY_KEY,
    queryFn: fetchEquipments,
  });
}
