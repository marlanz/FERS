// Imported from the centralized status module and re-exported so that all
// existing `import type { EquipmentStatus } from "@/types/equipment"` imports
// continue to work without any path changes across the codebase.
import type { EquipmentStatus } from "@/lib/constants/equipment-status";
export type { EquipmentStatus };

export interface EquipmentGroup {
  level1: string;
  level2: string;
  level3: string;
  level4: string;
}

export interface Organization {
  legalEntity: string;
  factory: string;
  workshop: string;
  layout: string;
  workCenter: string;
  area?: string;
}

export interface Manufacturer {
  country: string;
  brand: string;
  model: string;
  produceYear: number | null;
}

export interface Equipment {
  _id?: string;

  no: number;

  equipmentName: string;
  equipmentCode: string;

  equipmentGroup: EquipmentGroup;

  organization: Organization;

  manufacturer: Manufacturer;

  specification?: string;

  installationLocation?: string;

  note?: string;

  status: EquipmentStatus;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface EquipmentFilters {
  factories: string[];
  workshops: string[];
  workCenters: string[];
  layouts: string[];
  group1s: string[];
  group2s: string[];
  brands: string[];
  countries: string[];
  produceYears: string[];
  statuses: string[];
}
